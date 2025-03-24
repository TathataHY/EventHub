import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
        
        // Aquí podrías implementar algún mecanismo para notificar a la app
        // que necesita redirigir al usuario a la pantalla de login
      }
    }
    
    return Promise.reject(error);
  }
);

export { apiClient }; 