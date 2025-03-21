import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuración por defecto
const API_URL = 'http://10.0.2.2:3000'; // URL para acceso desde WSA (10.0.2.2 apunta al host de Windows)
// También puedes usar la IP real de tu PC en tu red local, por ejemplo: 'http://192.168.1.XX:3000'

class ApiClient {
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
            await this.clearTokens();
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  // Método para limpiar tokens
  async clearTokens() {
    try {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user');
      this.token = null;
    } catch (error) {
      console.error('Error al limpiar tokens:', error);
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

// Exportar una instancia única del cliente
export const apiClient = new ApiClient(); 