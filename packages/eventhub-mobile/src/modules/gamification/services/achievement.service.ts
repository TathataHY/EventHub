import AsyncStorage from '@react-native-async-storage/async-storage';
import { eventService } from '@modules/events/services/event.service';
import { authService } from '@modules/auth/services/auth.service';
import { MOCK_ACHIEVEMENTS } from '../../../core/mocks/achievements.mock';

// Interfaces para la gestión de logros
export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string; // Nombre del icono de Ionicons
  type: 'attendance' | 'creation' | 'social' | 'exploration';
  requiredCount: number;
  points: number;
  unlockedAt?: string;
  progress?: number;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  progress: number;
  unlockedAt?: string;
}

export interface UserProfile {
  userId: string;
  level: number;
  points: number;
  achievements: UserAchievement[];
  lastUpdated: string;
}

// Lista de logros disponibles
const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_event',
    title: 'Primera Aventura',
    description: 'Asiste a tu primer evento',
    iconName: 'flag-outline',
    type: 'attendance',
    requiredCount: 1,
    points: 10
  },
  {
    id: 'event_enthusiast',
    title: 'Entusiasta',
    description: 'Asiste a 5 eventos',
    iconName: 'star-outline',
    type: 'attendance',
    requiredCount: 5,
    points: 20
  },
  {
    id: 'event_fan',
    title: 'Fan de Eventos',
    description: 'Asiste a 10 eventos',
    iconName: 'flame-outline',
    type: 'attendance',
    requiredCount: 10,
    points: 30
  },
  {
    id: 'event_master',
    title: 'Maestro de Eventos',
    description: 'Asiste a 25 eventos',
    iconName: 'trophy-outline',
    type: 'attendance',
    requiredCount: 25,
    points: 50
  },
  {
    id: 'organizer_first',
    title: 'Organizador Novato',
    description: 'Crea tu primer evento',
    iconName: 'create-outline',
    type: 'creation',
    requiredCount: 1,
    points: 15
  },
  {
    id: 'organizer_pro',
    title: 'Organizador Pro',
    description: 'Crea 5 eventos',
    iconName: 'ribbon-outline',
    type: 'creation',
    requiredCount: 5,
    points: 30
  },
  {
    id: 'social_butterfly',
    title: 'Mariposa Social',
    description: 'Comparte 3 eventos con tus amigos',
    iconName: 'share-social-outline',
    type: 'social',
    requiredCount: 3,
    points: 15
  },
  {
    id: 'collector',
    title: 'Coleccionista',
    description: 'Guarda 10 eventos en favoritos',
    iconName: 'bookmark-outline',
    type: 'exploration',
    requiredCount: 10,
    points: 20
  },
  {
    id: 'reviewer',
    title: 'Crítico',
    description: 'Escribe 5 comentarios en eventos',
    iconName: 'chatbubble-outline',
    type: 'social',
    requiredCount: 5,
    points: 25
  },
  {
    id: 'explorer',
    title: 'Explorador',
    description: 'Asiste a eventos de 3 categorías diferentes',
    iconName: 'compass-outline',
    type: 'exploration',
    requiredCount: 3,
    points: 30
  }
];

class AchievementService {
  private STORAGE_KEY = 'user_achievements';
  
  // Obtener todos los logros disponibles
  async getAchievements(): Promise<Achievement[]> {
    return ACHIEVEMENTS;
  }
  
  // Obtener el perfil de gamificación del usuario
  async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      const profileJson = await AsyncStorage.getItem(`${this.STORAGE_KEY}_${userId}`);
      
      if (profileJson) {
        const profile: UserProfile = JSON.parse(profileJson);
        
        // Actualizar la información completa de los logros
        const enrichedProfile = await this.enrichUserProfile(profile);
        return enrichedProfile;
      }
      
      // Si no existe perfil, crear uno nuevo
      const newProfile: UserProfile = {
        userId,
        level: 1,
        points: 0,
        achievements: [],
        lastUpdated: new Date().toISOString()
      };
      
      await AsyncStorage.setItem(`${this.STORAGE_KEY}_${userId}`, JSON.stringify(newProfile));
      return this.enrichUserProfile(newProfile);
    } catch (error) {
      console.error('Error al obtener perfil de usuario:', error);
      throw error;
    }
  }
  
  // Agregar información completa de los logros al perfil
  private async enrichUserProfile(profile: UserProfile): Promise<UserProfile> {
    const allAchievements = await this.getAchievements();
    
    // Convertir el array de logros del usuario a un mapa para facilitar la búsqueda
    const userAchievementsMap = profile.achievements.reduce((map, userAchievement) => {
      map[userAchievement.achievementId] = userAchievement;
      return map;
    }, {} as Record<string, UserAchievement>);
    
    // Crear un array enriquecido de logros con la información completa
    const enrichedAchievements = allAchievements.map(achievement => {
      const userAchievement = userAchievementsMap[achievement.id];
      
      if (userAchievement) {
        // Si el usuario tiene progreso en este logro, combinarlo con la información del logro
        return {
          ...achievement,
          progress: userAchievement.progress,
          unlockedAt: userAchievement.unlockedAt
        };
      } else {
        // Si el usuario no tiene este logro, inicializarlo con progreso 0
        return {
          ...achievement,
          progress: 0,
          unlockedAt: undefined
        };
      }
    });
    
    // Calcular el nivel basado en puntos
    // Cada 100 puntos = 1 nivel
    const level = Math.max(1, Math.floor(profile.points / 100) + 1);
    
    return {
      ...profile,
      level,
      achievements: profile.achievements,
      enrichedAchievements // Campo adicional para la UI
    } as UserProfile & { enrichedAchievements: Achievement[] };
  }
  
  // Registrar una actividad que puede contar para logros
  async trackActivity(
    userId: string, 
    activityType: 'event_attendance' | 'event_creation' | 'event_share' | 'event_bookmark' | 'event_comment',
    metadata?: any
  ): Promise<{
    updatedProfile: UserProfile,
    unlockedAchievements: Achievement[]
  }> {
    try {
      // Obtener el perfil del usuario
      const profile = await this.getUserProfile(userId);
      
      // Mapeo de tipos de actividad a tipos de logros
      const activityToAchievementType: Record<string, string> = {
        'event_attendance': 'attendance',
        'event_creation': 'creation',
        'event_share': 'social',
        'event_bookmark': 'exploration',
        'event_comment': 'social'
      };
      
      const achievementType = activityToAchievementType[activityType];
      
      // Obtener todos los logros
      const allAchievements = await this.getAchievements();
      
      // Filtrar logros relevantes para esta actividad
      const relevantAchievements = allAchievements.filter(
        achievement => achievement.type === achievementType
      );
      
      // Logros específicos que requieren lógica adicional
      const specialCaseAchievements = {
        'explorer': async () => {
          if (activityType === 'event_attendance' && metadata?.eventCategory) {
            // Obtener asistencias del usuario
            try {
              // En producción, esto vendría de la API
              // const attendedEvents = await eventService.getUserAttendedEvents(userId);
              
              // Para desarrollo, simulamos con localStorage
              const attendedDataJson = await AsyncStorage.getItem(`attended_events_${userId}`);
              const attendedEvents = attendedDataJson ? JSON.parse(attendedDataJson) : [];
              
              // Extraer categorías únicas
              const categories = new Set(attendedEvents.map(
                (event: any) => event.category
              ));
              
              // Agregar la categoría actual
              categories.add(metadata.eventCategory);
              
              // Actualizar logro de explorador
              return categories.size;
            } catch (error) {
              console.error('Error al verificar logro de explorador:', error);
              return 0;
            }
          }
          return null;
        }
      };
      
      // Actualizar progreso de logros
      const updatedAchievements = [...profile.achievements];
      const unlockedAchievements: Achievement[] = [];
      let additionalPoints = 0;
      
      // Procesar logros relevantes
      for (const achievement of relevantAchievements) {
        // Buscar si el usuario ya tiene progreso en este logro
        let userAchievement = profile.achievements.find(
          ua => ua.achievementId === achievement.id
        );
        
        // Si no existe, crear uno nuevo
        if (!userAchievement) {
          userAchievement = {
            userId,
            achievementId: achievement.id,
            progress: 0
          };
          updatedAchievements.push(userAchievement);
        }
        
        // Si el logro ya está desbloqueado, continuar con el siguiente
        if (userAchievement.unlockedAt) {
          continue;
        }
        
        // Actualizar progreso según el tipo de actividad
        let newProgress = userAchievement.progress + 1;
        
        // Lógica especial para logros específicos
        if (achievement.id in specialCaseAchievements) {
          const specialProgress = await specialCaseAchievements[achievement.id as keyof typeof specialCaseAchievements]();
          if (specialProgress !== null) {
            newProgress = specialProgress;
          }
        }
        
        // Actualizar progreso
        userAchievement.progress = newProgress;
        
        // Verificar si se ha desbloqueado el logro
        if (newProgress >= achievement.requiredCount) {
          userAchievement.unlockedAt = new Date().toISOString();
          additionalPoints += achievement.points;
          unlockedAchievements.push({
            ...achievement,
            progress: newProgress,
            unlockedAt: userAchievement.unlockedAt
          });
        }
      }
      
      // Actualizar puntos totales
      const updatedProfile: UserProfile = {
        ...profile,
        points: profile.points + additionalPoints,
        achievements: updatedAchievements,
        lastUpdated: new Date().toISOString()
      };
      
      // Guardar perfil actualizado
      await AsyncStorage.setItem(
        `${this.STORAGE_KEY}_${userId}`, 
        JSON.stringify(updatedProfile)
      );
      
      // Retornar perfil enriquecido y logros desbloqueados
      return {
        updatedProfile: await this.enrichUserProfile(updatedProfile),
        unlockedAchievements
      };
    } catch (error) {
      console.error('Error al registrar actividad:', error);
      throw error;
    }
  }
  
  // Calcular el progreso hasta el siguiente nivel
  calculateLevelProgress(profile: UserProfile): number {
    const pointsPerLevel = 100;
    const currentLevelPoints = (profile.level - 1) * pointsPerLevel;
    const pointsToNextLevel = profile.level * pointsPerLevel;
    
    const pointsInCurrentLevel = profile.points - currentLevelPoints;
    const pointsRequiredForNextLevel = pointsToNextLevel - currentLevelPoints;
    
    return Math.min(100, Math.floor((pointsInCurrentLevel / pointsRequiredForNextLevel) * 100));
  }
  
  // Calcular el progreso de un logro específico
  calculateAchievementProgress(achievement: Achievement): number {
    if (!achievement.progress) return 0;
    return Math.min(100, Math.floor((achievement.progress / achievement.requiredCount) * 100));
  }
  
  // Reiniciar el perfil de un usuario (para pruebas)
  async resetUserProfile(userId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.STORAGE_KEY}_${userId}`);
    } catch (error) {
      console.error('Error al resetear perfil de usuario:', error);
      throw error;
    }
  }
}

export const achievementService = new AchievementService();

/**
 * Servicio para manejar los logros del usuario
 */
export const achievementService = {
  /**
   * Obtener todos los logros del usuario
   * @returns Lista de logros con información de si están desbloqueados
   */
  getUserAchievements: async () => {
    // En producción, esto haría una llamada a la API
    return new Promise((resolve) => {
      // Simulamos un delay de red
      setTimeout(() => {
        resolve(MOCK_ACHIEVEMENTS);
      }, 800);
    });
  },

  /**
   * Desbloquea un logro para el usuario actual
   * @param achievementId ID del logro a desbloquear
   * @returns Información sobre el desbloqueo
   */
  unlockAchievement: async (achievementId: string) => {
    // En producción, esto haría una llamada POST a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          achievement: MOCK_ACHIEVEMENTS.find(a => a.id === achievementId),
          xpEarned: 50
        });
      }, 500);
    });
  },

  /**
   * Obtiene el progreso de un logro específico
   * @param achievementId ID del logro
   * @returns Información del progreso (porcentaje completado)
   */
  getAchievementProgress: async (achievementId: string) => {
    // En producción, esto haría una llamada GET a la API
    return new Promise((resolve) => {
      setTimeout(() => {
        const achievement = MOCK_ACHIEVEMENTS.find(a => a.id === achievementId);
        if (achievement) {
          resolve({
            id: achievementId,
            name: achievement.name,
            progress: achievement.unlocked ? 100 : Math.floor(Math.random() * 80),
            unlocked: achievement.unlocked
          });
        } else {
          resolve({
            id: achievementId,
            name: 'Desconocido',
            progress: 0,
            unlocked: false
          });
        }
      }, 300);
    });
  }
}; 