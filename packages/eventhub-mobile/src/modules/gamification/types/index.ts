// Tipos para el módulo de gamificación

// Tipo principal de logro/achievement
export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
  type: string;
  points: number;
  threshold: number;
  progressValue?: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

// Categorías de logros
export enum AchievementCategory {
  ATTENDANCE = 'ATTENDANCE',
  ENGAGEMENT = 'ENGAGEMENT',
  ORGANIZATION = 'ORGANIZATION',
  SOCIAL = 'SOCIAL',
  EXPLORATION = 'EXPLORATION',
}

// Tipos de logros
export enum AchievementType {
  EVENT_ATTENDANCE = 'EVENT_ATTENDANCE',
  COMMENT_CREATION = 'COMMENT_CREATION',
  EVENT_CREATION = 'EVENT_CREATION',
  PROFILE_COMPLETION = 'PROFILE_COMPLETION',
  FOLLOW_USERS = 'FOLLOW_USERS',
  EVENT_CATEGORIES = 'EVENT_CATEGORIES',
  APP_USAGE = 'APP_USAGE',
}

// Progreso de un logro para un usuario específico
export interface AchievementProgress {
  userId: string;
  achievementId: string;
  currentValue: number;
  isCompleted: boolean;
  completedAt?: string;
  updatedAt: string;
}

// Extensión de UserProfile para incluir información de gamificación
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  photoURL?: string;
  bio?: string;
  level: number;
  points: number;
  achievements?: Achievement[];
  stats?: {
    eventsAttended: number;
    commentsCreated: number;
    eventsCreated: number;
    followersCount: number;
    followingCount: number;
  }
}

// Actualizar archivo achievement.types.ts con exportaciones adicionales
export * from './achievement.types'; 