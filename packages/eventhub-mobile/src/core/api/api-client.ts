import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT, MOCK_MODE } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockService } from '../services/mock.service';

// Definir un adaptador mock para axios
const mockAdapter = {
  get: async (url: string) => {
    console.log(`[MOCK] GET request to ${url}`);
    
    // Extraer la ruta y los parámetros
    const path = url.split('?')[0];
    
    // Implementar respuestas mock basadas en la URL
    if (path === '/events' || path === '/events/upcoming') {
      return { data: await mockService.getEvents() };
    }
    
    if (path === '/events/featured') {
      return { data: await mockService.getFeaturedEvents() };
    }
    
    if (path.startsWith('/events/search')) {
      const query = url.includes('?q=') ? url.split('?q=')[1].split('&')[0] : '';
      return { data: await mockService.searchEvents(query) };
    }
    
    if (path.startsWith('/events/') && path.includes('/id/')) {
      const id = path.split('/id/')[1];
      return { data: await mockService.getEventById(id) };
    }
    
    if (path === '/categories') {
      return { data: await mockService.getCategories() };
    }
    
    if (path === '/auth/me' || path === '/user') {
      return { data: await mockService.getCurrentUser() };
    }
    
    if (path === '/notifications') {
      return { data: await mockService.getNotifications() };
    }
    
    // Si no hay una implementación específica, devolver un array vacío
    console.warn(`[MOCK] No implementation for GET ${path}`);
    return { data: [] };
  },
  
  post: async (url: string, data: any) => {
    console.log(`[MOCK] POST request to ${url}`, data);
    
    if (url === '/auth/login') {
      return { data: await mockService.login(data.email, data.password) };
    }
    
    if (url === '/auth/register') {
      return { data: await mockService.register(data) };
    }
    
    if (url.includes('/events') && url.includes('/comments')) {
      const eventId = url.split('/events/')[1].split('/comments')[0];
      return { data: await mockService.addComment(eventId, data.text, data.rating || 5) };
    }
    
    if (url.includes('/events') && url.includes('/attend')) {
      const eventId = url.split('/events/')[1].split('/attend')[0];
      return { data: { success: await mockService.attendEvent(eventId) } };
    }
    
    if (url === '/events') {
      // Simular creación de evento
      return { data: { ...data, id: `event${Date.now()}` } };
    }
    
    console.warn(`[MOCK] No implementation for POST ${url}`);
    return { data: { success: true } };
  },
  
  put: async (url: string, data: any) => {
    console.log(`[MOCK] PUT request to ${url}`, data);
    // Simular éxito
    return { data: { ...data, id: url.split('/').pop() } };
  },
  
  delete: async (url: string) => {
    console.log(`[MOCK] DELETE request to ${url}`);
    
    if (url.includes('/events') && url.includes('/attend')) {
      const eventId = url.split('/events/')[1].split('/attend')[0];
      return { data: { success: await mockService.cancelAttendance(eventId) } };
    }
    
    // Simular éxito para otras peticiones
    return { data: { success: true } };
  }
};

/**
 * Cliente API principal para comunicarse con el backend
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para agregar el token de autenticación a las peticiones
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving auth token:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Manejar errores de autenticación (401)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Intentar refrescar el token
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          
          const { access_token, refresh_token } = response.data;
          
          // Guardar los nuevos tokens
          await AsyncStorage.setItem('auth_token', access_token);
          await AsyncStorage.setItem('refresh_token', refresh_token);
          
          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        
        // Si no podemos refrescar el token, limpiamos el storage y redirigimos al login
        await AsyncStorage.multiRemove(['auth_token', 'refresh_token', 'user']);
      }
    }
    
    return Promise.reject(error);
  }
);

// Exportar el cliente de API original o el mock según la configuración
const clientToExport = MOCK_MODE ? mockAdapter : apiClient;

export { clientToExport as apiClient }; 