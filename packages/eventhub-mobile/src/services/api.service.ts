import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración por defecto
const API_URL = 'http://10.0.2.2:3000'; // URL para acceso desde WSA (10.0.2.2 apunta al host de Windows)
// También puedes usar la IP real de tu PC en tu red local, por ejemplo: 'http://192.168.1.XX:3000'

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Interceptor para añadir el token a las peticiones
    this.api.interceptors.request.use(
      async (config) => {
        if (!this.token) {
          this.token = await AsyncStorage.getItem('auth_token');
        }
        
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Interceptor para manejar errores de respuesta
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // Si el error es 401 (Unauthorized) y no es un reintento
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          // Intentar refrescar el token
          try {
            const refreshToken = await AsyncStorage.getItem('refresh_token');
            if (refreshToken) {
              const response = await this.post('/auth/refresh', { refreshToken });
              const { accessToken } = response.data;
              
              await AsyncStorage.setItem('auth_token', accessToken);
              this.token = accessToken;
              
              // Reintentar la petición original con el nuevo token
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            // Si falla el refresh, limpiar tokens y redirigir a login
            await this.logout();
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Método para iniciar sesión
  async login(email: string, password: string) {
    try {
      const response = await this.post('/auth/login', { email, password });
      const { accessToken, refreshToken, user } = response.data;
      
      await AsyncStorage.setItem('auth_token', accessToken);
      await AsyncStorage.setItem('refresh_token', refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      this.token = accessToken;
      
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Método para registrarse
  async register(userData: any) {
    try {
      const response = await this.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Método para cerrar sesión
  async logout() {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user');
      this.token = null;
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  // Verificar si el usuario está autenticado
  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  // Obtener el usuario actual
  async getCurrentUser() {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      return null;
    }
  }

  // Métodos HTTP genéricos
  async get(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async post(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async put(url: string, data?: any, config?: AxiosRequestConfig) {
    try {
      const response = await this.api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async delete(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await this.api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

// Exportar una instancia única del servicio
export const apiService = new ApiService(); 