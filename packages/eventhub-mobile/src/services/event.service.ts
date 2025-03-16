import { apiService } from './api.service';

// Interfaces
export interface Event {
  id: number | string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string;
  category: string;
  imageUrl?: string;
  capacity?: number;
  attendees?: number;
  organizerId: number | string;
  organizerName?: string;
  isAttending?: boolean;
}

export interface EventSearchParams {
  query?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
}

class EventService {
  // Obtener todos los eventos
  async getAllEvents(): Promise<Event[]> {
    try {
      const response = await apiService.get('/events');
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }

  // Obtener eventos próximos
  async getUpcomingEvents() {
    try {
      return await apiService.get('/events/upcoming');
    } catch (error) {
      console.error('Error al obtener eventos próximos:', error);
      throw error;
    }
  }

  // Buscar eventos
  async searchEvents(query: string): Promise<Event[]> {
    try {
      const response = await apiService.get(`/events/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching events with query ${query}:`, error);
      throw error;
    }
  }

  // Obtener un evento por ID
  async getEventById(id: string): Promise<Event> {
    try {
      const response = await apiService.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event with id ${id}:`, error);
      throw error;
    }
  }

  // Crear un nuevo evento
  async createEvent(eventData: Partial<Event>): Promise<Event> {
    try {
      const response = await apiService.post('/events', eventData);
      return response.data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Actualizar un evento
  async updateEvent(id: string, eventData: Partial<Event>): Promise<Event> {
    try {
      const response = await apiService.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      console.error(`Error updating event with id ${id}:`, error);
      throw error;
    }
  }

  // Eliminar un evento
  async deleteEvent(id: string): Promise<void> {
    try {
      await apiService.delete(`/events/${id}`);
    } catch (error) {
      console.error(`Error deleting event with id ${id}:`, error);
      throw error;
    }
  }

  // Registrarse a un evento
  async attendEvent(id: string): Promise<void> {
    try {
      await apiService.post(`/events/${id}/attend`);
    } catch (error) {
      console.error(`Error attending event with id ${id}:`, error);
      throw error;
    }
  }

  // Cancelar registro a un evento
  async cancelAttendance(id: string): Promise<void> {
    try {
      await apiService.delete(`/events/${id}/attend`);
    } catch (error) {
      console.error(`Error canceling attendance for event with id ${id}:`, error);
      throw error;
    }
  }

  // Obtener mis eventos (organizados por el usuario)
  async getMyEvents(): Promise<Event[]> {
    try {
      const response = await apiService.get('/events/my-events');
      return response.data;
    } catch (error) {
      console.error('Error fetching my events:', error);
      throw error;
    }
  }

  // Obtener eventos a los que asiste el usuario
  async getEventsAttending(): Promise<Event[]> {
    try {
      const response = await apiService.get('/events/attending');
      return response.data;
    } catch (error) {
      console.error('Error fetching events attending:', error);
      throw error;
    }
  }

  async getEventsByCategory(category: string): Promise<Event[]> {
    try {
      const response = await apiService.get(`/events?category=${encodeURIComponent(category)}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching events with category ${category}:`, error);
      throw error;
    }
  }

  async advancedSearch(params: EventSearchParams): Promise<Event[]> {
    try {
      // Construir la URL con los parámetros de búsqueda
      const queryParams = new URLSearchParams();
      
      if (params.query) queryParams.append('q', params.query);
      if (params.category) queryParams.append('category', params.category);
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.location) queryParams.append('location', params.location);
      
      const response = await apiService.get(`/events/search?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error in advanced search:', error);
      throw error;
    }
  }
}

// Exportar una instancia única del servicio
export const eventService = new EventService(); 