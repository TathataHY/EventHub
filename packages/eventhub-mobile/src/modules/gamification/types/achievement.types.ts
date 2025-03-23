// Tipos específicos para logros (achievements)

// Tipo de logro extendido con más detalles 
export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconName: string;
  category: string;
  type: string;
  level: number;
  points: number;
  threshold: number;
  progressValue?: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  badgeColor?: string;
  badgeImage?: string;
  conditions?: AchievementCondition[];
}

// Condición para desbloquear un logro
export interface AchievementCondition {
  type: string;
  value: number;
  operator: 'equals' | 'greater' | 'less' | 'contains';
  propertyName?: string;
}

// Notificación de logro desbloqueado
export interface AchievementNotification {
  achievementId: string;
  userId: string;
  timestamp: string;
  seen: boolean;
}

// Historial de logros para un usuario
export interface UserAchievementHistory {
  userId: string;
  achievements: {
    id: string;
    unlockedAt: string;
  }[];
} 