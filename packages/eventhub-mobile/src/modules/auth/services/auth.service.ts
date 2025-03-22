import { apiClient } from '@core/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User as UserType, LoginCredentials as LoginCredentialsType, RegisterData as RegisterDataType, AuthResponse as AuthResponseType } from '../types';

// Interfaces para compatibilidad - Usar para migración gradual
export interface User extends Partial<UserType> {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role: string;
  createdAt: string;
}

// Interfaz para el perfil extendido del usuario
export interface UserProfile extends User {
  avatarUrl?: string;
  nombre?: string;
  eventosCreados?: any[];
  eventosAsistidos?: any[];
}

export interface LoginCredentials extends Partial<LoginCredentialsType> {
  email: string;
  password: string;
}

export interface RegisterData extends Partial<RegisterDataType> {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse extends Partial<AuthResponseType> {
  user: User;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  // Iniciar sesión
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      // Guardar token en AsyncStorage
      await AsyncStorage.setItem('auth_token', response.data.accessToken);
      return response.data.user;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  // Registrarse
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiClient.post('/auth/register', data);
      // Guardar token en AsyncStorage
      await AsyncStorage.setItem('auth_token', response.data.accessToken);
      return response.data;
    } catch (error) {
      console.error('Error al registrarse:', error);
      throw error;
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
      // Eliminar token de AsyncStorage
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  // Verificar si el usuario está autenticado
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return !!token;
    } catch (error) {
      return false;
    }
  }

  // Obtener el usuario actual
  async getCurrentUser(): Promise<User | null> {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) return null;
      
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }
  
  // Obtener el perfil completo del usuario
  async getUserProfile(): Promise<UserProfile> {
    try {
      const user = await this.getCurrentUser();
      
      if (!user) {
        throw new Error('No se encontró información del usuario');
      }
      
      // Obtenemos datos adicionales del perfil del usuario
      const profileData = await apiClient.get(`/users/${user.id}/profile`);
      
      // Combinamos la información básica del usuario con los datos adicionales del perfil
      return {
        ...user,
        nombre: user.name,
        avatarUrl: user.profilePicture,
        eventosCreados: profileData.eventsCreated || [],
        eventosAsistidos: profileData.eventsAttending || []
      };
    } catch (error) {
      console.error('Error al obtener perfil de usuario:', error);
      
      // Si hay un error en la API, devolvemos los datos básicos que tengamos
      const user = await this.getCurrentUser();
      return {
        ...user,
        nombre: user?.name,
        avatarUrl: user?.profilePicture,
        eventosCreados: [],
        eventosAsistidos: []
      };
    }
  }

  // Actualizar perfil de usuario
  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      return await apiClient.put('/users/me', data);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  }

  // Cambiar contraseña
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiClient.put('/users/me/password', {
        currentPassword,
        newPassword,
      });
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw error;
    }
  }

  // Solicitar restablecimiento de contraseña
  async requestPasswordReset(email: string): Promise<void> {
    try {
      await apiClient.post('/auth/forgot-password', { email });
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      throw error;
    }
  }

  // Restablecer contraseña
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiClient.post('/auth/reset-password', {
        token,
        newPassword,
      });
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      throw error;
    }
  }
}

// Exportar una instancia única del servicio
export const authService = new AuthService(); 