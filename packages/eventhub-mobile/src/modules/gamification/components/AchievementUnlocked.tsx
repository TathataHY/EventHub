import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@core/context/ThemeContext';
import { Achievement } from '@modules/gamification/types';

interface AchievementUnlockedProps {
  achievement: Achievement;
  onClose: () => void;
  autoDismiss?: boolean;
  dismissTime?: number;
}

export const AchievementUnlocked: React.FC<AchievementUnlockedProps> = ({
  achievement,
  onClose,
  autoDismiss = true,
  dismissTime = 5000
}) => {
  const { theme } = useTheme();
  const [animation] = useState(new Animated.Value(0));
  
  useEffect(() => {
    // Animación de entrada
    Animated.spring(animation, {
      toValue: 1,
      tension: 80,
      friction: 10,
      useNativeDriver: true
    }).start();
    
    // Autocierre si está habilitado
    if (autoDismiss) {
      const timer = setTimeout(() => {
        handleClose();
      }, dismissTime);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Manejar cierre con animación
  const handleClose = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true
    }).start(() => {
      onClose();
    });
  };
  
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
  
  // Transformaciones para la animación
  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 0]
  });
  
  const scale = animation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.1, 1]
  });
  
  return (
    <Animated.View
      style={[
        styles.container,
        { 
          backgroundColor: theme.colors.background.paper,
          transform: [{ translateY }, { scale }]
        }
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: badgeColor + '20' }]}>
        <Ionicons
          name={achievement.iconName.replace('-outline', '')}
          size={32}
          color={badgeColor}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>
          ¡Logro desbloqueado!
        </Text>
        
        <Text style={[styles.achievementName, { color: badgeColor }]}>
          {achievement.title}
        </Text>
        
        <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
          {achievement.description}
        </Text>
        
        <View style={styles.pointsContainer}>
          <Ionicons name="star" size={16} color={theme.colors.warning.main} />
          <Text style={[styles.points, { color: theme.colors.text.primary }]}>
            +{achievement.points} puntos
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.closeButton}
        onPress={handleClose}
      >
        <Ionicons name="close" size={20} color={theme.colors.text.secondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: width - 40,
    alignSelf: 'center',
    zIndex: 1000,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    marginBottom: 6,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 