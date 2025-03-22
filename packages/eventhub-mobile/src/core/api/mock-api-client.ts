import axios from 'axios';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_TIMEOUT } from '../config';
import { User, UserProfile } from '../../modules/users/types';
import { Event } from '../../modules/events/types';

/**
 * Cliente API simulado para el modo de desarrollo
 * Intercepta todas las peticiones y devuelve datos mock en lugar de hacer peticiones reales
 */
const mockApiClient: AxiosInstance = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Datos mock para usuarios
const mockUsers: UserProfile[] = [
  {
    id: 'user1',
    name: 'Juan Pérez',
    email: 'juan@ejemplo.com',
    username: 'juanperez',
    role: 'user',
    bio: 'Entusiasta de los eventos tecnológicos y culturales',
    location: 'Madrid, España',
    website: 'https://juanperez.dev',
    phone: '+34 612 345 678',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    followers: 243,
    following: 112,
    eventsCreated: 5,
    eventsAttending: 12,
    joinDate: '2023-01-15',
    socialLinks: {
      twitter: '@juanperez',
      instagram: 'juanperez.dev',
    }
  },
  {
    id: 'user2',
    name: 'María García',
    email: 'maria@ejemplo.com',
    username: 'mariagarcia',
    role: 'organizer',
    bio: 'Organizadora de eventos y conferencias sobre tecnología',
    location: 'Barcelona, España',
    website: 'https://mariagarcia.es',
    phone: '+34 623 456 789',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    followers: 567,
    following: 234,
    eventsCreated: 15,
    eventsAttending: 8,
    joinDate: '2022-10-05',
    socialLinks: {
      twitter: '@mariagarcia',
      instagram: 'mariagarcia.tech',
      linkedin: 'mariagarcia'
    }
  }
];

// Datos mock para eventos
const mockEvents: Event[] = [
  {
    id: 'event1',
    title: 'Conferencia de Desarrollo Web 2023',
    description: 'La conferencia anual sobre las últimas tendencias en desarrollo web.',
    location: 'Madrid, España',
    startDate: '2023-11-15T10:00:00',
    endDate: '2023-11-15T18:00:00',
    organizerId: 'user2',
    organizerName: 'María García',
    imageUrl: 'https://picsum.photos/800/400?random=1',
    category: 'tech',
    price: 25.0,
    capacity: 200,
    attendees: 120,
    status: 'active',
    createdAt: '2023-09-01T12:00:00',
    updatedAt: '2023-09-10T14:30:00'
  },
  {
    id: 'event2',
    title: 'Workshop de React Native',
    description: 'Aprende a construir aplicaciones móviles con React Native en un día.',
    location: 'Barcelona, España',
    startDate: '2023-12-05T09:00:00',
    endDate: '2023-12-05T17:00:00',
    organizerId: 'user2',
    organizerName: 'María García',
    imageUrl: 'https://picsum.photos/800/400?random=2',
    category: 'workshop',
    price: 50.0,
    capacity: 30,
    attendees: 20,
    status: 'active',
    createdAt: '2023-10-05T15:20:00',
    updatedAt: '2023-10-05T15:20:00'
  }
];

// Interceptor para simular respuestas
mockApiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para las respuestas mock
mockApiClient.interceptors.response.use(
  async (config) => {
    const { url, method, data, params } = config.config || {};
    let responseData;
    let status = 200;

    // Simulación de respuesta basada en el endpoint
    if (url?.startsWith('/users')) {
      if (url.endsWith('/me')) {
        responseData = mockUsers[0];
      } else if (url.includes('/profile') && method === 'put') {
        const userData = JSON.parse(data || '{}');
        responseData = { ...mockUsers[0], ...userData };
      } else if (url.match(/\/users\/[a-zA-Z0-9]+$/)) {
        const userId = url.split('/').pop();
        responseData = mockUsers.find(u => u.id === userId) || null;
        if (!responseData) status = 404;
      }
    } else if (url?.startsWith('/events')) {
      if (url.endsWith('/events')) {
        responseData = {
          events: mockEvents,
          total: mockEvents.length,
          page: params?.page || 1,
          limit: params?.limit || 10
        };
      } else if (url.match(/\/events\/[a-zA-Z0-9]+$/)) {
        const eventId = url.split('/').pop();
        responseData = mockEvents.find(e => e.id === eventId) || null;
        if (!responseData) status = 404;
      }
    } else if (url?.startsWith('/auth')) {
      if (url.endsWith('/login') && method === 'post') {
        const loginData = JSON.parse(data || '{}');
        if (loginData.email === 'test@example.com' && loginData.password === 'password') {
          responseData = {
            user: mockUsers[0],
            token: 'mock-token-12345',
            refreshToken: 'mock-refresh-token-67890'
          };
        } else {
          status = 401;
          responseData = { message: 'Credenciales inválidas' };
        }
      }
    }

    // Simular un pequeño retraso para que parezca una API real
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      data: responseData,
      status,
      statusText: status === 200 ? 'OK' : 'Error',
      headers: {},
      config: config.config || {},
    } as AxiosResponse;
  },
  error => Promise.reject(error)
);

export { mockApiClient }; 