import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Achievement } from '@modules/gamification/types';
import { AchievementUnlocked } from './AchievementUnlocked';

// Definir la estructura del contexto
interface AchievementContextType {
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  progressMap: Record<string, number>;
  loading: boolean;
  unlockAchievement: (achievementId: string) => Promise<boolean>;
  updateProgress: (achievementId: string, progress: number) => Promise<Achievement | null>;
  resetProgress: () => Promise<void>;
}

// Crear el contexto
const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

// Clave para storage
const ACHIEVEMENTS_STORAGE_KEY = 'achievements_data';
const PROGRESS_STORAGE_KEY = 'achievements_progress';

// Props para el proveedor
interface AchievementProviderProps {
  children: ReactNode;
  // Logros disponibles en la aplicación
  availableAchievements?: Achievement[];
}

export const AchievementProvider: React.FC<AchievementProviderProps> = ({
  children,
  availableAchievements = []
}) => {
  // Estado para logros y progreso
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [unlockedAchievement, setUnlockedAchievement] = useState<Achievement | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // Cargar logros almacenados al inicio
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        // Combinar logros almacenados con los disponibles
        const storedAchievementsJson = await AsyncStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
        const storedProgressJson = await AsyncStorage.getItem(PROGRESS_STORAGE_KEY);
        
        let storedAchievements: Achievement[] = [];
        if (storedAchievementsJson) {
          storedAchievements = JSON.parse(storedAchievementsJson);
        }
        
        let progress: Record<string, number> = {};
        if (storedProgressJson) {
          progress = JSON.parse(storedProgressJson);
        }
        
        // Fusionar logros almacenados con los disponibles
        const mergedAchievements = availableAchievements.map(achievement => {
          const storedAchievement = storedAchievements.find(stored => stored.id === achievement.id);
          
          if (storedAchievement) {
            return {
              ...achievement,
              isUnlocked: storedAchievement.isUnlocked,
              unlockedAt: storedAchievement.unlockedAt,
              progressValue: progress[achievement.id] || 0
            };
          }
          
          return {
            ...achievement,
            isUnlocked: false,
            progressValue: progress[achievement.id] || 0
          };
        });
        
        setAchievements(mergedAchievements);
        setProgressMap(progress);
      } catch (error) {
        console.error('Error al cargar logros:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadAchievements();
  }, [availableAchievements]);
  
  // Actualizar storage con los logros actuales
  const saveAchievements = async (updatedAchievements: Achievement[]) => {
    try {
      // Guardar solo datos relevantes y no todo el objeto
      const achievementsToStore = updatedAchievements.map(achievement => ({
        id: achievement.id,
        isUnlocked: achievement.isUnlocked,
        unlockedAt: achievement.unlockedAt
      }));
      
      await AsyncStorage.setItem(
        ACHIEVEMENTS_STORAGE_KEY,
        JSON.stringify(achievementsToStore)
      );
    } catch (error) {
      console.error('Error al guardar logros:', error);
    }
  };
  
  // Guardar progreso en storage
  const saveProgress = async (updatedProgress: Record<string, number>) => {
    try {
      await AsyncStorage.setItem(
        PROGRESS_STORAGE_KEY,
        JSON.stringify(updatedProgress)
      );
    } catch (error) {
      console.error('Error al guardar progreso:', error);
    }
  };
  
  // Desbloquear un logro por ID
  const unlockAchievement = async (achievementId: string): Promise<boolean> => {
    const achievement = achievements.find(a => a.id === achievementId);
    
    if (!achievement || achievement.isUnlocked) {
      return false;
    }
    
    const updatedAchievements = achievements.map(a => {
      if (a.id === achievementId) {
        const unlockedAchievement = {
          ...a,
          isUnlocked: true,
          unlockedAt: new Date().toISOString(),
          progressValue: a.threshold
        };
        
        // Mostrar modal de logro desbloqueado
        setUnlockedAchievement(unlockedAchievement);
        setShowUnlockModal(true);
        
        return unlockedAchievement;
      }
      return a;
    });
    
    setAchievements(updatedAchievements);
    
    // Actualizar progreso
    const updatedProgress = { ...progressMap, [achievementId]: achievement.threshold };
    setProgressMap(updatedProgress);
    
    // Guardar cambios
    await saveAchievements(updatedAchievements);
    await saveProgress(updatedProgress);
    
    return true;
  };
  
  // Actualizar progreso de un logro
  const updateProgress = async (
    achievementId: string, 
    progress: number
  ): Promise<Achievement | null> => {
    const achievementIndex = achievements.findIndex(a => a.id === achievementId);
    
    if (achievementIndex === -1) {
      return null;
    }
    
    const achievement = achievements[achievementIndex];
    
    // Si ya está desbloqueado, no actualizar progreso
    if (achievement.isUnlocked) {
      return achievement;
    }
    
    // Actualizar progreso
    const currentProgress = progressMap[achievementId] || 0;
    const newProgress = Math.max(currentProgress, progress);
    
    // Verificar si se ha alcanzado o superado el umbral
    if (newProgress >= achievement.threshold && !achievement.isUnlocked) {
      // Desbloquear logro
      return unlockAchievement(achievementId).then(success => {
        return success ? achievements.find(a => a.id === achievementId) || null : null;
      });
    }
    
    // Solo actualizar progreso
    const updatedProgress = { ...progressMap, [achievementId]: newProgress };
    setProgressMap(updatedProgress);
    
    // Actualizar el logro con el nuevo progreso
    const updatedAchievements = [...achievements];
    updatedAchievements[achievementIndex] = {
      ...achievement,
      progressValue: newProgress
    };
    
    setAchievements(updatedAchievements);
    
    // Guardar progreso
    await saveProgress(updatedProgress);
    
    return updatedAchievements[achievementIndex];
  };
  
  // Resetear todo el progreso (para testing)
  const resetProgress = async () => {
    const resetAchievements = achievements.map(achievement => ({
      ...achievement,
      isUnlocked: false,
      unlockedAt: undefined,
      progressValue: 0
    }));
    
    setAchievements(resetAchievements);
    setProgressMap({});
    
    await saveAchievements(resetAchievements);
    await saveProgress({});
  };
  
  // Cerrar modal de logro desbloqueado
  const handleCloseUnlockModal = () => {
    setShowUnlockModal(false);
    setUnlockedAchievement(null);
  };
  
  // Obtener logros desbloqueados
  const unlockedAchievements = achievements.filter(a => a.isUnlocked);
  
  // Valor del contexto
  const contextValue: AchievementContextType = {
    achievements,
    unlockedAchievements,
    progressMap,
    loading,
    unlockAchievement,
    updateProgress,
    resetProgress
  };
  
  return (
    <AchievementContext.Provider value={contextValue}>
      {children}
      
      {/* Modal para mostrar logros desbloqueados */}
      {unlockedAchievement && (
        <AchievementUnlocked
          achievement={unlockedAchievement}
          visible={showUnlockModal}
          onClose={handleCloseUnlockModal}
        />
      )}
    </AchievementContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAchievements = (): AchievementContextType => {
  const context = useContext(AchievementContext);
  
  if (context === undefined) {
    throw new Error('useAchievements debe usarse dentro de un AchievementProvider');
  }
  
  return context;
}; 