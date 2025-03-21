import { apiService } from '../../../services/api.service';
import { PublicUserProfile, UserProfile, UserPreferences, UserLocation, InterestCategory } from '../types';
import { mockService } from '../../../services/mock.service';

class UserService {
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
  async getUserProfile(userId: string): Promise<PublicUserProfile> {
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
  async getPreferences(): Promise<UserPreferences> {
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
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences> {
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
  
  // Seguir a un usuario
  async followUser(userId: string): Promise<boolean> {
    try {
      // En un entorno real, esto haría una solicitud a la API
      // await apiService.post(`/users/${userId}/follow`);
      
      // Para desarrollo, simulamos el éxito
      return true;
    } catch (error) {
      console.error(`Error al seguir al usuario ${userId}:`, error);
      throw error;
    }
  }
  
  // Dejar de seguir a un usuario
  async unfollowUser(userId: string): Promise<boolean> {
    try {
      // En un entorno real, esto haría una solicitud a la API
      // await apiService.delete(`/users/${userId}/follow`);
      
      // Para desarrollo, simulamos el éxito
      return true;
    } catch (error) {
      console.error(`Error al dejar de seguir al usuario ${userId}:`, error);
      throw error;
    }
  }
  
  // Obtener seguidores
  async getFollowers(userId?: string, page = 1, limit = 20): Promise<PublicUserProfile[]> {
    try {
      // En un entorno real, esto haría una solicitud a la API
      // const targetId = userId || 'me';
      // const response = await apiService.get(`/users/${targetId}/followers`, { params: { page, limit } });
      // return response.data;
      
      // Para desarrollo, usamos datos simulados
      return Array.from({ length: 10 }).map((_, index) => ({
        id: `follower_${index + 1}`,
        username: `seguidor_${index + 1}`,
        fullName: `Seguidor ${index + 1}`,
        photoURL: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
        followersCount: Math.floor(Math.random() * 500),
        followingCount: Math.floor(Math.random() * 300),
        eventsAttended: Math.floor(Math.random() * 50),
        eventsOrganized: Math.floor(Math.random() * 10),
        interests: Object.values(InterestCategory).sort(() => Math.random() - 0.5).slice(0, 3) as InterestCategory[],
        isFollowing: Math.random() > 0.7,
        createdAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error al obtener seguidores:', error);
      throw error;
    }
  }
  
  // Obtener usuarios que sigo
  async getFollowing(userId?: string, page = 1, limit = 20): Promise<PublicUserProfile[]> {
    try {
      // En un entorno real, esto haría una solicitud a la API
      // const targetId = userId || 'me';
      // const response = await apiService.get(`/users/${targetId}/following`, { params: { page, limit } });
      // return response.data;
      
      // Para desarrollo, usamos datos simulados
      return Array.from({ length: 10 }).map((_, index) => ({
        id: `following_${index + 1}`,
        username: `siguiendo_${index + 1}`,
        fullName: `Siguiendo ${index + 1}`,
        photoURL: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
        followersCount: Math.floor(Math.random() * 500),
        followingCount: Math.floor(Math.random() * 300),
        eventsAttended: Math.floor(Math.random() * 50),
        eventsOrganized: Math.floor(Math.random() * 10),
        interests: Object.values(InterestCategory).sort(() => Math.random() - 0.5).slice(0, 3) as InterestCategory[],
        isFollowing: true, // Siempre true ya que estamos siguiendo a estos usuarios
        createdAt: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error al obtener usuarios seguidos:', error);
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
}

export const userService = new UserService(); 