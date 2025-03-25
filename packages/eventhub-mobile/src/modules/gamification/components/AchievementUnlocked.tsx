import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Comentado temporalmente hasta que podamos instalar la dependencia
// import LottieView from 'lottie-react-native';

import { useTheme } from '../../../shared/hooks/useTheme';
import { Achievement } from '@modules/gamification/types';
import { AchievementBadge } from './AchievementBadge';

interface AchievementUnlockedProps {
  achievement: Achievement;
  visible: boolean;
  onClose: () => void;
}

/**
 * Componente modal para mostrar cuando un usuario desbloquea un logro
 */
export const AchievementUnlocked: React.FC<AchievementUnlockedProps> = ({
  achievement,
  visible,
  onClose
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    if (visible) {
      // Resetear animaciones
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      
      // Iniciar secuencia de animación
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.ease)
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5))
        })
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);
  
  if (!achievement) return null;
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContent,
            { 
              backgroundColor: theme.colors.background.default,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Animación de celebración */}
          <View style={styles.confettiContainer}>
            {/* Reemplazado temporalmente con un View vacío */}
            <View style={styles.confetti} />
          </View>
          
          {/* Título */}
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            ¡Logro Desbloqueado!
          </Text>
          
          {/* Badge del logro */}
          <View style={styles.badgeContainer}>
            <AchievementBadge 
              achievement={achievement}
              size="large"
              showProgress={false}
            />
          </View>
          
          {/* Detalles del logro */}
          <Text style={[styles.achievementName, { color: theme.colors.primary.main }]}>
            {achievement.name}
          </Text>
          
          <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
            {achievement.description}
          </Text>
          
          {/* Puntos obtenidos */}
          <View style={[styles.pointsContainer, { backgroundColor: `${theme.colors.primary.light}30` }]}>
            <Ionicons 
              name="star" 
              size={20} 
              color={theme.colors.warning.main} 
            />
            <Text style={[styles.pointsText, { color: theme.colors.text.primary }]}>
              +{achievement.points} puntos
            </Text>
          </View>
          
          {/* Botón cerrar */}
          <TouchableOpacity 
            style={[
              styles.closeButton,
              { backgroundColor: theme.colors.primary.main }
            ]}
            onPress={onClose}
          >
            <Text style={styles.closeButtonText}>Continuar</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 340,
    alignItems: 'center',
    overflow: 'hidden',
  },
  confettiContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  confetti: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  badgeContainer: {
    marginBottom: 16,
  },
  achievementName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  }
}); 