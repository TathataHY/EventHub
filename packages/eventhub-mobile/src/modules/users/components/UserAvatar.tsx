import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';

interface UserAvatarProps {
  photoURL?: string | null;
  size?: number;
  style?: ViewStyle;
  showEditButton?: boolean;
  onEditPress?: () => void;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  photoURL,
  size = 80,
  style,
  showEditButton = false,
  onEditPress
}) => {
  const { theme } = useTheme();
  
  // Determinar tamaños dinámicos basados en el prop size
  const borderRadius = size / 2;
  const defaultIconSize = size * 0.6;
  const editButtonSize = size * 0.3;
  
  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {photoURL ? (
        <Image
          source={{ uri: photoURL }}
          style={[
            styles.avatar,
            { width: size, height: size, borderRadius }
          ]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.placeholderAvatar,
            { 
              width: size, 
              height: size, 
              borderRadius,
              backgroundColor: theme.colors.grey[400]
            }
          ]}
        >
          <Ionicons
            name="person"
            size={defaultIconSize}
            color="#FFFFFF"
          />
        </View>
      )}
      
      {showEditButton && (
        <TouchableOpacity
          style={[
            styles.editButton,
            { 
              width: editButtonSize * 2, 
              height: editButtonSize * 2,
              borderRadius: editButtonSize,
              backgroundColor: theme.colors.primary.main
            }
          ]}
          onPress={onEditPress}
        >
          <Ionicons
            name="camera"
            size={editButtonSize}
            color="#FFFFFF"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatar: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  placeholderAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
}); 