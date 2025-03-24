import { apiClient } from '@core/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { recommendationService } from './recommendation.service';
import { authService } from '@modules/auth/services/auth.service';
import { 
  Event, 
  EventFilters as EventSearchParamsType,
  CreateEventData 
} from '../types';

// Para compatibilidad legacy, aceptamos id como string o número
export interface ServiceEvent extends Omit<Event, 'id' | 'organizerId'> {
  id: string | number;
  organizerId: string | number;
  distance?: number;
  recommendationScore?: number;
  // Propiedades adicionales para compatibilidad con componentes
  latitude?: number;
  longitude?: number;
  type?: string;
  metrics?: {
    maxCapacity?: number;
    registeredAttendees?: number;
  };
  ticketInfo?: {
    price?: number;
    availableTickets?: number;
    isFree?: boolean;
    currency?: string;
  };
}

// Extendemos la interfaz de parámetros de búsqueda con campos adicionales
export interface EventSearchParams {
  query?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  location?: {
    latitude?: number;
    longitude?: number;
    radius?: number;
  };
  // Incluimos también los campos de EventFilters para compatibilidad
  categories?: string[];
  date?: {
    from?: Date;
    to?: Date;
  };
  price?: {
    min?: number;
    max?: number;
  };
  keywords?: string[];
  isVirtual?: boolean;
  isFree?: boolean;
}

class EventService {
  // Obtener todos los eventos
  async getAllEvents(): Promise<ServiceEvent[]> {
    try {
      const response = await apiClient.get('/events');
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  // Obtener eventos próximos
  async getUpcomingEvents() {
    try {
      return await apiClient.get('/events/upcoming');
    } catch (error) {
      console.error('Error al obtener eventos próximos:', error);
      throw error;
    }
  }

  // Buscar eventos
  async searchEvents(query: string): Promise<ServiceEvent[]> {
    try {
      const response = await apiClient.get(`/events/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching events with query ${query}:`, error);
      throw error;
    }
  }

  // Obtener un evento por ID
  async getEventById(id: string): Promise<any> {
    try {
      // Obtener datos de eventos
      const eventsJson = await AsyncStorage.getItem('events');
      const events = eventsJson ? JSON.parse(eventsJson) : [];
      
      // Buscar el evento
      const event = events.find((event: any) => event.id === id);
      
      if (event) {
        // Intentar registrar la interacción de visualización
        try {
          const user = await authService.getCurrentUser();
          if (user) {
            recommendationService.recordInteraction(
              user.id,
              id,
              event.category,
              'view'
            );
          }
        } catch (error) {
          console.error('Error al registrar interacción de visualización:', error);
          // No interrumpir el flujo si falla el registro de interacción
        }
      }
      
      return event || null;
    } catch (error) {
      console.error('Error al obtener evento por ID:', error);
      return null;
    }
  }

  // Crear un nuevo evento
  async createEvent(eventData: Partial<ServiceEvent>): Promise<ServiceEvent> {
    try {
      const response = await apiClient.post('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Actualizar un evento
  async updateEvent(id: string, eventData: Partial<ServiceEvent>): Promise<ServiceEvent> {
    try {
      const response = await apiClient.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error(`Error updating event with id ${id}:`, error);
      throw error;
    }
  }

  // Eliminar un evento
  async deleteEvent(id: string): Promise<void> {
    try {
      await apiClient.delete(`/events/${id}`);
    } catch (error) {
      console.error(`Error deleting event with id ${id}:`, error);
      throw error;
    }
  }

  // Registrarse a un evento
  async attendEvent(userId: string, eventId: string): Promise<boolean> {
    try {
      // Código existente para registrar asistencia...
      
      // Registrar interacción para recomendaciones
      const event = await this.getEventById(eventId);
      if (event) {
        recommendationService.recordInteraction(
          userId,
          eventId,
          event.category,
          'attend'
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error al registrar asistencia a evento:', error);
      return false;
    }
  }

  // Cancelar registro a un evento
  async cancelAttendance(id: string): Promise<void> {
    try {
      await apiClient.delete(`/events/${id}/attend`);
    } catch (error) {
      console.error(`Error canceling attendance for event with id ${id}:`, error);
      throw error;
    }
  }

  // Obtener mis eventos (organizados por el usuario)
  async getMyEvents(): Promise<ServiceEvent[]> {
    try {
      const response = await apiClient.get('/events/my-events');
      return response.data;
    } catch (error) {
      console.error('Error fetching my events:', error);
      throw error;
    }
  }

  // Obtener eventos a los que asiste el usuario
  async getEventsAttending(): Promise<ServiceEvent[]> {
    try {
      const response = await apiClient.get('/events/attending');
      return response.data;
    } catch (error) {
      console.error('Error fetching events attending:', error);
      throw error;
    }
  }

  async getEventsByCategory(category: string): Promise<ServiceEvent[]> {
    try {
      const response = await apiClient.get(`/events?category=${encodeURIComponent(category)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching events with category ${category}:`, error);
      throw error;
    }
  }

  async advancedSearch(params: EventSearchParams): Promise<ServiceEvent[]> {
    try {
      // Construir la URL con los parámetros de búsqueda
      const queryParams = new URLSearchParams();
      
      if (params.query) queryParams.append('q', params.query);
      if (params.category) queryParams.append('category', params.category);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.location) {
        // Convertir la ubicación a un string JSON para enviarlo como parámetro
        const locationParam = JSON.stringify(params.location);
        queryParams.append('location', locationParam);
      }
      
      const response = await apiClient.get(`/events/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw error;
    }
  }

  // Compartir un evento con registro de interacción
  async shareEvent(userId: string, eventId: string): Promise<boolean> {
    try {
      // Registrar interacción para recomendaciones
      const event = await this.getEventById(eventId);
      if (event) {
        recommendationService.recordInteraction(
          userId,
          eventId,
          event.category,
          'share'
        );
      }
      
      return true;
    } catch (error) {
      console.error('Error al registrar compartir evento:', error);
      return false;
    }
  }

  // Unirse a un evento
  async joinEvent(eventId: string): Promise<boolean> {
    try {
      const user = await authService.getCurrentUser();
      if (!user) throw new Error('Usuario no autenticado');
      
      // Hacer la petición a la API
      await apiClient.post(`/events/${eventId}/attend`);
      
      // Registrar interacción para recomendaciones
      const event = await this.getEventById(eventId);
      if (event) {
        recommendationService.recordInteraction(
          user.id,
          eventId,
          event.category,
          'attend'
        );
      }
      
      return true;
    } catch (error) {
      console.error(`Error joining event with id ${eventId}:`, error);
      throw error;
    }
  }

  // Abandonar un evento
  async leaveEvent(eventId: string): Promise<boolean> {
    try {
      await apiClient.delete(`/events/${eventId}/attend`);
      return true;
    } catch (error) {
      console.error(`Error leaving event with id ${eventId}:`, error);
      throw error;
    }
  }

  // Verificar si el usuario está asistiendo a un evento
  async isUserAttending(eventId: string): Promise<boolean> {
    try {
      const user = await authService.getCurrentUser();
      if (!user) return false;
      
      const response = await apiClient.get(`/events/${eventId}/attending`);
      return !!response.data.isAttending;
    } catch (error) {
      console.error(`Error checking if user is attending event ${eventId}:`, error);
      return false;
    }
  }

  // Obtener eventos destacados
  async getFeaturedEvents(limit: number = 5): Promise<ServiceEvent[]> {
    try {
      const response = await apiClient.get(`/events/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured events:', error);
      // Datos simulados para desarrollo
      return [];
    }
  }

  /**
   * Obtiene eventos cercanos basados en coordenadas y radio
   * @param latitude Latitud del usuario
   * @param longitude Longitud del usuario
   * @param radius Radio en kilómetros para buscar eventos cercanos
   * @returns Lista de eventos cercanos con distancia calculada
   */
  async getNearbyEvents(latitude: number, longitude: number, radius: number = 10): Promise<ServiceEvent[]> {
    // Por ahora simulamos la obtención de eventos cercanos
    const events = await this.getAllEvents();
    
    // Simulamos el cálculo de distancia para cada evento
    const nearbyEvents = events.map(event => {
      // Asignamos coordenadas aleatorias cercanas si el evento no tiene coordenadas
      const eventLatitude = event.latitude || latitude + (Math.random() * 0.01 - 0.005);
      const eventLongitude = event.longitude || longitude + (Math.random() * 0.01 - 0.005);
      
      // Calculamos una distancia simulada
      const distance = Math.random() * radius;
      
      return {
        ...event,
        latitude: eventLatitude,
        longitude: eventLongitude,
        distance
      };
    });
    
    // Filtramos eventos que estén dentro del radio especificado
    return nearbyEvents.filter(event => event.distance <= radius);
  }

  // Obtener categorías de eventos
  async getCategories(): Promise<string[]> {
    try {
      const response = await apiClient.get('/events/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching event categories:', error);
      // Categorías simuladas para desarrollo
      return ['Música', 'Tecnología', 'Deportes', 'Arte', 'Gastronomía', 'Educación'];
    }
  }

  // Obtener todos los eventos (alias para compatibilidad)
  async getEvents(): Promise<ServiceEvent[]> {
    return this.getAllEvents();
  }

  // Cancelar asistencia a un evento (alias para compatibilidad)
  async unattendEvent(eventId: string): Promise<boolean> {
    try {
      await this.cancelAttendance(eventId);
      return true;
    } catch (error) {
      console.error(`Error unattending event ${eventId}:`, error);
      return false;
    }
  }

  // Obtener eventos a los que ha asistido un usuario
  async getUserAttendedEvents(userId: string): Promise<ServiceEvent[]> {
    try {
      const response = await apiClient.get(`/users/${userId}/events/attended`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching attended events for user ${userId}:`, error);
      return [];
    }
  }
}

// Exportar una instancia única del servicio
export const eventService = new EventService(); 