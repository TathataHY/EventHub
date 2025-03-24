import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_TIMEOUT } from '@core/config';
import { mockApiClient } from '@core/api/mock-api-client';
import { User as UserType, UserProfile as UserProfileType, PublicUserProfile as PublicUserProfileType, UserRole, AccountStatus } from '../../users/types/user.types';
import { LoginCredentials as LoginCredentialsType, RegisterData as RegisterDataType, AuthResponse as AuthResponseType } from '../types';

// Interfaces para compatibilidad - Usar para migración gradual
export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role?: string;
  createdAt?: string;
}

// Interfaz para el perfil extendido del usuario
export interface UserProfile {
  id: string;
  name?: string;
  email: string;
  profilePicture?: string;
  photoURL?: string;
  role?: string | UserRole;
  createdAt?: string;
  fullName?: string;
  followers?: PublicUserProfile[] | string[];
  following?: PublicUserProfile[] | string[];
  // Campos adicionales para compatibilidad
  eventsCreated?: any[];
  eventsAttending?: any[];
  eventsAttended?: number;
  eventsOrganized?: number;
  followersCount?: number;
  followingCount?: number;
}

export interface PublicUserProfile {
  id: string;
  name: string;
  profilePicture?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private apiUrl: string;
  private token: string | null = null;

  constructor() {
    this.apiUrl = '';
  }

  /**
   * Iniciar sesión
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Simulamos una petición a API
      const response = await this.mockLogin(credentials);
      
      // Guardar token
      this.token = response.accessToken;
      await this.saveToken(response.accessToken);
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Registrar usuario
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Simulamos una petición a API
      const response = await this.mockRegister(data);
      
      // Guardar token
      this.token = response.accessToken;
      await this.saveToken(response.accessToken);
      
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      this.token = null;
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  /**
   * Solicitar restablecimiento de contraseña
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean }> {
    try {
      // Simulamos una petición a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar que el email existe
      const userExists = mockApiClient._getMockUsers().some(user => user.email === email);
      
      if (!userExists) {
        throw new Error('No se encontró ninguna cuenta con ese correo electrónico');
      }
      
      return { success: true };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Restablecer contraseña
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean }> {
    try {
      // Simulamos una petición a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar token (simulado)
      if (token.length < 5) {
        throw new Error('Token inválido');
      }
      
      return { success: true };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Obtener perfil del usuario
   */
  async getUserProfile(userId?: string): Promise<UserProfile> {
    try {
      if (!userId) {
        const currentUserId = await this.getCurrentUserId();
        if (!currentUserId) {
          throw new Error('Usuario no autenticado');
        }
        userId = currentUserId;
      }
      
      // Obtener datos de usuario (mock)
      const user = mockApiClient._getMockUsers().find(u => u.id === userId);
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      
      // Crear perfil de usuario con datos compatibles
      const userProfile: UserProfile = {
        id: user.id,
        name: user.name,                   
        fullName: user.name,               
        email: user.email,
        profilePicture: user.profilePicture, 
        photoURL: user.profilePicture,     
        role: user.role,
        createdAt: user.createdAt,
        eventsCreated: [],                
        eventsAttending: [],
        eventsAttended: 0,                
        eventsOrganized: 0,
        followersCount: 0,
        followingCount: 0,
        followers: [],                    
        following: []
      };
      
      return userProfile;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener token actual
   */
  async getToken(): Promise<string | null> {
    if (this.token) {
      return this.token;
    }
    
    try {
      const token = await AsyncStorage.getItem('auth_token');
      this.token = token;
      return token;
    } catch (error) {
      console.error('Error al obtener token:', error);
      return null;
    }
  }

  /**
   * Guardar token
   */
  private async saveToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Error al guardar token:', error);
    }
  }

  /**
   * Obtener ID del usuario actual
   */
  private async getCurrentUserId(): Promise<string | null> {
    try {
      // En una implementación real, decodificaríamos el token
      // Para el ejemplo, usamos el primer usuario
      return mockApiClient._getMockUsers()[0].id;
    } catch (error) {
      console.error('Error al obtener ID de usuario:', error);
      return null;
    }
  }

  /**
   * Simulación de login (solo para desarrollo)
   */
  private async mockLogin(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulamos un tiempo de respuesta
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Validación simple para desarrollo
    if (credentials.email !== 'test@example.com' || credentials.password !== 'password') {
      throw new Error('Credenciales inválidas');
    }
    
    // Usuario demo
    const user: User = {
      id: 'user1',
      name: 'Usuario de Prueba',
      email: credentials.email,
      profilePicture: 'https://randomuser.me/api/portraits/lego/1.jpg',
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    // Token demo
    const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
    
    // Guardar token
    await this.saveToken(token);
    this.token = token;
    
    return {
      user,
      accessToken: token,
      refreshToken: 'mock-refresh-token'
    };
  }

  /**
   * Mock de registro para pruebas
   */
  private async mockRegister(userData: RegisterData): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulación básica para desarrollo
    // En un entorno real, aquí verificaríamos si el email ya existe
    
    // Crear nuevo usuario (simulado)
    const newUser: User = {
      id: 'new-user-' + Date.now(),
      name: userData.name,
      email: userData.email,
      profilePicture: 'https://randomuser.me/api/portraits/lego/1.jpg',
      role: 'user',
      createdAt: new Date().toISOString()
    };
    
    // Token simulado
    const token = 'mock-jwt-token-' + Math.random().toString(36).substring(2);
    
    // Guardar token
    await this.saveToken(token);
    this.token = token;
    
    return {
      user: newUser,
      accessToken: token,
      refreshToken: 'mock-refresh-token'
    };
  }

  /**
   * Manejar errores
   */
  private handleError(error: any): Error {
    if (error.response) {
      // Error de respuesta del servidor
      return new Error(
        error.response.data.message || 
        'Error en el servidor'
      );
    } else if (error.request) {
      // Error de red
      return new Error('Error de red. Verifica tu conexión a internet');
    } else {
      // Otros errores
      return error instanceof Error 
        ? error 
        : new Error('Error desconocido');
    }
  }

  /**
   * Obtiene el usuario actual autenticado
   * @returns Los datos del usuario actual o null si no hay usuario
   */
  async getCurrentUser(): Promise<UserProfile | null> {
    try {
      // Verificar autenticación
      const isAuth = await this.isAuthenticated();
      if (!isAuth) {
        return null;
      }
      
      // Obtener ID del usuario actual
      const userId = await this.getCurrentUserId();
      if (!userId) {
        return null;
      }
      
      // Usar función existente para obtener perfil
      try {
        const userProfile = await this.getUserProfile(userId);
        return userProfile;
      } catch (error) {
        console.error('Error al obtener perfil de usuario:', error);
        return null;
      }
    } catch (error) {
      console.error('Error en getCurrentUser:', error);
      return null;
    }
  }

  /**
   * Cambia la contraseña del usuario actual
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<boolean> {
    try {
      // Simular un cambio de contraseña
      await new Promise(resolve => setTimeout(resolve, 800));
      // En una implementación real, haríamos una petición al servidor
      return true;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      throw new Error('No se pudo cambiar la contraseña');
    }
  }
}

// Exportar una instancia única del servicio
export const authService = new AuthService(); 