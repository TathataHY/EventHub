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
  followers: ['2', '3', '4'],
  following: ['2', '3'],
  stats: {
    followersCount: 128,
    followingCount: 45,
    eventsAttended: 12,
    eventsCreated: 5
  },
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
    followers: ['1', '3', '5'],
    following: ['1'],
    stats: {
      followersCount: 342,
      followingCount: 78,
      eventsAttended: 25,
      eventsCreated: 10
    },
    createdAt: '2023-02-20T14:45:00Z',
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
    followers: ['1', '2'],
    following: ['1'],
    stats: {
      followersCount: 215,
      followingCount: 120,
      eventsAttended: 18,
      eventsCreated: 8
    },
    createdAt: '2023-03-10T09:15:00Z',
    updatedAt: '2023-04-05T16:30:00Z'
  }
]; 