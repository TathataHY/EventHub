import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../shared/hooks/useTheme';
import { UserProfile } from '@modules/gamification/types';

interface LevelProgressProps {
  userProfile: UserProfile;
  compact?: boolean;
  onPress?: () => void;
}

export const LevelProgress: React.FC<LevelProgressProps> = ({
  userProfile,
  compact = false,
  onPress
}) => {
  const { theme } = useTheme();
  
  // Calcular progreso hasta el siguiente nivel
  const calculateProgress = () => {
    const pointsPerLevel = 100;
    const currentLevelPoints = (userProfile.level - 1) * pointsPerLevel;
    const pointsToNextLevel = userProfile.level * pointsPerLevel;
    
    const pointsInCurrentLevel = userProfile.points - currentLevelPoints;
    const pointsRequired = pointsToNextLevel - currentLevelPoints;
    
    return {
      current: pointsInCurrentLevel,
      required: pointsRequired,
      percentage: Math.min(100, Math.floor((pointsInCurrentLevel / pointsRequired) * 100))
    };
  };
  
  const progress = calculateProgress();
  
  if (compact) {
    return (
      <Pressable 
        style={styles.compactContainer}
        onPress={onPress}
        disabled={!onPress}
      >
        <View style={[styles.levelBadge, { backgroundColor: theme.colors.primary.main }]}>
          <Text style={styles.levelText}>{userProfile.level}</Text>
        </View>
        
        <View style={styles.compactContent}>
          <View style={styles.compactHeader}>
            <Text style={[styles.levelTitle, { color: theme.colors.text.primary }]}>
              Nivel {userProfile.level}
            </Text>
            <Text style={[styles.pointsText, { color: theme.colors.text.secondary }]}>
              {userProfile.points} pts
            </Text>
          </View>
          
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { 
                  backgroundColor: theme.colors.grey[300],
                }
              ]}
            >
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    backgroundColor: theme.colors.primary.main,
                    width: `${progress.percentage}%` 
                  }
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.text.secondary }]}>
              {progress.current}/{progress.required}
            </Text>
          </View>
        </View>
        
        {onPress && (
          <Ionicons 
            name="chevron-forward" 
            size={16} 
            color={theme.colors.text.secondary} 
            style={styles.chevron}
          />
        )}
      </Pressable>
    );
  }
  
  return (
    <Pressable 
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.default }
      ]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.levelContainer}>
          <View style={[styles.levelCircle, { borderColor: theme.colors.primary.main }]}>
            <Text style={[styles.levelNumber, { color: theme.colors.primary.main }]}>
              {userProfile.level}
            </Text>
          </View>
          <Text style={[styles.levelLabel, { color: theme.colors.text.primary }]}>
            Nivel
          </Text>
        </View>
        
        <View style={styles.pointsContainer}>
          <Ionicons name="star" size={24} color={theme.colors.warning.main} />
          <Text style={[styles.points, { color: theme.colors.text.primary }]}>
            {userProfile.points} Puntos
          </Text>
        </View>
      </View>
      
      <Text style={[styles.nextLevel, { color: theme.colors.text.secondary }]}>
        {progress.current} / {progress.required} puntos para el siguiente nivel
      </Text>
      
      <View style={styles.progressContainer}>
        <View 
          style={[
            styles.progressBackground, 
            { backgroundColor: theme.colors.grey[300] }
          ]}
        >
          <View 
            style={[
              styles.progressFilled, 
              { 
                backgroundColor: theme.colors.primary.main,
                width: `${progress.percentage}%` 
              }
            ]}
          />
        </View>
        
        <Text style={[styles.progressPercentage, { color: theme.colors.primary.main }]}>
          {progress.percentage}%
        </Text>
      </View>
      
      {onPress && (
        <View style={styles.footer}>
          <Text style={[styles.viewAll, { color: theme.colors.primary.main }]}>
            Ver todos mis logros
          </Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.primary.main} />
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  levelNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  levelLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  points: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  nextLevel: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBackground: {
    height: 10,
    borderRadius: 5,
    flex: 1,
    overflow: 'hidden',
    marginRight: 10,
  },
  progressFilled: {
    height: '100%',
    borderRadius: 5,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 40,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  levelBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  compactContent: {
    flex: 1,
    marginLeft: 12,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  levelTitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  pointsText: {
    fontSize: 12,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    flex: 1,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    width: 45,
  },
  chevron: {
    marginLeft: 8,
  },
}); 