import { apiService } from './api.service';

// Interfaces
export interface User {
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

class AuthService {
  // Iniciar sesión
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      return await apiService.login(credentials.email, credentials.password);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  // Registrarse
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      return await apiService.register(data);
    } catch (error) {
      console.error('Error al registrarse:', error);
      throw error;
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  // Verificar si el usuario está autenticado
  async isAuthenticated(): Promise<boolean> {
    return await apiService.isAuthenticated();
  }

  // Obtener el usuario actual
  async getCurrentUser(): Promise<User | null> {
    return await apiService.getCurrentUser();
  }
  
  // Obtener el perfil completo del usuario
  async getUserProfile(): Promise<UserProfile> {
    try {
      const user = await this.getCurrentUser();
      
      if (!user) {
        throw new Error('No se encontró información del usuario');
      }
      
      // Obtenemos datos adicionales del perfil del usuario
      const profileData = await apiService.get(`/users/${user.id}/profile`);
      
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
      return await apiService.put('/users/me', data);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error;
    }
  }

  // Cambiar contraseña
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    try {
      await apiService.put('/users/me/password', {
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
      await apiService.post('/auth/forgot-password', { email });
    } catch (error) {
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      throw error;
    }
  }

  // Restablecer contraseña
  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await apiService.post('/auth/reset-password', {
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