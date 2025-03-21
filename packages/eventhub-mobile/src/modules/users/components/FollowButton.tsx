import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@core/theme';

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onFollowPress: (userId: string) => Promise<{ success: boolean, error?: string }>;
  onUnfollowPress: (userId: string) => Promise<{ success: boolean, error?: string }>;
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  isFollowing,
  onFollowPress,
  onUnfollowPress
}) => {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePress = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (following) {
        // Dejar de seguir
        const result = await onUnfollowPress(userId);
        
        if (result.success) {
          setFollowing(false);
        } else {
          setError(result.error || 'Error al dejar de seguir');
        }
      } else {
        // Comenzar a seguir
        const result = await onFollowPress(userId);
        
        if (result.success) {
          setFollowing(true);
        } else {
          setError(result.error || 'Error al seguir usuario');
        }
      }
    } catch (err) {
      setError('Error al procesar la solicitud');
      console.error('Error en FollowButton:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        following ? styles.unfollowButton : styles.followButton
      ]}
      onPress={handlePress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text style={styles.buttonText}>
          {following ? 'Dejar de seguir' : 'Seguir'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
  },
  followButton: {
    backgroundColor: colors.primary,
  },
  unfollowButton: {
    backgroundColor: colors.gray,
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
}); 