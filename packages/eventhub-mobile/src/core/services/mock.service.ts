import { 
  mockEvents, 
  mockUsers, 
  mockCategories, 
  mockComments, 
  mockNotifications, 
  mockTickets,
  mockCurrentUser
} from '../mocks/data';

class MockService {
  private mockStore: Record<string, any> = {};
  
  // Método para obtener datos del almacenamiento mock
  getMockData(key: string, defaultValue?: any): any {
    if (this.mockStore[key]) {
      return this.mockStore[key];
    }
    // Si hay un valor por defecto, lo guardamos y devolvemos
    if (defaultValue !== undefined) {
      this.mockStore[key] = defaultValue;
      return defaultValue;
    }
    return null;
  }
  
  // Método para guardar datos en el almacenamiento mock
  setMockData(key: string, data: any): void {
    this.mockStore[key] = data;
  }

  // Métodos para eventos
  async getEvents() {
    return [...mockEvents];
  }

  async getEventById(id: string) {
    return mockEvents.find(event => event.id === id);
  }

  async getEventsByCategory(categoryId: string) {
    return mockEvents.filter(event => event.category === categoryId);
  }

  async getFeaturedEvents() {
    return mockEvents.filter(event => event.isFeatured);
  }

  async getNearbyEvents() {
    // En un caso real, calcularíamos según la ubicación actual
    // Por ahora simplemente devolvemos algunos eventos aleatorios
    return mockEvents.slice(0, 3);
  }

  async searchEvents(query: string) {
    return mockEvents.filter(event => 
      event.title.toLowerCase().includes(query.toLowerCase()) || 
      event.description.toLowerCase().includes(query.toLowerCase()) ||
      event.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }

  // Métodos para categorías
  async getCategories() {
    return [...mockCategories];
  }

  // Métodos para usuarios
  async getUserById(id: string) {
    return mockUsers.find(user => user.id === id);
  }

  async getCurrentUser() {
    return {...mockCurrentUser};
  }

  async login(email: string, password: string) {
    // Simulamos login exitoso
    return {...mockCurrentUser};
  }

  async register(userData: any) {
    // Simulamos registro exitoso
    return {...mockCurrentUser};
  }

  async logout() {
    return true;
  }

  async updateUserProfile(userData: any) {
    return {...mockCurrentUser, ...userData};
  }

  // Métodos para comentarios
  async getCommentsByEventId(eventId: string) {
    return mockComments.filter(comment => comment.eventId === eventId);
  }

  async addComment(eventId: string, text: string, rating: number) {
    const newComment = {
      id: `comment${mockComments.length + 1}`,
      eventId,
      userId: mockCurrentUser.id,
      text,
      date: new Date().toISOString(),
      rating,
    };
    
    return newComment;
  }

  // Métodos para notificaciones
  async getNotifications() {
    return mockNotifications.filter(notification => notification.userId === mockCurrentUser.id);
  }

  async markNotificationAsRead(notificationId: string) {
    const notification = mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      return notification;
    }
    return null;
  }

  // Métodos para tickets
  async getUserTickets() {
    return mockTickets.filter(ticket => ticket.userId === mockCurrentUser.id);
  }

  async getTicketByEventId(eventId: string) {
    return mockTickets.find(ticket => 
      ticket.eventId === eventId && ticket.userId === mockCurrentUser.id
    );
  }

  async purchaseTicket(eventId: string) {
    const event = mockEvents.find(e => e.id === eventId);
    if (!event) return null;
    
    const newTicket = {
      id: `ticket${mockTickets.length + 1}`,
      eventId,
      userId: mockCurrentUser.id,
      purchaseDate: new Date().toISOString(),
      status: 'confirmed',
      qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket${mockTickets.length + 1}`,
      price: event.price,
      currency: event.currency,
    };
    
    return newTicket;
  }

  // Métodos para marcadores/favoritos
  async bookmarkEvent(eventId: string) {
    return { success: true, eventId };
  }

  async unbookmarkEvent(eventId: string) {
    return { success: true, eventId };
  }

  async getBookmarkedEvents() {
    // En una implementación real, buscaríamos los marcadores del usuario
    // Por ahora devolvemos algunos eventos aleatorios
    return mockEvents.slice(0, 2);
  }

  // Métodos para asistencia a eventos
  async attendEvent(eventId: string) {
    return { success: true, eventId };
  }

  async cancelAttendance(eventId: string) {
    return { success: true, eventId };
  }

  async getAttendedEvents() {
    return mockEvents.filter(event => 
      mockCurrentUser.eventsAttended.includes(event.id)
    );
  }

  // Métodos para eventos organizados
  async getOrganizedEvents() {
    return mockEvents.filter(event => 
      mockCurrentUser.eventsOrganized.includes(event.id)
    );
  }
}

export const mockService = new MockService(); 