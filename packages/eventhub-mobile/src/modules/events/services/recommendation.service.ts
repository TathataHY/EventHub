import AsyncStorage from '@react-native-async-storage/async-storage';
// Evitamos la importación circular eliminando la importación directa
// import { eventService } from './event.service';
// Eliminamos esta importación que crea un ciclo
// import { bookmarkService } from './bookmark.service';

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

// Interfaz para evento
interface EventData {
  id: string | number;
  category?: string | any;
  categories?: Array<any>;
  location?: string | { city?: string; [key: string]: any };
  startDate?: string | Date;
  attendees?: number;
  [key: string]: any;
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
    interactionType: 'view' | 'bookmark' | 'attend' | 'share',
    eventLocation?: { city?: string; [key: string]: any }
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
      await this.updatePreferences(userId, newInteraction, eventLocation);
    } catch (error) {
      console.error('Error al registrar interacción:', error);
    }
  }
  
  // Actualizar el perfil de preferencias del usuario
  private async updatePreferences(
    userId: string, 
    interaction: EventInteraction,
    eventLocation?: { city?: string; [key: string]: any }
  ): Promise<void> {
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
      
      // Si tenemos información de ubicación, actualizar preferencias de ubicación
      if (eventLocation && eventLocation.city) {
        const locationKey = eventLocation.city.toLowerCase();
        
        if (!preferences.locations[locationKey]) {
          preferences.locations[locationKey] = 0;
        }
        
        preferences.locations[locationKey] += points;
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
  async getRecommendedEvents(
    userId: string, 
    allEvents: EventData[],
    limit: number = 10,
    bookmarkedEventIds: string[] = [] // Añadimos parámetro para IDs de eventos guardados
  ): Promise<EventData[]> {
    try {
      // Obtener preferencias del usuario
      const preferencesJson = await AsyncStorage.getItem(`${this.PREFERENCES_KEY}_${userId}`);
      
      if (!preferencesJson) {
        // Si no hay preferencias, devolver eventos populares
        return this.getPopularEvents(allEvents, limit);
      }
      
      const preferences: UserRecommendationPreferences = JSON.parse(preferencesJson);
      
      // Si no hay eventos, devolver array vacío
      if (!allEvents || allEvents.length === 0) {
        return [];
      }
      
      // Calcular puntuación para cada evento basado en las preferencias
      const scoredEvents = allEvents.map((event: EventData) => {
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
      
      // En lugar de usar bookmarkService, usamos el parámetro bookmarkedEventIds
      const bookmarkedIds = bookmarkedEventIds.map(id => String(id));
      
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
  getPopularEvents(events: EventData[], limit: number = 10): EventData[] {
    try {
      // Si no hay eventos, devolver array vacío
      if (!events || events.length === 0) {
        return [];
      }
      
      // Ordenar por número de asistentes (de mayor a menor)
      const sortedEvents = [...events].sort((a, b) => {
        const attendeesA = a.attendees || 0;
        const attendeesB = b.attendees || 0;
        return attendeesB - attendeesA;
      });
      
      // Filtrar eventos pasados
      const filteredEvents = this.filterPastEvents(sortedEvents);
      
      // Devolver los más populares
      return filteredEvents.slice(0, limit);
    } catch (error) {
      console.error('Error al obtener eventos populares:', error);
      return [];
    }
  }
  
  // Obtener eventos similares al evento actual
  async getSimilarEvents(
    userId: string, 
    currentEvent: EventData,
    allEvents: EventData[],
    limit: number = 4
  ): Promise<EventData[]> {
    try {
      // Si no hay datos del evento actual, devolver array vacío
      if (!currentEvent) {
        return [];
      }
      
      // Filtrar el evento actual y eventos pasados
      const eventsFiltered = allEvents.filter(event => 
        event.id !== currentEvent.id && 
        this.isPastEvent(event) === false
      );
      
      // Calcular similitud con el evento actual para cada evento
      const scoredEvents = eventsFiltered.map(event => {
        const similarityScore = this.calculateSimilarity(event, currentEvent);
        return { ...event, similarityScore };
      });
      
      // Ordenar por similitud (mayor a menor)
      const sortedEvents = scoredEvents.sort((a, b) => 
        (b.similarityScore || 0) - (a.similarityScore || 0)
      );
      
      // Devolver el número solicitado de eventos similares
      return sortedEvents.slice(0, limit);
    } catch (error) {
      console.error('Error al obtener eventos similares:', error);
      return [];
    }
  }
  
  // Resetear datos de recomendaciones de un usuario
  async resetUserData(userId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.INTERACTIONS_KEY}_${userId}`);
      await AsyncStorage.removeItem(`${this.PREFERENCES_KEY}_${userId}`);
    } catch (error) {
      console.error('Error al resetear datos de usuario:', error);
    }
  }
  
  // Filtrar eventos pasados
  private filterPastEvents(events: EventData[]): EventData[] {
    const now = new Date();
    return events.filter(event => {
      if (!event.startDate) return true;
      const eventDate = typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate;
      return eventDate >= now;
    });
  }
  
  // Verificar si un evento ya pasó
  private isPastEvent(event: EventData): boolean {
    if (!event.startDate) return false;
    const eventDate = typeof event.startDate === 'string' ? new Date(event.startDate) : event.startDate;
    return eventDate < new Date();
  }
  
  // Calcular similitud entre dos eventos
  private calculateSimilarity(event: EventData, currentEvent: EventData): number {
    let score = 0;
    
    // Similitud por categoría (peso alto)
    if (this.matchCategory(event.category, [currentEvent.category])) {
      score += 5;
    }
    
    // Similitud por ubicación (peso medio)
    const eventCity = this.getEventCity(event);
    const currentEventCity = this.getEventCity(currentEvent);
    
    if (eventCity && currentEventCity && eventCity.toLowerCase() === currentEventCity.toLowerCase()) {
      score += 3;
    }
    
    return score;
  }
  
  // Extraer ciudad del evento independientemente de su estructura
  private getEventCity(event: EventData): string | null {
    if (typeof event.location === 'string') {
      return event.location;
    } else if (event.location && typeof event.location === 'object' && event.location.city) {
      return event.location.city;
    }
    return null;
  }
  
  // Verificar si una categoría coincide con alguna de las categorías actuales
  private matchCategory(category: any, currentEventCategories: any[]): boolean {
    if (!category || !currentEventCategories || currentEventCategories.length === 0) {
      return false;
    }
    
    // Normalizar la categoría a string para comparar
    const categoryStr = typeof category === 'object' && category?.id 
      ? String(category.id) 
      : String(category);
    
    // Normalizar categorías actuales a strings
    const currentCategoryStrs = currentEventCategories.map(cat => {
      if (!cat) return '';
      return typeof cat === 'object' && cat?.id 
        ? String(cat.id) 
        : String(cat);
    });
    
    // Verificar si hay coincidencia
    return currentCategoryStrs.includes(categoryStr);
  }
}

export const recommendationService = new RecommendationService(); 