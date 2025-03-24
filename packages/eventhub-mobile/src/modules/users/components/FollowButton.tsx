import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { getColorValue } from '@theme/theme.types';
import { userService } from '../services/user.service';

interface FollowButtonProps {
  userId: string;
  isFollowing?: boolean;
  onFollowStatusChange?: (isFollowing: boolean) => void;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  isFollowing = false,
  onFollowStatusChange
}) => {
  const { theme } = useTheme();
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);
  
  const handlePress = async () => {
    try {
      setLoading(true);
      
      if (following) {
        // Dejar de seguir
        await userService.unfollowUser(userId);
      } else {
        // Seguir
        await userService.followUser(userId);
      }
      
      const newFollowingStatus = !following;
      setFollowing(newFollowingStatus);
      
      if (onFollowStatusChange) {
        onFollowStatusChange(newFollowingStatus);
      }
    } catch (error) {
      console.error('Error al cambiar estado de seguimiento:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        following 
          ? { backgroundColor: 'transparent', borderColor: getColorValue(theme.colors.primary.main) }
          : { backgroundColor: getColorValue(theme.colors.primary.main) }
      ]}
      onPress={handlePress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={following ? getColorValue(theme.colors.primary.main) : '#FFFFFF'} 
        />
      ) : (
        <Text 
          style={[
            styles.buttonText,
            { color: following ? getColorValue(theme.colors.primary.main) : '#FFFFFF' }
          ]}
        >
          {following ? 'Siguiendo' : 'Seguir'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
    minWidth: 120,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 