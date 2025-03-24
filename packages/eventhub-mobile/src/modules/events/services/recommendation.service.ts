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
interface UserRecommendationPreferences {
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
      const preferences: UserRecommendationPreferences = preferencesJson 
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
        const event: any = await eventService.getEventById(interaction.eventId);
        if (event && event.location && typeof event.location === 'object' && event.location.city) {
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
      
      const preferences: UserRecommendationPreferences = JSON.parse(preferencesJson);
      
      // Obtener todos los eventos
      const allEvents: any[] = await eventService.getAllEvents();
      
      // Si no hay eventos, devolver array vacío
      if (!allEvents || allEvents.length === 0) {
        return [];
      }
      
      // Calcular puntuación para cada evento basado en las preferencias
      const scoredEvents = allEvents.map((event: any) => {
        let score = 1; // Puntuación base
        
        // Obtener el ID de categoría de manera segura, sin importar la estructura del evento
        let categoryId: string | undefined;
        
        // Intenta obtener categoryId de distintas formas para hacerlo compatible con distintos tipos
        if (event.categories && Array.isArray(event.categories) && event.categories.length > 0) {
          categoryId = String(event.categories[0].id);
        } else if (event.category) {
          categoryId = typeof event.category === 'object' && event.category?.id 
            ? String(event.category.id) 
            : String(event.category);
        }
        
        // Bonificación para categorías preferidas
        if (categoryId && preferences.categories[categoryId]) {
          score += preferences.categories[categoryId];
        }
        
        // Bonificación para ubicaciones preferidas
        let locationKey = '';
        if (typeof event.location === 'string') {
          locationKey = event.location.toLowerCase();
        } else if (event.location && typeof event.location === 'object' && event.location.city) {
          locationKey = event.location.city.toLowerCase();
        }
        
        if (locationKey && preferences.locations[locationKey]) {
          score += preferences.locations[locationKey];
        }
        
        // Bonificación para eventos próximos (en los próximos 7 días)
        if (event.startDate) {
          const eventDate = typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate;
          const now = new Date();
          const daysUntilEvent = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysUntilEvent > 0 && daysUntilEvent <= 7) {
            score += 10;
          }
        }
        
        return { ...event, recommendationScore: score };
      });
      
      // Verificar si el evento está guardado en favoritos
      const bookmarkedEvents: any[] = await bookmarkService.getUserBookmarks(userId);
      const bookmarkedIds = bookmarkedEvents.map((event: any) => {
        if (typeof event === 'string') return event;
        if (event && typeof event === 'object' && (typeof event.id === 'string' || typeof event.id === 'number')) {
          return String(event.id);
        }
        return '';
      }).filter(id => id !== '');
      
      // Eliminar eventos guardados y pasados de las recomendaciones
      const filteredEvents = scoredEvents.filter((event: any) => {
        // Excluir eventos guardados
        if (event.id && bookmarkedIds.includes(String(event.id))) {
          return false;
        }
        
        // Excluir eventos pasados
        if (event.startDate) {
          const eventDate = typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate;
          const now = new Date();
          if (eventDate < now) {
            return false;
          }
        }
        
        return true;
      });
      
      // Ordenar eventos por puntuación (más alta primero)
      const sortedEvents = filteredEvents.sort((a, b) => 
        (b.recommendationScore || 0) - (a.recommendationScore || 0)
      );
      
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
      const allEvents: any[] = await eventService.getAllEvents();
      
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
      const upcomingEvents = sortedEvents.filter((event: any) => {
        if (!event.startDate) return true; // Si no hay fecha, asumimos que es válido
        const eventDate = typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate;
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
      const currentEvent: any = await eventService.getEventById(currentEventId);
      
      if (!currentEvent) {
        return [];
      }
      
      const allEvents: any[] = await eventService.getAllEvents();
      
      // Filtrar el evento actual
      const otherEvents = allEvents.filter((event: any) => String(event.id) !== String(currentEventId));
      
      // Calcular similitud para cada evento
      const scoredEvents = otherEvents.map((event: any) => {
        // Comparar eventos para calcular puntuación de similaridad
        let similarityScore = 0;
        
        // Similitudes en categoría - Manejo seguro de diferentes estructuras
        const eventCategory = event.category?.id ? event.category.id : event.category;
        const currentEventCategory = currentEvent.category?.id ? currentEvent.category.id : currentEvent.category;
        
        if (eventCategory && currentEventCategory && eventCategory === currentEventCategory) {
          similarityScore += 20;
        }
        
        // Calcular similaridad por organizador
        if (event.organizerId && currentEvent.organizerId && 
            String(event.organizerId) === String(currentEvent.organizerId)) {
          similarityScore += 10;
        }
        
        // Ubicación cercana
        if (event.location && currentEvent.location &&
            typeof event.location === 'object' && typeof currentEvent.location === 'object' &&
            event.location.city && currentEvent.location.city &&
            event.location.city.toLowerCase() === currentEvent.location.city.toLowerCase()) {
          similarityScore += 2;
        }
        
        // Calcular similaridad por fecha cercana
        if (event.startDate && currentEvent.startDate) {
          const eventDate = typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate;
          const currentEventDate = typeof currentEvent.startDate === 'string' ? new Date(currentEvent.startDate) : currentEvent.startDate;
          const daysDifference = Math.abs(
            Math.ceil((eventDate.getTime() - currentEventDate.getTime()) / (1000 * 60 * 60 * 24))
          );
          
          if (daysDifference <= 7) {
            similarityScore += (7 - daysDifference);
          }
        }
        
        return { ...event, similarityScore };
      });
      
      // Ordenar por puntuación de similitud
      const sortedEvents = scoredEvents.sort((a, b) => 
        (b.similarityScore || 0) - (a.similarityScore || 0)
      );
      
      // Filtrar eventos pasados
      const now = new Date();
      const upcomingEvents = sortedEvents.filter((event: any) => {
        if (!event.startDate) return true;
        const eventDate = typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate;
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

  // Adaptar evento a la estructura esperada
  private adaptEvent(event: any, recommendationScore: number = 0) {
    // Asignar puntuación de recomendación
    return {
      ...event,
      recommendationScore
    };
  }

  // Ordenar eventos por fecha (de más próximo a más lejano)
  private sortEventsByDate(events: any[]): any[] {
    return [...events].sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return dateA - dateB;
    });
  }

  // Método para filtrar eventos pasados
  private filterPastEvents(events: any[]): any[] {
    const now = new Date();
    return events.filter((event: any) => {
      if (!event.startDate) return true; // Si no hay fecha, asumimos que es válido
      const eventDate = typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate;
      return eventDate >= now;
    });
  }

  /**
   * Compara una categoría con las categorías del evento actual
   * @param category La categoría a comparar
   * @param currentEventCategories Las categorías del evento actual
   * @returns true si la categoría está en las categorías del evento actual
   */
  private matchCategory(category: any, currentEventCategories: any[]): boolean {
    if (!category || !category.id || !currentEventCategories || !Array.isArray(currentEventCategories)) {
      return false;
    }
    
    return currentEventCategories.some((currentCategory: any) => 
      currentCategory && currentCategory.id === category.id
    );
  }

  /**
   * Calcula la similitud entre un evento y el evento actual basado en varios factores
   * @param event El evento a comparar
   * @param currentEvent El evento actual
   * @returns Puntuación de similitud
   */
  private calculateSimilarity(event: any, currentEvent: any): number {
    let similarityScore = 0;
    
    // Mismo organizador (+10 puntos)
    if (event.organizerId && currentEvent.organizerId && 
        String(event.organizerId) === String(currentEvent.organizerId)) {
      similarityScore += 10;
    }
    
    // Categorías similares (+20 puntos por cada categoría coincidente)
    if (event.categories && Array.isArray(event.categories) && 
        currentEvent.categories && Array.isArray(currentEvent.categories)) {
      event.categories.forEach((category: any) => {
        if (this.matchCategory(category, currentEvent.categories)) {
          similarityScore += 20;
        }
      });
    }
    
    // Ubicación similar (+15 puntos por la misma ciudad/área)
    if (event.location && currentEvent.location && 
        typeof event.location === 'object' && typeof currentEvent.location === 'object') {
      if (event.location.city && currentEvent.location.city && 
          event.location.city.toLowerCase() === currentEvent.location.city.toLowerCase()) {
        similarityScore += 15;
      }
    }
    
    // Eventos con fechas cercanas (+10 puntos)
    if (event.startDate && currentEvent.startDate) {
      const eventDate = typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate;
      const currentEventDate = typeof currentEvent.startDate === 'string' ? new Date(currentEvent.startDate) : currentEvent.startDate;
      const diffDays = Math.abs(Math.floor((eventDate.getTime() - currentEventDate.getTime()) / (1000 * 60 * 60 * 24)));
      
      if (diffDays < 14) { // Dentro de dos semanas
        similarityScore += 10;
      }
    }
    
    return similarityScore;
  }
}

export const recommendationService = new RecommendationService(); 