import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../src/context/ThemeContext';
import { AchievementBadge } from '../../src/components/gamification/AchievementBadge';
import { LevelProgress } from '../../src/components/gamification/LevelProgress';
import { authService } from '../../src/services/auth.service';
import { achievementService, Achievement } from '../../src/services/achievement.service';
import { Divider } from '../../src/components/common/Divider';

export default function AchievementsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [lockedAchievements, setLockedAchievements] = useState<Achievement[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  useEffect(() => {
    loadUserAchievements();
  }, []);
  
  const loadUserAchievements = async () => {
    try {
      setLoading(true);
      
      // Obtener usuario autenticado
      const user = await authService.getCurrentUser();
      
      if (!user) {
        Alert.alert('Error', 'Debes iniciar sesión para ver tus logros');
        router.replace('/auth/login');
        return;
      }
      
      // Obtener perfil de usuario con logros
      const profile = await achievementService.getUserProfile(user.id);
      setUserProfile(profile);
      
      // Separar logros desbloqueados y bloqueados
      if (profile.enrichedAchievements) {
        const unlocked = profile.enrichedAchievements.filter(a => a.unlockedAt);
        const locked = profile.enrichedAchievements.filter(a => !a.unlockedAt);
        
        setUnlockedAchievements(unlocked);
        setLockedAchievements(locked);
      }
    } catch (error) {
      console.error('Error al cargar logros:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar tus logros. Inténtalo de nuevo más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  const handleAchievementPress = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
  };
  
  const renderAchievementDetail = () => {
    if (!selectedAchievement) return null;
    
    const isUnlocked = !!selectedAchievement.unlockedAt;
    const progress = selectedAchievement.progress || 0;
    const progressPercent = Math.min(
      100, 
      Math.floor((progress / selectedAchievement.requiredCount) * 100)
    );
    
    // Determinar color según el tipo de logro
    const getColorByType = (type: string) => {
      switch (type) {
        case 'attendance':
          return theme.colors.success;
        case 'creation':
          return theme.colors.primary;
        case 'social':
          return theme.colors.info;
        case 'exploration':
          return theme.colors.warning;
        default:
          return theme.colors.primary;
      }
    };
    
    const achievementColor = getColorByType(selectedAchievement.type);
    
    return (
      <View style={[styles.achievementDetail, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => setSelectedAchievement(null)}
        >
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <View style={styles.achievementContent}>
          <View style={styles.badgeContainer}>
            <AchievementBadge 
              achievement={selectedAchievement}
              size="large"
              showProgress={true}
            />
          </View>
          
          <View style={styles.achievementInfo}>
            <Text style={[styles.achievementTitle, { color: theme.colors.text }]}>
              {selectedAchievement.title}
            </Text>
            
            <Text style={[styles.achievementDescription, { color: theme.colors.secondaryText }]}>
              {selectedAchievement.description}
            </Text>
            
            <View style={styles.progressSection}>
              <View style={styles.progressHeader}>
                <Text style={[styles.progressLabel, { color: theme.colors.text }]}>
                  Progreso:
                </Text>
                <Text style={[styles.progressValue, { color: theme.colors.primary }]}>
                  {progress}/{selectedAchievement.requiredCount}
                </Text>
              </View>
              
              <View 
                style={[styles.progressBar, { backgroundColor: theme.colors.border }]}
              >
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: achievementColor,
                      width: `${progressPercent}%`
                    }
                  ]}
                />
              </View>
            </View>
            
            {isUnlocked && (
              <View style={styles.unlockedInfo}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                <Text style={[styles.unlockedText, { color: theme.colors.success }]}>
                  Logro desbloqueado el{' '}
                  {new Date(selectedAchievement.unlockedAt!).toLocaleDateString()}
                </Text>
              </View>
            )}
            
            {!isUnlocked && (
              <View style={styles.lockedInfo}>
                <Text style={[styles.pointsReward, { color: theme.colors.warning }]}>
                  Recompensa: {selectedAchievement.points} puntos
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };
  
  // Renderizar lista de logros
  const renderAchievementsList = (achievements: Achievement[], title: string) => {
    if (achievements.length === 0) return null;
    
    return (
      <View style={styles.achievementsSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        
        <FlatList
          data={achievements}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => (
            <AchievementBadge
              achievement={item}
              size="medium"
              onPress={handleAchievementPress}
            />
          )}
          contentContainerStyle={styles.achievementsGrid}
        />
      </View>
    );
  };
  
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.secondaryText }]}>
          Cargando tus logros...
        </Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Mis Logros',
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerShadowVisible: false,
          headerTintColor: theme.colors.text,
        }}
      />
      
      {selectedAchievement ? (
        renderAchievementDetail()
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {userProfile && (
            <LevelProgress userProfile={userProfile} />
          )}
          
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
              <Ionicons name="trophy-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {unlockedAchievements.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
                Logros Desbloqueados
              </Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
              <Ionicons name="lock-closed-outline" size={24} color={theme.colors.warning} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {lockedAchievements.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
                Por Desbloquear
              </Text>
            </View>
            
            <View style={[styles.statCard, { backgroundColor: theme.colors.card }]}>
              <Ionicons name="star-outline" size={24} color={theme.colors.info} />
              <Text style={[styles.statValue, { color: theme.colors.text }]}>
                {userProfile?.points || 0}
              </Text>
              <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
                Puntos
              </Text>
            </View>
          </View>
          
          <Divider style={styles.divider} />
          
          {renderAchievementsList(unlockedAchievements, 'Logros Desbloqueados')}
          
          {renderAchievementsList(lockedAchievements, 'Por Desbloquear')}
          
          <TouchableOpacity 
            style={[styles.resetButton, { backgroundColor: theme.colors.error.main }]}
            onPress={() => {
              Alert.alert(
                'Restablecer progreso',
                '¿Estás seguro de que quieres reiniciar todo tu progreso de logros? Esta acción no se puede deshacer.',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { 
                    text: 'Restablecer', 
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        const user = await authService.getCurrentUser();
                        if (user) {
                          await achievementService.resetUserProfile(user.id);
                          loadUserAchievements();
                        }
                      } catch (error) {
                        console.error('Error al resetear progreso:', error);
                      }
                    }
                  }
                ]
              );
            }}
          >
            <Ionicons name="refresh" size={16} color="#FFFFFF" />
            <Text style={styles.resetButtonText}>Reiniciar Progreso (Solo para desarrollo)</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    width: '31%',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  divider: {
    marginVertical: 20,
  },
  achievementsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  achievementsGrid: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  achievementDetail: {
    flex: 1,
    borderRadius: 16,
    margin: 16,
    padding: 20,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  achievementContent: {
    alignItems: 'center',
    paddingTop: 16,
  },
  badgeContainer: {
    marginBottom: 24,
  },
  achievementInfo: {
    width: '100%',
  },
  achievementTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  achievementDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  unlockedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  unlockedText: {
    fontSize: 14,
    marginLeft: 8,
  },
  lockedInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  pointsReward: {
    fontSize: 16,
    fontWeight: '500',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 30,
    marginBottom: 10,
    padding: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
}); 