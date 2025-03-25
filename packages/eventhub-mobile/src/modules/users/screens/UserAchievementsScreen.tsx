import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

import { appColors, appTypography, appSpacing, convertTypographyStyle } from '@theme/index';
import { Card } from '@shared/components/ui';
import { achievementService } from '@modules/gamification/services/achievement.service';
import { userService } from '../services/user.service';
import { Achievement } from '@modules/gamification/types/achievement.types';

/**
 * Pantalla que muestra los logros del usuario
 */
export const UserAchievementsScreen = () => {
  const router = useRouter();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userLevel, setUserLevel] = useState(1);
  const [experience, setExperience] = useState(0);
  const [nextLevelXP, setNextLevelXP] = useState(100);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserGameData();
  }, []);

  const loadUserGameData = async () => {
    try {
      setLoading(true);
      // Cargar logros del usuario
      const fetchAchievements = async () => {
        try {
          const userAchievements = await achievementService.getAchievements();
          // Usar aserción de tipo para evitar error de tipado
          setAchievements(userAchievements as any);
        } catch (error) {
          console.error('Error fetching achievements:', error);
          // Mostrar mensaje de error
        }
      };
      
      fetchAchievements();
      
      // Cargar información de nivel y experiencia
      const userData = await userService.getCurrentUserProfile();
      // Suponemos que hay datos de gamificación en las estadísticas
      const stats = await userService.getUserStats(userData.id);
      const gamificationData = stats.gameStats || { level: 1, experience: 0, nextLevelXP: 100 };
      
      setUserLevel(gamificationData.level);
      setExperience(gamificationData.experience);
      setNextLevelXP(gamificationData.nextLevelXP);
    } catch (error) {
      console.error('Error al cargar datos de gamificación:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAchievementLockStatus = (achievement: Achievement) => {
    if (achievement.isUnlocked) {
      return {
        opacity: 1,
        color: appColors.primary.main,
        backgroundColor: 'transparent'
      };
    } else {
      return {
        opacity: 0.5,
        color: appColors.grey[500],
        backgroundColor: appColors.grey[200]
      };
    }
  };

  const renderBadge = (achievement: Achievement) => {
    const { opacity, color, backgroundColor } = getAchievementLockStatus(achievement);
    
    return (
      <TouchableOpacity
        key={achievement.id}
        style={[styles.badgeContainer, { opacity }]}
        onPress={() => {
          // En un caso real, aquí podríamos mostrar detalles del logro
          if (achievement.isUnlocked) {
            console.log('Mostrar detalles del logro:', achievement.name);
          }
        }}
      >
        <View style={[styles.badge, { backgroundColor }]}>
          <Ionicons name={achievement.iconName as any} size={32} color={color} />
        </View>
        <Text style={styles.badgeName} numberOfLines={2}>
          {achievement.name}
        </Text>
        {!achievement.isUnlocked && (
          <View style={styles.lockedBadge}>
            <Ionicons name="lock-closed" size={14} color={appColors.common.white} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const calculateProgress = () => {
    return (experience / nextLevelXP) * 100;
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={appColors.primary.main} />
        <Text style={styles.loaderText}>Cargando logros...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Logros</Text>
        <Text style={styles.subtitle}>
          Completa actividades para ganar logros y aumentar tu nivel
        </Text>
      </View>
      
      <Card style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{userLevel}</Text>
          </View>
          <View style={styles.levelInfo}>
            <Text style={styles.levelTitle}>Nivel {userLevel}</Text>
            <Text style={styles.levelSubtitle}>
              {experience} / {nextLevelXP} XP para el siguiente nivel
            </Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBackground}>
            <View
              style={[styles.progressFill, { width: `${calculateProgress()}%` }]}
            />
          </View>
        </View>
        
        <Text style={styles.levelTip}>
          Organiza eventos y asiste a ellos para ganar experiencia
        </Text>
      </Card>
      
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Logros Desbloqueados</Text>
        <Text style={styles.sectionCount}>
          {achievements.filter(a => a.isUnlocked).length} / {achievements.length}
        </Text>
      </View>
      
      <View style={styles.badgesGrid}>
        {achievements.map(achievement => renderBadge(achievement))}
      </View>
      
      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color={appColors.primary.main} />
        <Text style={styles.infoText}>
          Organiza y asiste a eventos para ganar más logros y subir de nivel. Cuanto más alto sea tu nivel, más beneficios recibirás.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
    padding: appSpacing.md,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.background,
  },
  loaderText: {
    ...convertTypographyStyle(appTypography.body1),
    color: appColors.text,
    marginTop: appSpacing.md,
  },
  header: {
    marginBottom: appSpacing.lg,
  },
  title: {
    ...convertTypographyStyle(appTypography.h4),
    color: appColors.text,
    marginBottom: appSpacing.xs,
  },
  subtitle: {
    ...convertTypographyStyle(appTypography.body2),
    color: appColors.grey[600],
  },
  levelCard: {
    marginBottom: appSpacing.lg,
    padding: appSpacing.md,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: appSpacing.md,
  },
  levelBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: appColors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: appSpacing.md,
  },
  levelText: {
    ...convertTypographyStyle(appTypography.h4),
    color: appColors.common.white,
    fontWeight: 'bold' as const,
  },
  levelInfo: {
    flex: 1,
  },
  levelTitle: {
    ...convertTypographyStyle(appTypography.h6),
    color: appColors.text,
    marginBottom: 2,
  },
  levelSubtitle: {
    ...convertTypographyStyle(appTypography.body2),
    color: appColors.grey[600],
    fontWeight: 'normal',
  },
  progressContainer: {
    height: 8,
    backgroundColor: appColors.grey[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: appSpacing.md,
  },
  progressBackground: {
    flex: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: appColors.primary.main,
    borderRadius: 4,
  },
  levelTip: {
    ...convertTypographyStyle(appTypography.caption),
    color: appColors.grey[500],
    textAlign: 'center',
    fontWeight: 'normal',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: appSpacing.md,
  },
  sectionTitle: {
    ...convertTypographyStyle(appTypography.h6),
    color: appColors.text,
    fontWeight: 'bold',
  },
  sectionCount: {
    ...convertTypographyStyle(appTypography.subtitle2),
    color: appColors.primary.main,
    fontWeight: '600',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: appSpacing.lg,
  },
  badgeContainer: {
    width: '30%',
    alignItems: 'center',
    marginBottom: appSpacing.lg,
    position: 'relative',
  },
  badge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: appSpacing.xs,
  },
  badgeName: {
    ...convertTypographyStyle(appTypography.caption),
    color: appColors.text,
    textAlign: 'center',
    height: 32,
  },
  lockedBadge: {
    position: 'absolute',
    top: 0,
    right: 10,
    backgroundColor: appColors.grey[500],
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: appColors.grey[100],
    borderRadius: 8,
    padding: appSpacing.md,
    marginBottom: appSpacing.xl,
    alignItems: 'center',
  },
  infoText: {
    ...convertTypographyStyle(appTypography.body2),
    color: appColors.grey[700],
    marginLeft: appSpacing.sm,
    flex: 1,
  },
  categoryTitle: {
    ...convertTypographyStyle(appTypography.h6),
    color: appColors.text,
    marginBottom: appSpacing.sm,
  },
  achievementName: {
    ...convertTypographyStyle(appTypography.subtitle2),
    color: appColors.text,
  },
  achievementDesc: {
    ...convertTypographyStyle(appTypography.body2),
    color: appColors.grey[600],
  },
  unlockText: {
    ...convertTypographyStyle(appTypography.caption),
    color: appColors.grey[500],
  },
  lockedText: {
    ...convertTypographyStyle(appTypography.caption),
    color: appColors.grey[400],
  },
}); 