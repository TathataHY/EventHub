import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors } from '@theme/base/colors';
import { getColorValue } from '@theme/index';

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
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  followButton: {
    backgroundColor: getColorValue(colors.primary),
  },
  unfollowButton: {
    backgroundColor: getColorValue(colors.grey[500]),
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
    fontSize: 14,
  },
  buttonOutlined: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grey[200],
    borderWidth: 1,
    borderColor: colors.grey[400],
  },
}); 