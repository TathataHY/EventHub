import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/hooks/useTheme';
import { getColorValue } from '@theme/theme.types';
import { PublicUserProfile } from '../types';

interface ProfileHeaderProps {
  user: PublicUserProfile;
  name: string;
  username: string;
  bio?: string;
  location?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  name,
  username,
  bio,
  location
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: getColorValue(theme.colors.background.paper) }]}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {user.photoURL ? (
          <Image 
            source={{ uri: user.photoURL }} 
            style={styles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: getColorValue(theme.colors.primary.light) }]}>
            <Ionicons name="person" size={24} color="#FFFFFF" />
          </View>
        )}
      </View>
      
      {/* Información del usuario */}
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: getColorValue(theme.colors.text.primary) }]}>
          {name}
        </Text>
        
        <Text style={[styles.username, { color: getColorValue(theme.colors.text.secondary) }]}>
          @{username}
        </Text>
        
        {bio && (
          <Text 
            style={[styles.bio, { color: getColorValue(theme.colors.text.primary) }]}
            numberOfLines={3}
          >
            {bio}
          </Text>
        )}
        
        {location && (
          <View style={styles.locationContainer}>
            <Ionicons 
              name="location-outline" 
              size={16} 
              color={getColorValue(theme.colors.text.secondary)} 
            />
            <Text style={[styles.locationText, { color: getColorValue(theme.colors.text.secondary) }]}>
              {location}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    fontSize: 14,
    marginBottom: 12,
  },
  bio: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    marginLeft: 4,
  },
}); 