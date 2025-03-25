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
import { getColorValue } from '@theme/theme.types';

type AvatarSize = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge' | number;
type AvatarShape = 'circle' | 'square' | 'rounded';
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'none';
type FontWeightType = "normal" | "bold" | "100" | "200" | "300" | "400" | "500" | "600" | "700" | "800" | "900";

interface AvatarProps {
  source?: string | null;
  imageUrl?: string | null; // Alias para compatibilidad
  uri?: string | null; // Otro alias para compatibilidad
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
  imageUrl,
  uri,
  name = '',
  size = 40,
  style,
  showStatus = false,
  isOnline = false,
}: AvatarProps) => {
  const { theme } = useTheme();
  
  // Usar cualquiera de las propiedades disponibles para la URL de la imagen
  const imageSource = source || imageUrl || uri;
  
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
  
  // Determinar el color del borde en función del estado
  const borderColor = isOnline !== undefined 
    ? isOnline 
      ? getColorValue(theme.colors.success.main)
      : getColorValue(theme.colors.grey[400])
    : 'transparent';

  // Resolver la imagen a mostrar
  const resolveImage = () => {
    if (uri) {
      return (
        <Image
          source={{ uri }}
          style={[
            styles.image,
            containerStyle,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              borderColor: borderColor,
              borderWidth: 1
            }
          ]}
          resizeMode="cover"
        />
      );
    }
    
    // Si no hay imagen, mostrar iniciales
    return (
      <View style={[
        styles.placeholder,
        containerStyle,
        {
          backgroundColor: getColorValue(theme.colors.primary.light)
        }
      ]}>
        <Text style={[
          styles.initials,
          textStyle,
          { color: getColorValue(theme.colors.primary.main) }
        ]}>
          {getInitials()}
        </Text>
      </View>
    );
  };
  
  return (
    <View style={[styles.container, style]}>
      {resolveImage()}
      
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