import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

import { useTheme } from '@core/context/ThemeContext';
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
      case 'small':
        return { 
          container: 60, 
          icon: 24,
          fontSize: 10
        };
      case 'large':
        return { 
          container: 120, 
          icon: 48,
          fontSize: 14
        };
      default: // medium
        return { 
          container: 90, 
          icon: 36,
          fontSize: 12
        };
    }
  };
  
  const sizes = getSize();
  const isUnlocked = !!achievement.unlockedAt;
  
  // Calcular el progreso como porcentaje
  const progressPercent = achievement.progress && achievement.requiredCount
    ? Math.min(100, Math.floor((achievement.progress / achievement.requiredCount) * 100))
    : 0;
  
  // Obtener color según tipo de logro
  const getColorByType = (type: string) => {
    switch (type) {
      case 'attendance':
        return theme.colors.success.main;
      case 'creation':
        return theme.colors.primary.main;
      case 'social':
        return theme.colors.info.main;
      case 'exploration':
        return theme.colors.warning.main;
      default:
        return theme.colors.primary.main;
    }
  };
  
  const badgeColor = getColorByType(achievement.type);
  
  // Renderizar el círculo de progreso
  const renderProgressCircle = () => {
    if (!showProgress) return null;
    
    const size = sizes.container;
    const strokeWidth = size * 0.06; // Grosor proporcional al tamaño
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progressPercent / 100) * circumference;
    
    return (
      <View style={[styles.progressContainer, { width: size, height: size }]}>
        <View style={[styles.progressBackground, { borderColor: badgeColor + '40', borderWidth: strokeWidth }]} />
        
        {progressPercent > 0 && (
          <Svg width={size} height={size} style={styles.progressSvg}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={badgeColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              fill="transparent"
              rotation={-90}
              origin={`${size / 2}, ${size / 2}`}
            />
          </Svg>
        )}
        
        {isUnlocked && (
          <View style={[
            styles.completedCircle,
            { 
              borderColor: badgeColor,
              width: size - strokeWidth * 2,
              height: size - strokeWidth * 2,
            }
          ]} />
        )}
      </View>
    );
  };
  
  return (
    <Pressable 
      style={styles.container}
      onPress={() => onPress && onPress(achievement)}
      disabled={!onPress}
    >
      <View style={[
        styles.badgeContainer,
        {
          width: sizes.container,
          height: sizes.container,
          backgroundColor: isUnlocked ? badgeColor + '20' : theme.colors.background.paper
        }
      ]}>
        {renderProgressCircle()}
        
        <Ionicons 
          name={isUnlocked ? achievement.iconName.replace('-outline', '') : achievement.iconName}
          size={sizes.icon}
          color={isUnlocked ? badgeColor : theme.colors.text.secondary}
        />
        
        {isUnlocked && size !== 'small' && (
          <View style={[styles.checkmark, { backgroundColor: badgeColor }]}>
            <Ionicons name="checkmark" size={sizes.icon * 0.4} color="#FFFFFF" />
          </View>
        )}
      </View>
      
      {size !== 'small' && (
        <Text 
          style={[
            styles.title, 
            { 
              color: isUnlocked ? theme.colors.text.primary : theme.colors.text.secondary,
              fontSize: sizes.fontSize,
              maxWidth: sizes.container * 1.2
            }
          ]}
          numberOfLines={1}
        >
          {achievement.title}
        </Text>
      )}
      
      {(size === 'large' && achievement.progress !== undefined) && (
        <Text style={[styles.progress, { color: theme.colors.text.secondary, fontSize: sizes.fontSize * 0.9 }]}>
          {achievement.progress}/{achievement.requiredCount}
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
}); 