import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '../../../shared/hooks/useTheme';
import { Achievement } from '@modules/gamification/types';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
  onPress?: (achievement: Achievement) => void;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  achievement,
  size = 'medium',
  showProgress = true,
  onPress
}) => {
  const { theme } = useTheme();
  
  // Determinar tamaño del badge según el prop size
  const getSize = () => {
    switch (size) {
      case 'small': return 60;
      case 'large': return 120;
      default: return 80;
    }
  };
  
  const badgeSize = getSize();
  const isUnlocked = achievement.isUnlocked;
  
  // Calcular el progreso como porcentaje
  const progressPercent = achievement.progressValue && achievement.threshold
    ? Math.min(100, Math.floor((achievement.progressValue / achievement.threshold) * 100))
    : 0;
  
  // Determinar colores según si está desbloqueado
  const getColors = () => {
    if (isUnlocked) {
      return {
        iconColor: theme.colors.primary.main,
        badgeColor: theme.colors.primary.light,
        textColor: theme.colors.primary.main,
        progressColor: theme.colors.primary.main
      };
    } else {
      return {
        iconColor: theme.colors.grey[500],
        badgeColor: theme.colors.grey[300],
        textColor: theme.colors.grey[600],
        progressColor: theme.colors.grey[500]
      };
    }
  };
  
  const { iconColor, badgeColor, textColor, progressColor } = getColors();
  
  // Renderizar el círculo de progreso
  const renderProgressCircle = () => {
    const strokeWidth = size === 'small' ? 2 : 3;
    const radius = badgeSize / 2 - strokeWidth;
    const circumference = 2 * Math.PI * radius;
    const progress = progressPercent || 0;
    const strokeDashoffset = circumference - (circumference * progress) / 100;
    
    return (
      <Svg width={badgeSize} height={badgeSize} style={styles.progressCircle}>
        {/* Círculo de fondo */}
        <Circle
          cx={badgeSize / 2}
          cy={badgeSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={theme.colors.grey[200]}
          fill="transparent"
        />
        
        {/* Círculo de progreso */}
        <Circle
          cx={badgeSize / 2}
          cy={badgeSize / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={progressColor}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90, ${badgeSize / 2}, ${badgeSize / 2})`}
        />
      </Svg>
    );
  };
  
  return (
    <Pressable
      style={[
        styles.container,
        { width: badgeSize },
        size === 'large' && styles.largeContainer
      ]}
      onPress={() => onPress && onPress(achievement)}
      disabled={!onPress}
    >
      <View style={styles.badgeContainer}>
        {/* Círculo de progreso (fondo) */}
        {showProgress && renderProgressCircle()}
        
        {/* Círculo de badge */}
        <View
          style={[
            styles.badge,
            {
              width: badgeSize * 0.8,
              height: badgeSize * 0.8,
              backgroundColor: badgeColor,
              opacity: isUnlocked ? 1 : 0.7
            }
          ]}
        >
          <Ionicons
            name={(isUnlocked ? achievement.iconName.replace('-outline', '') : achievement.iconName) as any}
            size={badgeSize * 0.4}
            color={iconColor}
          />
        </View>
      </View>
      
      {/* Título del logro */}
      <Text
        style={[
          styles.title,
          { color: textColor, fontSize: size === 'small' ? 12 : 14 }
        ]}
        numberOfLines={2}
      >
        {achievement.name}
      </Text>
      
      {/* Progreso numérico (solo para tamaño grande) */}
      {(size === 'large' && achievement.progressValue !== undefined) && (
        <Text style={[styles.progressText, { color: textColor }]}>
          {achievement.progressValue}/{achievement.threshold}
        </Text>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 6,
  },
  badgeContainer: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  progressContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  progressSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  completedCircle: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 2,
  },
  checkmark: {
    position: 'absolute',
    bottom: '10%',
    right: '10%',
    borderRadius: 999,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    fontWeight: '500',
    marginTop: 6,
  },
  progress: {
    textAlign: 'center',
    marginTop: 2,
  },
  largeContainer: {
    // Add any necessary styles for the large container
  },
  progressCircle: {
    // Add any necessary styles for the progress circle
  },
  badge: {
    // Add any necessary styles for the badge
  },
  progressText: {
    // Add any necessary styles for the progress text
  },
}); 