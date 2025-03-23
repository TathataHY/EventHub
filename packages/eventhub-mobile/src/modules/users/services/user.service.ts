import { apiClient } from '@core/api/api-client';
import { mockApiClient } from '@core/api/mock-api-client';
import { PublicUserProfile, UserProfile, UserAppPreferences, UserLocation, InterestCategory, ProfileUpdateData, SavedEventResponse, UserEventsResponse, UserStats } from '../types/user.types';
import { mockService } from '@core/services/mock.service';
import { MOCK_MODE } from '@core/config';
import { MOCK_USER_PROFILE } from '@core/mocks/user.mock';

/**
 * Servicio para gestionar operaciones relacionadas con usuarios
 */
class UserService {
  private client = MOCK_MODE ? mockApiClient : apiClient;
  private baseUrl = '/users';

  /**
   * Obtener perfil del usuario actual
   */
  async getCurrentUserProfile(): Promise<UserProfile> {
    try {
      const response = await this.client.get(`${this.baseUrl}/me`);
      return response.data;
    } catch (error) {
      console.error('Error fetching current user profile:', error);
      throw error;
    }
  }

  /**
   * Obtener perfil de usuario por ID
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const response = await this.client.get(`${this.baseUrl}/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user profile for ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Actualizar perfil de usuario
   */
  async updateUserProfile(userData: Partial<ProfileUpdateData>): Promise<UserProfile> {
    try {
      const response = await this.client.put(`${this.baseUrl}/profile`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Obtener estadísticas del usuario
   */
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      const response = await this.client.get(`${this.baseUrl}/${userId}/stats`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user stats for ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener eventos creados por el usuario
   */
  async getUserEvents(userId: string, page = 1, limit = 10): Promise<UserEventsResponse> {
    try {
      const response = await this.client.get(
        `${this.baseUrl}/${userId}/events`,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching events for user ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener eventos a los que asiste el usuario
   */
  async getUserAttendingEvents(userId: string, page = 1, limit = 10): Promise<UserEventsResponse> {
    try {
      const response = await this.client.get(
        `${this.baseUrl}/${userId}/attending`,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching attending events for user ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener eventos guardados por el usuario
   */
  async getSavedEvents(userId: string, page = 1, limit = 10): Promise<UserEventsResponse> {
    try {
      const response = await this.client.get(
        `${this.baseUrl}/${userId}/saved-events`,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching saved events for user ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Guardar/remover un evento de favoritos
   */
  async toggleSaveEvent(eventId: string): Promise<SavedEventResponse> {
    try {
      const response = await this.client.post(`/events/${eventId}/save`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling save for event ID ${eventId}:`, error);
      throw error;
    }
  }

  /**
   * Seguir/dejar de seguir a un usuario
   */
  async toggleFollowUser(userId: string): Promise<{ success: boolean; following: boolean }> {
    try {
      const response = await this.client.post(`${this.baseUrl}/${userId}/follow`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling follow for user ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener seguidores del usuario
   */
  async getUserFollowers(userId: string, page = 1, limit = 20): Promise<{ users: UserProfile[]; total: number }> {
    try {
      const response = await this.client.get(
        `${this.baseUrl}/${userId}/followers`,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching followers for user ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener usuarios que sigue el usuario
   */
  async getUserFollowing(userId: string, page = 1, limit = 20): Promise<{ users: UserProfile[]; total: number }> {
    try {
      const response = await this.client.get(
        `${this.baseUrl}/${userId}/following`,
        { params: { page, limit } }
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching following for user ID ${userId}:`, error);
      throw error;
    }
  }

  // Obtener perfil del usuario actual
  async getProfile(): Promise<UserProfile> {
    try {
      // En un entorno real, esto haría una solicitud a la API
      // const response = await apiService.get('/users/profile');
      // return response.data;
      
      // Para desarrollo, usamos datos simulados
      return mockService.getMockData('userProfile', {
        id: '123',
        username: 'usuario_prueba',
        email: 'usuario@ejemplo.com',
        fullName: 'Usuario de Prueba',
        photoURL: 'https://randomuser.me/api/portraits/men/1.jpg',
        bio: 'Entusiasta de eventos y conciertos. Me encanta conocer gente nueva y descubrir lugares interesantes.',
        phoneNumber: '+34612345678',
        location: {
          city: 'Madrid',
          state: 'Madrid',
          country: 'España'
        },
        interests: [
          InterestCategory.MUSIC,
          InterestCategory.FOOD,
          InterestCategory.TECHNOLOGY
        ],
        followersCount: 125,
        followingCount: 87,
        eventsAttended: 32,
        eventsOrganized: 8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error al obtener el perfil:', error);
      throw error;
    }
  }
  
  // Obtener perfil de un usuario público
  async getUserProfilePublic(userId: string): Promise<PublicUserProfile> {
    try {
      // En un entorno real, esto haría una solicitud a la API
      // const response = await apiService.get(`/users/${userId}`);
      // return response.data;
      
      // Para desarrollo, usamos datos simulados
      return mockService.getMockData(`userProfile_${userId}`, {
        id: userId,
        username: `usuario_${userId.substring(0, 4)}`,
        fullName: `Usuario ${userId.substring(0, 4)}`,
        photoURL: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
        bio: 'Aficionado a los eventos culturales y viajes. Me gusta compartir experiencias y conocer lugares nuevos.',
        location: {
          city: 'Barcelona',
          state: 'Cataluña',
          country: 'España'
        },
        interests: [
          InterestCategory.TRAVEL,
          InterestCategory.ARTS,
          InterestCategory.SPORTS
        ],
        followersCount: Math.floor(Math.random() * 500),
        followingCount: Math.floor(Math.random() * 300),
        eventsAttended: Math.floor(Math.random() * 50),
        eventsOrganized: Math.floor(Math.random() * 10),
        isFollowing: Math.random() > 0.5,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Error al obtener el perfil del usuario ${userId}:`, error);
      throw error;
    }
  }
  
  // Actualizar perfil del usuario
  async updateProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    try {
      // En un entorno real, esto haría una solicitud a la API
      // const response = await apiService.put('/users/profile', profileData);
      // return response.data;
      
      // Para desarrollo, simulamos la actualización
      const currentProfile = await this.getProfile();
      const updatedProfile = { ...currentProfile, ...profileData, updatedAt: new Date().toISOString() };
      
      // Guardar en el almacenamiento simulado
      mockService.setMockData('userProfile', updatedProfile);
      
      return updatedProfile;
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      throw error;
    }
  }
  
  // Actualizar foto de perfil
  async updateProfilePhoto(photoURI: string): Promise<{ photoURL: string }> {
    try {
      // En un entorno real, esto cargaría la foto y luego actualizaría el perfil
      // const formData = new FormData();
      // formData.append('photo', { uri: photoURI, name: 'photo.jpg', type: 'image/jpeg' });
      // const response = await apiService.post('/users/profile/photo', formData);
      // return response.data;
      
      // Para desarrollo, simulamos la actualización
      const currentProfile = await this.getProfile();
      const updatedProfile = { 
        ...currentProfile, 
        photoURL: photoURI,
        updatedAt: new Date().toISOString() 
      };
      
      // Guardar en el almacenamiento simulado
      mockService.setMockData('userProfile', updatedProfile);
      
      return { photoURL: photoURI };
    } catch (error) {
      console.error('Error al actualizar la foto de perfil:', error);
      throw error;
    }
  }
  
  // Obtener preferencias del usuario
  async getPreferences(): Promise<UserAppPreferences> {
    try {
      // En un entorno real, esto haría una solicitud a la API
      // const response = await apiService.get('/users/preferences');
      // return response.data;
      
      // Para desarrollo, usamos datos simulados
      return mockService.getMockData('userPreferences', {
        notificationsEnabled: true,
        emailNotificationsEnabled: true,
        eventRemindersEnabled: true,
        eventReminderTime: 60, // minutos antes del evento
        darkModeEnabled: false,
        language: 'es',
        currency: 'EUR',
        privacySettings: {
          profileVisibility: 'public',
          showLocation: true,
          showUpcomingEvents: true
        },
        categories: [
          InterestCategory.MUSIC,
          InterestCategory.FOOD,
          InterestCategory.TECHNOLOGY
        ]
      });
    } catch (error) {
      console.error('Error al obtener preferencias:', error);
      throw error;
    }
  }
  
  // Actualizar preferencias del usuario
  async updatePreferences(preferences: Partial<UserAppPreferences>): Promise<UserAppPreferences> {
    try {
      // En un entorno real, esto haría una solicitud a la API
      // const response = await apiService.put('/users/preferences', preferences);
      // return response.data;
      
      // Para desarrollo, simulamos la actualización
      const currentPreferences = await this.getPreferences();
      const updatedPreferences = { ...currentPreferences, ...preferences };
      
      // Guardar en el almacenamiento simulado
      mockService.setMockData('userPreferences', updatedPreferences);
      
      return updatedPreferences;
    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
      throw error;
    }
  }
  
  // Bloquear usuario
  async blockUser(userId: string): Promise<boolean> {
    try {
      // En un entorno real, esto haría una solicitud a la API
      // await apiService.post(`/users/${userId}/block`);
      
      // Para desarrollo, simulamos el éxito
      return true;
    } catch (error) {
      console.error(`Error al bloquear al usuario ${userId}:`, error);
      throw error;
    }
  }
  
  // Reportar usuario
  async reportUser(userId: string, reason: string): Promise<boolean> {
    try {
      // En un entorno real, esto haría una solicitud a la API
      // await apiService.post(`/users/${userId}/report`, { reason });
      
      // Para desarrollo, simulamos el éxito
      return true;
    } catch (error) {
      console.error(`Error al reportar al usuario ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener preferencias predeterminadas del usuario
   */
  async getDefaultPreferences(): Promise<UserAppPreferences> {
    try {
      if (MOCK_MODE) {
        return {
          notificationsEnabled: true,
          emailNotificationsEnabled: true,
          eventRemindersEnabled: true,
          darkModeEnabled: false,
          language: 'es',
          privacySettings: {
            profileVisibility: 'public',
            locationSharing: false,
            activitySharing: true,
            showLocation: true,
            showUpcomingEvents: true
          },
          displaySettings: {
            showEventDistance: true,
            listViewPreferred: false,
            showPrices: true
          },
          categories: []
        };
      }
      
      const response = await this.client.get(`${this.baseUrl}/preferences/default`);
      return response.data;
    } catch (error) {
      console.error('Error fetching default user preferences:', error);
      throw error;
    }
  }

  /**
   * Obtener intereses del usuario
   */
  async getUserInterests(): Promise<InterestCategory[]> {
    try {
      const profile = await this.getCurrentUserProfile();
      return profile.interests || [];
    } catch (error) {
      console.error('Error fetching user interests:', error);
      throw error;
    }
  }

  /**
   * Actualizar intereses del usuario
   */
  async updateUserInterests(interests: InterestCategory[]): Promise<{ success: boolean; interests: InterestCategory[] }> {
    try {
      await this.updateUserProfile({ interests });
      return {
        success: true,
        interests
      };
    } catch (error) {
      console.error('Error updating user interests:', error);
      throw error;
    }
  }

  /**
   * Seguir a un usuario
   */
  async followUser(userId: string): Promise<boolean> {
    try {
      const result = await this.toggleFollowUser(userId);
      return result.following;
    } catch (error) {
      console.error(`Error following user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Dejar de seguir a un usuario
   */
  async unfollowUser(userId: string): Promise<boolean> {
    try {
      const result = await this.toggleFollowUser(userId);
      return !result.following;
    } catch (error) {
      console.error(`Error unfollowing user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Obtener el perfil del usuario actual
   */
  async getCurrentUser(): Promise<any> {
    try {
      // Implementación temporal usando getCurrentUserProfile
      return this.getCurrentUserProfile();
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }
}

export const userService = new UserService();

/**
 * Servicio para manejar operaciones relacionadas con usuarios
 */
export const userServiceHandler = {
  /**
   * Obtiene la información del perfil del usuario
   * @returns Datos del perfil del usuario
   */
  getUserProfile: async () => {
    // En producción, esto haría una llamada a la API
    return new Promise((resolve) => {
      // Simulamos un delay de red
      setTimeout(() => {
        resolve(MOCK_USER_PROFILE);
      }, 700);
    });
  },

  /**
   * Actualiza la información del perfil del usuario
   * @param userData Datos actualizados del usuario
   * @returns Confirmación de la actualización
   */
  updateUserProfile: async (userData: Partial<ProfileUpdateData>): Promise<{success: boolean; user: UserProfile}> => {
    // En producción, esto haría una llamada PUT a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          user: { ...MOCK_USER_PROFILE, ...userData }
        });
      }, 800);
    });
  },

  /**
   * Cambia la contraseña del usuario
   * @param currentPassword Contraseña actual
   * @param newPassword Nueva contraseña
   * @returns Confirmación del cambio
   */
  changePassword: async (currentPassword: string, newPassword: string) => {
    // En producción, esto haría una llamada POST a la API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulamos validación de contraseña actual
        if (currentPassword === 'password123') {
          resolve({
            success: true,
            message: 'Contraseña actualizada correctamente'
          });
        } else {
          reject({
            success: false,
            message: 'La contraseña actual es incorrecta'
          });
        }
      }, 1000);
    });
  },

  /**
   * Obtiene los intereses del usuario
   * @returns Lista de categorías de interés
   */
  getUserInterests: async () => {
    // En producción, esto haría una llamada a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_USER_PROFILE.interests || []);
      }, 500);
    });
  },

  /**
   * Actualiza los intereses del usuario
   * @param interests Lista de IDs de intereses
   * @returns Confirmación de la actualización
   */
  updateUserInterests: async (interests: InterestCategory[]) => {
    // En producción, esto haría una llamada PUT a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          interests
        });
      }, 600);
    });
  }
}; 