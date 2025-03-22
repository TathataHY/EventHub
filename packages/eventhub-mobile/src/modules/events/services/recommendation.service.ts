import AsyncStorage from '@react-native-async-storage/async-storage';
import { eventService } from './event.service';
import { bookmarkService } from './bookmark.service';

// Interfaz para el historial de interacción
interface EventInteraction {
  eventId: string;
  eventCategory: string;
  interactionType: 'view' | 'bookmark' | 'attend' | 'share';
  timestamp: number;
}

// Interfaz para el perfil de preferencias
interface UserPreferences {
  categories: { [category: string]: number }; // Categoría -> Puntuación
  locations: { [location: string]: number }; // Ubicación -> Puntuación
  lastUpdate: number;
}

// Clase para el servicio de recomendaciones
class RecommendationService {
  private INTERACTIONS_KEY = 'event_interactions';
  private PREFERENCES_KEY = 'user_preferences';
  
  // Registrar una interacción con un evento
  async recordInteraction(
    userId: string,
    eventId: string,
    eventCategory: string,
    interactionType: 'view' | 'bookmark' | 'attend' | 'share'
  ): Promise<void> {
    try {
      // Carga interacciones existentes
      const interactionsJson = await AsyncStorage.getItem(`${this.INTERACTIONS_KEY}_${userId}`);
      const interactions: EventInteraction[] = interactionsJson ? JSON.parse(interactionsJson) : [];
      
      // Añade la nueva interacción
      const newInteraction: EventInteraction = {
        eventId,
        eventCategory,
        interactionType,
        timestamp: Date.now()
      };
      
      interactions.push(newInteraction);
      
      // Limita el historial a las últimas 100 interacciones
      const limitedInteractions = interactions.slice(-100);
      
      // Guarda las interacciones
      await AsyncStorage.setItem(
        `${this.INTERACTIONS_KEY}_${userId}`, 
        JSON.stringify(limitedInteractions)
      );
      
      // Actualiza preferencias basadas en esta interacción
      await this.updatePreferences(userId, newInteraction);
    } catch (error) {
      console.error('Error al registrar interacción:', error);
    }
  }
  
  // Actualizar el perfil de preferencias del usuario
  private async updatePreferences(userId: string, interaction: EventInteraction): Promise<void> {
    try {
      // Cargar preferencias existentes
      const preferencesJson = await AsyncStorage.getItem(`${this.PREFERENCES_KEY}_${userId}`);
      const preferences: UserPreferences = preferencesJson 
        ? JSON.parse(preferencesJson) 
        : { categories: {}, locations: {}, lastUpdate: Date.now() };
      
      // Actualizar puntuación de categoría
      if (!preferences.categories[interaction.eventCategory]) {
        preferences.categories[interaction.eventCategory] = 0;
      }
      
      // Asignar puntos según el tipo de interacción
      let points = 0;
      switch (interaction.interactionType) {
        case 'view':
          points = 1;
          break;
        case 'bookmark':
          points = 3;
          break;
        case 'attend':
          points = 5;
          break;
        case 'share':
          points = 2;
          break;
      }
      
      preferences.categories[interaction.eventCategory] += points;
      preferences.lastUpdate = Date.now();
      
      // Intentar obtener información de ubicación del evento para actualizar preferencias de ubicación
      try {
        const event = await eventService.getEventById(interaction.eventId);
        if (event && event.location && event.location.city) {
          const locationKey = event.location.city.toLowerCase();
          
          if (!preferences.locations[locationKey]) {
            preferences.locations[locationKey] = 0;
          }
          
          preferences.locations[locationKey] += points;
        }
      } catch (eventError) {
        console.error('Error al obtener detalles del evento:', eventError);
      }
      
      // Guardar preferencias actualizadas
      await AsyncStorage.setItem(
        `${this.PREFERENCES_KEY}_${userId}`, 
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.error('Error al actualizar preferencias:', error);
    }
  }
  
  // Obtener eventos recomendados para el usuario
  async getRecommendedEvents(userId: string, limit: number = 10): Promise<any[]> {
    try {
      // Obtener preferencias del usuario
      const preferencesJson = await AsyncStorage.getItem(`${this.PREFERENCES_KEY}_${userId}`);
      
      if (!preferencesJson) {
        // Si no hay preferencias, devolver eventos populares
        return this.getPopularEvents(limit);
      }
      
      const preferences: UserPreferences = JSON.parse(preferencesJson);
      
      // Obtener todos los eventos
      const allEvents = await eventService.getAllEvents();
      
      // Si no hay eventos, devolver array vacío
      if (!allEvents || allEvents.length === 0) {
        return [];
      }
      
      // Calcular puntuación para cada evento basada en preferencias
      const scoredEvents = allEvents.map(event => {
        let score = 0;
        
        // Puntuación basada en categoría
        if (event.category && preferences.categories[event.category]) {
          score += preferences.categories[event.category];
        }
        
        // Puntuación basada en ubicación
        if (event.location && event.location.city) {
          const locationKey = event.location.city.toLowerCase();
          if (preferences.locations[locationKey]) {
            score += preferences.locations[locationKey];
          }
        }
        
        // Bonificación para eventos próximos (en los próximos 7 días)
        if (event.date) {
          const eventDate = new Date(event.date);
          const now = new Date();
          const daysUntilEvent = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysUntilEvent > 0 && daysUntilEvent <= 7) {
            score += 10;
          }
        }
        
        return { ...event, recommendationScore: score };
      });
      
      // Verificar si el evento está guardado en favoritos
      const bookmarkedEvents = await bookmarkService.getUserBookmarks(userId);
      const bookmarkedIds = bookmarkedEvents.map(event => event.id);
      
      // Eliminar eventos guardados y pasados de las recomendaciones
      const filteredEvents = scoredEvents.filter(event => {
        // Excluir eventos guardados
        if (bookmarkedIds.includes(event.id)) {
          return false;
        }
        
        // Excluir eventos pasados
        if (event.date) {
          const eventDate = new Date(event.date);
          const now = new Date();
          if (eventDate < now) {
            return false;
          }
        }
        
        return true;
      });
      
      // Ordenar eventos por puntuación (más alta primero)
      const sortedEvents = filteredEvents.sort((a, b) => b.recommendationScore - a.recommendationScore);
      
      // Devolver el número solicitado de eventos
      return sortedEvents.slice(0, limit);
    } catch (error) {
      console.error('Error al obtener eventos recomendados:', error);
      return [];
    }
  }
  
  // Obtener eventos populares como fallback
  private async getPopularEvents(limit: number = 10): Promise<any[]> {
    try {
      const allEvents = await eventService.getAllEvents();
      
      // Si no hay eventos, devolver array vacío
      if (!allEvents || allEvents.length === 0) {
        return [];
      }
      
      // Ordenar por número de asistentes (de mayor a menor)
      const sortedEvents = [...allEvents].sort((a, b) => {
        const attendeesA = a.attendees || 0;
        const attendeesB = b.attendees || 0;
        return attendeesB - attendeesA;
      });
      
      // Filtrar eventos pasados
      const now = new Date();
      const upcomingEvents = sortedEvents.filter(event => {
        if (!event.date) return true; // Si no hay fecha, asumimos que es válido
        const eventDate = new Date(event.date);
        return eventDate >= now;
      });
      
      return upcomingEvents.slice(0, limit);
    } catch (error) {
      console.error('Error al obtener eventos populares:', error);
      return [];
    }
  }
  
  // Obtener eventos "Te podría interesar" basados en el evento actual
  async getSimilarEvents(userId: string, currentEventId: string, limit: number = 4): Promise<any[]> {
    try {
      const currentEvent = await eventService.getEventById(currentEventId);
      
      if (!currentEvent) {
        return [];
      }
      
      const allEvents = await eventService.getAllEvents();
      
      // Filtrar el evento actual
      const otherEvents = allEvents.filter(event => event.id !== currentEventId);
      
      // Calcular similitud para cada evento
      const scoredEvents = otherEvents.map(event => {
        let similarityScore = 0;
        
        // Misma categoría
        if (event.category === currentEvent.category) {
          similarityScore += 5;
        }
        
        // Mismo organizador
        if (event.organizer === currentEvent.organizer) {
          similarityScore += 3;
        }
        
        // Ubicación cercana
        if (event.location && currentEvent.location &&
            event.location.city && currentEvent.location.city &&
            event.location.city.toLowerCase() === currentEvent.location.city.toLowerCase()) {
          similarityScore += 2;
        }
        
        // Fecha cercana (en la misma semana)
        if (event.date && currentEvent.date) {
          const eventDate = new Date(event.date);
          const currentEventDate = new Date(currentEvent.date);
          
          const diffDays = Math.abs(Math.ceil(
            (eventDate.getTime() - currentEventDate.getTime()) / (1000 * 60 * 60 * 24)
          ));
          
          if (diffDays <= 7) {
            similarityScore += 2;
          }
        }
        
        return { ...event, similarityScore };
      });
      
      // Ordenar por puntuación de similitud
      const sortedEvents = scoredEvents.sort((a, b) => b.similarityScore - a.similarityScore);
      
      // Filtrar eventos pasados
      const now = new Date();
      const upcomingEvents = sortedEvents.filter(event => {
        if (!event.date) return true;
        const eventDate = new Date(event.date);
        return eventDate >= now;
      });
      
      return upcomingEvents.slice(0, limit);
    } catch (error) {
      console.error('Error al obtener eventos similares:', error);
      return [];
    }
  }
  
  // Limpiar todas las preferencias e interacciones (para testing/reset)
  async resetUserData(userId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.INTERACTIONS_KEY}_${userId}`);
      await AsyncStorage.removeItem(`${this.PREFERENCES_KEY}_${userId}`);
    } catch (error) {
      console.error('Error al resetear datos de usuario:', error);
    }
  }
}

export const recommendationService = new RecommendationService(); 