import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { getColorValue } from '@theme/theme.types';

interface UserStatsProps {
  eventsCreated?: number;
  eventsAttended?: number;
  followersCount?: number;
  followingCount?: number;
  onItemPress?: (type: 'events' | 'attended' | 'followers' | 'following') => void;
}

export const UserStats: React.FC<UserStatsProps> = ({
  eventsCreated = 0,
  eventsAttended = 0,
  followersCount = 0,
  followingCount = 0,
  onItemPress
}) => {
  const { theme } = useTheme();
  
  const handleItemPress = (type: 'events' | 'attended' | 'followers' | 'following') => {
    if (onItemPress) {
      onItemPress(type);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: getColorValue(theme.colors.background.paper) }]}>
      <TouchableOpacity 
        style={styles.statItem}
        onPress={() => handleItemPress('events')}
      >
        <Text style={[styles.statValue, { color: getColorValue(theme.colors.text.primary) }]}>
          {eventsCreated}
        </Text>
        <Text style={[styles.statLabel, { color: getColorValue(theme.colors.text.secondary) }]}>
          Creados
        </Text>
      </TouchableOpacity>
      
      <View style={[styles.divider, { backgroundColor: getColorValue(theme.colors.text.disabled) }]} />
      
      <TouchableOpacity 
        style={styles.statItem}
        onPress={() => handleItemPress('attended')}
      >
        <Text style={[styles.statValue, { color: getColorValue(theme.colors.text.primary) }]}>
          {eventsAttended}
        </Text>
        <Text style={[styles.statLabel, { color: getColorValue(theme.colors.text.secondary) }]}>
          Asistidos
        </Text>
      </TouchableOpacity>
      
      <View style={[styles.divider, { backgroundColor: getColorValue(theme.colors.text.disabled) }]} />
      
      <TouchableOpacity 
        style={styles.statItem}
        onPress={() => handleItemPress('followers')}
      >
        <Text style={[styles.statValue, { color: getColorValue(theme.colors.text.primary) }]}>
          {followersCount}
        </Text>
        <Text style={[styles.statLabel, { color: getColorValue(theme.colors.text.secondary) }]}>
          Seguidores
        </Text>
      </TouchableOpacity>
      
      <View style={[styles.divider, { backgroundColor: getColorValue(theme.colors.text.disabled) }]} />
      
      <TouchableOpacity 
        style={styles.statItem}
        onPress={() => handleItemPress('following')}
      >
        <Text style={[styles.statValue, { color: getColorValue(theme.colors.text.primary) }]}>
          {followingCount}
        </Text>
        <Text style={[styles.statLabel, { color: getColorValue(theme.colors.text.secondary) }]}>
          Siguiendo
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: '70%',
    alignSelf: 'center',
  }
}); 