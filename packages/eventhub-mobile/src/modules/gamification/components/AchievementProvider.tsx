import React, { createContext, useContext, useState, useEffect } from 'react';
import { View } from 'react-native';
import { achievementService } from '@modules/gamification/services/achievement.service';
import { AchievementUnlocked } from './AchievementUnlocked';
import { Achievement } from '@modules/gamification/types';
import { useAuth } from '@modules/auth/hooks/useAuth';

// Definición del contexto
interface AchievementContextType {
  showAchievementNotification: (achievementId: string) => void;
  checkAndTriggerAchievement: (type: string, data?: any) => Promise<void>;
}

const AchievementContext = createContext<AchievementContextType | null>(null);

// Custom hook para usar el contexto de logros
export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements debe ser utilizado dentro de un AchievementProvider');
  }
  return context;
};

// Provider del contexto de logros
export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null);
  const [notificationQueue, setNotificationQueue] = useState<string[]>([]);
  const [isShowingNotification, setIsShowingNotification] = useState(false);
  const { user } = useAuth();

  // Procesar la cola de notificaciones
  useEffect(() => {
    if (notificationQueue.length > 0 && !isShowingNotification) {
      const processNextNotification = async () => {
        setIsShowingNotification(true);
        const nextAchievementId = notificationQueue[0];
        
        try {
          const achievement = await achievementService.getAchievementById(nextAchievementId);
          if (achievement) {
            setCurrentAchievement(achievement);
          }
        } catch (error) {
          console.error('Error al obtener detalles del logro:', error);
        }
      };
      
      processNextNotification();
    }
  }, [notificationQueue, isShowingNotification]);

  // Mostrar una notificación de logro
  const showAchievementNotification = (achievementId: string) => {
    setNotificationQueue(prev => [...prev, achievementId]);
  };

  // Cerrar la notificación actual
  const handleCloseNotification = () => {
    setCurrentAchievement(null);
    setIsShowingNotification(false);
    setNotificationQueue(prev => prev.slice(1));
  };

  // Comprobar y disparar eventos de logro
  const checkAndTriggerAchievement = async (type: string, data?: any) => {
    try {
      // Usar el ID del usuario autenticado si está disponible
      const userId = user?.id || "guest";
      
      // Obtener logros desbloqueados por esta acción
      const unlockedAchievements = await achievementService.checkAchievementProgress(userId, type, data);
      
      // Añadir a la cola de notificaciones cualquier logro desbloqueado
      if (unlockedAchievements && unlockedAchievements.length > 0) {
        unlockedAchievements.forEach(achievement => {
          showAchievementNotification(achievement.id);
        });
      }
    } catch (error) {
      console.error('Error al comprobar progreso de logros:', error);
    }
  };

  return (
    <AchievementContext.Provider 
      value={{ 
        showAchievementNotification, 
        checkAndTriggerAchievement 
      }}
    >
      {children}
      
      {/* Componente de notificación de logro */}
      {currentAchievement && (
        <AchievementUnlocked 
          achievement={currentAchievement}
          onClose={handleCloseNotification}
          autoDismiss={true}
          dismissTime={5000}
        />
      )}
    </AchievementContext.Provider>
  );
}; 