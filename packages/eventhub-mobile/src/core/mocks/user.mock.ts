import { UserProfile } from '@modules/users/types/user.types';
import { UserRole, AccountStatus, InterestCategory } from '@modules/users/types/user.types';

/**
 * Perfil de usuario simulado para desarrollo
 */
export const MOCK_USER_PROFILE: UserProfile = {
  id: 'mock-user-123',
  email: 'usuario@example.com',
  username: 'usuariotest',
  fullName: 'Usuario de Prueba',
  phoneNumber: '+34600123456',
  photoURL: 'https://randomuser.me/api/portraits/women/44.jpg',
  bio: 'Entusiasta de eventos culturales y conciertos. ¡Me encanta descubrir nuevas experiencias!',
  location: {
    city: 'Madrid',
    state: 'Madrid',
    country: 'España'
  },
  interests: [
    InterestCategory.MUSIC,
    InterestCategory.ARTS,
    InterestCategory.TECHNOLOGY,
    InterestCategory.FOOD
  ],
  followersCount: 128,
  followingCount: 85,
  eventsAttended: 24,
  eventsOrganized: 3,
  createdAt: '2023-01-15T10:30:00Z',
  updatedAt: '2023-03-20T18:45:00Z'
};

/**
 * Lista de perfiles de usuario simulados
 */
export const MOCK_USERS: UserProfile[] = [
  MOCK_USER_PROFILE,
  {
    id: 'mock-user-456',
    email: 'pablo@example.com',
    username: 'pablorod',
    fullName: 'Pablo Rodríguez',
    photoURL: 'https://randomuser.me/api/portraits/men/22.jpg',
    bio: 'Organizador de eventos tecnológicos y hackathons',
    location: {
      city: 'Barcelona',
      state: 'Cataluña',
      country: 'España'
    },
    interests: [
      InterestCategory.TECHNOLOGY,
      InterestCategory.BUSINESS,
      InterestCategory.EDUCATION
    ],
    followersCount: 342,
    followingCount: 127,
    eventsAttended: 18,
    eventsOrganized: 12,
    createdAt: '2022-08-05T14:20:00Z',
    updatedAt: '2023-02-28T09:15:00Z'
  },
  {
    id: 'mock-user-789',
    email: 'ana@example.com',
    username: 'anamartinez',
    fullName: 'Ana Martínez',
    photoURL: 'https://randomuser.me/api/portraits/women/28.jpg',
    bio: 'Amante de los festivales de música y eventos culturales',
    location: {
      city: 'Valencia',
      state: 'Valencia',
      country: 'España'
    },
    interests: [
      InterestCategory.MUSIC,
      InterestCategory.ARTS,
      InterestCategory.SOCIAL
    ],
    followersCount: 215,
    followingCount: 198,
    eventsAttended: 37,
    eventsOrganized: 5,
    createdAt: '2022-11-12T11:50:00Z',
    updatedAt: '2023-04-05T16:30:00Z'
  }
]; 