import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_TIMEOUT } from '../config';
import { User, UserProfile, PublicUserProfile, UserRole, AccountStatus, InterestCategory } from '../../modules/users/types/user.types';
import { Event, EventStatus, EventType, EventCategory, EventVisibility, Organizer, EventMetrics } from '../../modules/events/types';

// Extender AxiosInstance para incluir nuestros métodos auxiliares
interface MockApiClient extends AxiosInstance {
  _getMockUsers: () => UserProfile[];
}

/**
 * Cliente API simulado para el modo de desarrollo
 * Intercepta todas las peticiones y devuelve datos mock en lugar de hacer peticiones reales
 */
const mockApiClient = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
}) as MockApiClient;

/**
 * Ejemplos de usuarios para desarrollo
 */
const mockUsers: UserProfile[] = [
  {
    id: '1',
    email: 'juan@example.com',
    username: 'juanperez',
    fullName: 'Juan Pérez',
    photoURL: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Amante de la tecnología y los eventos de networking',
    location: { city: 'Madrid', country: 'España' },
    socialLinks: {
      twitter: 'juanperez',
      instagram: 'juanperez_insta',
      linkedin: 'juanperez_linkedin',
      facebook: 'juanperez_fb',
    },
    preferences: {
      categoryPreferences: ['tecnología', 'networking', 'educación'],
      notificationSettings: {
        email: true,
        push: true,
        sms: false,
      },
      privacySettings: {
        profileVisibility: 'public',
        allowTagging: true,
        allowMessages: true,
      },
    },
    stats: {
      followersCount: 120,
      followingCount: 85,
      eventsAttended: 25,
      eventsCreated: 10,
      eventsSaved: 15,
      averageRating: 4.8,
    },
  },
  {
    id: '2',
    email: 'maria@example.com',
    username: 'mariagarcia',
    fullName: 'María García',
    photoURL: 'https://randomuser.me/api/portraits/women/1.jpg',
    bio: 'Organizadora de eventos culturales y amante del arte',
    location: { city: 'Barcelona', country: 'España' },
    socialLinks: {
      twitter: 'mariagarcia',
      instagram: 'mariagarcia_insta',
      linkedin: 'mariagarcia_linkedin',
      facebook: 'mariagarcia_fb',
    },
    preferences: {
      categoryPreferences: ['arte', 'cultura', 'música'],
      notificationSettings: {
        email: true,
        push: true,
        sms: true,
      },
      privacySettings: {
        profileVisibility: 'public',
        allowTagging: true,
        allowMessages: true,
      },
    },
    stats: {
      followersCount: 250,
      followingCount: 120,
      eventsAttended: 35,
      eventsCreated: 15,
      eventsSaved: 20,
      averageRating: 4.9,
    },
  },
];

/**
 * Ejemplos de eventos para desarrollo
 */
const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Festival de Música Indie',
    description: 'Disfruta de los mejores artistas indie del momento en un ambiente único.',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    startDate: '2023-06-15T18:00:00.000Z',
    endDate: '2023-06-15T23:00:00.000Z',
    location: {
      name: 'Parque Central',
      address: 'Calle Principal 123, Ciudad',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    },
    category: 'music',
    organizer: {
      id: '1',
      name: 'Promotora Cultural',
      description: 'Organizadores de eventos culturales',
      logo: 'https://placehold.co/400',
    },
    organizerId: '1',
  },
  {
    id: '2',
    title: 'Conferencia de Tecnología',
    description: 'Descubre las últimas tendencias en inteligencia artificial y desarrollo web.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    startDate: '2023-07-20T09:00:00.000Z',
    endDate: '2023-07-21T18:00:00.000Z',
    location: {
      name: 'Centro de Convenciones',
      address: 'Avenida Tecnológica 456, Ciudad',
      coordinates: {
        latitude: 37.7749,
        longitude: -122.4194,
      },
    },
    category: 'technology',
    organizer: {
      id: '2',
      name: 'TechEvents Inc.',
      description: 'Expertos en eventos tecnológicos',
      logo: 'https://placehold.co/400',
    },
    organizerId: '2',
  },
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
      } else if (url.match(/\/users\/[a-zA-Z0-9-]+$/)) {
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

// Método auxiliar para tests y desarrollo
mockApiClient._getMockUsers = () => mockUsers;

export { mockApiClient }; 