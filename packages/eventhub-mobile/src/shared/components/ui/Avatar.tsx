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
import { FontAwesome } from '@expo/vector-icons';
import theme from '../../theme';

type AvatarSize = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge' | number;
type AvatarShape = 'circle' | 'square' | 'rounded';
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'none';

interface AvatarProps {
  source?: ImageSourcePropType;
  name?: string;
  initials?: string;
  size?: AvatarSize;
  shape?: AvatarShape;
  status?: AvatarStatus;
  icon?: string;
  backgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  statusPosition?: 'top-right' | 'bottom-right';
  statusSize?: number;
  variant?: 'circle' | 'rounded' | 'square';
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  initials,
  size = 'medium',
  shape = 'circle',
  status = 'none',
  icon,
  backgroundColor,
  style,
  textStyle,
  onPress,
  statusPosition = 'bottom-right',
  statusSize,
  variant = 'circle',
}) => {
  // Determine size based on preset or custom number
  const getSize = () => {
    if (typeof size === 'number') {
      return size;
    }
    
    switch (size) {
      case 'tiny':
        return 24;
      case 'small':
        return 32;
      case 'large':
        return 64;
      case 'xlarge':
        return 96;
      default:
        return 48;
    }
  };
  
  // Determine border radius based on variant
  const getBorderRadius = () => {
    const actualSize = getSize();
    
    switch (variant) {
      case 'circle':
        return actualSize / 2;
      case 'rounded':
        return 8;
      case 'square':
        return 0;
      default:
        return actualSize / 2;
    }
  };
  
  // Get initials from name
  const getInitials = () => {
    if (initials) return initials;
    if (name) {
      const nameParts = name.split(' ');
      if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    }
    return '';
  };
  
  const avatarSize = getSize();
  const borderRadius = getBorderRadius();
  const displayedInitials = getInitials();

  // Determinar el color según el estado
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return theme.colors.success.main;
      case 'offline':
        return theme.colors.text.disabled;
      case 'away':
        return theme.colors.warning.main;
      case 'busy':
        return theme.colors.error.main;
      default:
        return 'transparent';
    }
  };

  const statusDotSize = statusSize || Math.max(avatarSize / 6, 8);
  const statusPadding = statusSize ? 0 : 2;

  // Estilos del contenedor
  const containerStyles = [
    styles.container,
    {
      width: avatarSize,
      height: avatarSize,
      borderRadius,
      backgroundColor: backgroundColor || theme.colors.primary.light,
    },
    style,
  ];

  // Estilo para la posición del indicador de estado
  const statusPositionStyle = {
    top: statusPosition === 'top-right' ? -statusDotSize / 4 : undefined,
    bottom: statusPosition === 'bottom-right' ? -statusDotSize / 4 : undefined,
    right: -statusDotSize / 4,
  };

  // Renderizar el contenido del avatar
  const renderContent = () => {
    if (source) {
      return (
        <Image
          source={source}
          style={[
            styles.image,
            { borderRadius },
          ]}
        />
      );
    }

    if (icon) {
      return (
        <FontAwesome
          name={icon}
          size={avatarSize * 0.5}
          color={theme.colors.text.onPrimary}
        />
      );
    }

    if (displayedInitials) {
      return (
        <Text
          style={[
            styles.text,
            {
              fontSize: avatarSize * 0.4,
            },
            textStyle,
          ]}
        >
          {displayedInitials}
        </Text>
      );
    }

    // Fallback a un ícono de usuario
    return (
      <FontAwesome
        name="user"
        size={avatarSize * 0.5}
        color={theme.colors.text.onPrimary}
      />
    );
  };

  const avatarContent = (
    <View style={containerStyles}>
      {renderContent()}
      {status !== 'none' && (
        <View
          style={[
            styles.statusIndicator,
            statusPositionStyle,
            {
              width: statusDotSize,
              height: statusDotSize,
              backgroundColor: getStatusColor(),
              borderRadius: statusDotSize / 2,
              borderWidth: statusPadding,
            },
          ]}
        />
      )}
    </View>
  );

  // Si hay onPress, envolver en TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {avatarContent}
      </TouchableOpacity>
    );
  }

  return avatarContent;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    color: theme.colors.text.onPrimary,
    fontWeight: 'bold',
  },
  statusIndicator: {
    position: 'absolute',
    borderColor: theme.colors.background.default,
  },
});

export default Avatar; 