import AsyncStorage from '@react-native-async-storage/async-storage';
import { recommendationService } from './recommendation.service';
import { eventService } from './event.service';

// Clave para almacenar los favoritos en AsyncStorage
const BOOKMARKS_STORAGE_KEY = 'userBookmarkedEvents';

// Interfaz para el item de favorito
interface BookmarkItem {
  userId: string;
  eventId: string;
  savedAt: string;
}

class BookmarkService {
  /**
   * Obtiene todos los eventos guardados por un usuario
   * @param userId ID del usuario
   * @returns Array con IDs de eventos guardados
   */
  async getUserBookmarks(userId: string): Promise<string[]> {
    try {
      // En producción, esto sería una llamada a API
      // return await api.get(`/users/${userId}/bookmarks`);
      
      const storedBookmarks = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (!storedBookmarks) {
        return [];
      }
      
      const bookmarks: BookmarkItem[] = JSON.parse(storedBookmarks);
      return bookmarks
        .filter(bookmark => bookmark.userId === userId)
        .map(bookmark => bookmark.eventId);
    } catch (error) {
      console.error('Error al obtener favoritos:', error);
      return [];
    }
  }

  /**
   * Verifica si un evento está en favoritos
   * @param userId ID del usuario
   * @param eventId ID del evento
   * @returns true si el evento está en favoritos, false en caso contrario
   */
  async isEventBookmarked(userId: string, eventId: string): Promise<boolean> {
    try {
      const bookmarks = await this.getUserBookmarks(userId);
      return bookmarks.includes(eventId);
    } catch (error) {
      console.error('Error al verificar favorito:', error);
      return false;
    }
  }

  /**
   * Añade un evento a favoritos
   * @param userId ID del usuario
   * @param eventId ID del evento
   */
  async addBookmark(userId: string, eventId: string): Promise<void> {
    try {
      // En producción, esto sería una llamada a API
      // return await api.post(`/users/${userId}/bookmarks`, { eventId });
      
      const storedBookmarks = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
      const bookmarks: BookmarkItem[] = storedBookmarks 
        ? JSON.parse(storedBookmarks) 
        : [];
      
      // Verificar si ya existe
      const existing = bookmarks.find(
        b => b.userId === userId && b.eventId === eventId
      );
      
      if (!existing) {
        // Añadir nuevo favorito
        bookmarks.push({
          userId,
          eventId,
          savedAt: new Date().toISOString()
        });
        
        await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(bookmarks));
      }
    } catch (error) {
      console.error('Error al añadir favorito:', error);
      throw new Error('No se pudo añadir el evento a favoritos');
    }
  }

  /**
   * Elimina un evento de favoritos
   * @param userId ID del usuario
   * @param eventId ID del evento
   */
  async removeBookmark(userId: string, eventId: string): Promise<void> {
    try {
      // En producción, esto sería una llamada a API
      // return await api.delete(`/users/${userId}/bookmarks/${eventId}`);
      
      const storedBookmarks = await AsyncStorage.getItem(BOOKMARKS_STORAGE_KEY);
      if (!storedBookmarks) {
        return;
      }
      
      const bookmarks: BookmarkItem[] = JSON.parse(storedBookmarks);
      const updatedBookmarks = bookmarks.filter(
        bookmark => !(bookmark.userId === userId && bookmark.eventId === eventId)
      );
      
      await AsyncStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
      throw new Error('No se pudo eliminar el evento de favoritos');
    }
  }

  /**
   * Alterna el estado de favorito de un evento
   * @param userId ID del usuario
   * @param eventId ID del evento
   * @returns El nuevo estado (true si se añadió, false si se eliminó)
   */
  async toggleBookmark(userId: string, eventId: string): Promise<boolean> {
    try {
      const key = `bookmarks_${userId}`;
      const bookmarksData = await AsyncStorage.getItem(key);
      let bookmarks = bookmarksData ? JSON.parse(bookmarksData) : [];
      
      // Comprobar si el evento ya está en favoritos
      const index = bookmarks.findIndex((bookmark: string) => bookmark === eventId);
      
      if (index !== -1) {
        // Si existe, eliminarlo
        bookmarks.splice(index, 1);
        await AsyncStorage.setItem(key, JSON.stringify(bookmarks));
        return false;
      } else {
        // Si no existe, añadirlo
        bookmarks.push(eventId);
        await AsyncStorage.setItem(key, JSON.stringify(bookmarks));
        
        // Registrar interacción para el sistema de recomendaciones
        try {
          const event = await eventService.getEventById(eventId);
          if (event) {
            recommendationService.recordInteraction(
              userId,
              eventId,
              event.category,
              'bookmark'
            );
          }
        } catch (error) {
          console.error('Error al registrar interacción de favorito:', error);
          // No interrumpir el flujo si falla el registro de interacción
        }
        
        return true;
      }
    } catch (error) {
      console.error('Error al modificar favorito:', error);
      throw error;
    }
  }
}

export const bookmarkService = new BookmarkService(); 