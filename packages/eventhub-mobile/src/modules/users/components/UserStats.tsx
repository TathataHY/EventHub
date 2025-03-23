import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors } from '@theme/base/colors';
import { getColorValue } from '@theme/index';

interface UserStatsProps {
  followersCount: number;
  followingCount: number;
  eventsAttended: number;
  eventsOrganized: number;
  style?: ViewStyle;
  onFollowersPress?: () => void;
  onFollowingPress?: () => void;
  onEventsPress?: () => void;
  onOrganizedPress?: () => void;
}

export const UserStats: React.FC<UserStatsProps> = ({
  followersCount,
  followingCount,
  eventsAttended,
  eventsOrganized,
  style,
  onFollowersPress,
  onFollowingPress,
  onEventsPress,
  onOrganizedPress
}) => {
  // Renderizar un único elemento de estadística
  const renderStat = (
    label: string, 
    value: number, 
    onPress?: () => void
  ) => (
    <TouchableOpacity 
      style={styles.statItem} 
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {renderStat('Seguidores', followersCount, onFollowersPress)}
      {renderStat('Siguiendo', followingCount, onFollowingPress)}
      {renderStat('Eventos', eventsAttended, onEventsPress)}
      {renderStat('Organizados', eventsOrganized, onOrganizedPress)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: getColorValue(colors.text),
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: getColorValue(colors.grey[500]),
  },
}); 