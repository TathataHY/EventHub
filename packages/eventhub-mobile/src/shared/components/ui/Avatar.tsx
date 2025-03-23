import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageSourcePropType,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { Icon } from './Icon';

type AvatarSize = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge' | number;
type AvatarShape = 'circle' | 'square' | 'rounded';
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'none';
type FontWeightType = "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";

interface AvatarProps {
  source?: string | null;
  name?: string;
  size?: number;
  style?: ViewStyle;
  showStatus?: boolean;
  isOnline?: boolean;
}

/**
 * Componente Avatar para mostrar imagen de perfil o iniciales
 */
export const Avatar = ({
  source,
  name = '',
  size = 40,
  style,
  showStatus = false,
  isOnline = false,
}: AvatarProps) => {
  const { theme, getColorValue } = useTheme();
  
  // Obtener iniciales del nombre
  const getInitials = () => {
    if (!name) return '';
    
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Estilos dinámicos basados en props
  const containerStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };
  
  const textStyle = {
    fontSize: size * 0.4,
  };
  
  const statusStyle = {
    width: size * 0.3,
    height: size * 0.3,
    borderRadius: size * 0.15,
    bottom: 0,
    right: 0,
    backgroundColor: isOnline 
      ? getColorValue(theme.colors.success.main) 
      : getColorValue(theme.colors.grey[400]),
  };
  
  return (
    <View style={[styles.container, style]}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={[styles.image, containerStyle]}
          resizeMode="cover"
        />
      ) : (
        <View style={[
          styles.placeholder, 
          containerStyle, 
          { backgroundColor: getColorValue(theme.colors.primary.light) }
        ]}>
          <Text style={[
            styles.initials, 
            textStyle,
            { color: getColorValue(theme.colors.primary.main) }
          ]}>
            {getInitials()}
          </Text>
        </View>
      )}
      
      {showStatus && (
        <View style={[styles.statusIndicator, statusStyle]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    backgroundColor: '#E1E1E1',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: 'bold',
  },
  statusIndicator: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});

export default Avatar; 