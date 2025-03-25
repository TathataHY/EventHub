import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle
} from 'react-native';
import { useTheme, getColorValue } from '../theme';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle
}) => {
  const { theme } = useTheme();
  
  // Determinar estilos según las props
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      opacity: disabled ? 0.6 : 1
    };
    
    // Ajustar tamaño
    switch (size) {
      case 'small':
        baseStyle.height = 36;
        baseStyle.paddingHorizontal = 12;
        break;
      case 'large':
        baseStyle.height = 56;
        baseStyle.paddingHorizontal = 24;
        break;
      default: // medium
        baseStyle.height = 48;
        baseStyle.paddingHorizontal = 20;
    }
    
    // Ajustar variante
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = getColorValue(theme.colors.secondary);
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 2;
        baseStyle.borderColor = getColorValue(theme.colors.primary);
        break;
      case 'text':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 0;
        break;
      default: // primary
        baseStyle.backgroundColor = getColorValue(theme.colors.primary);
    }
    
    return baseStyle;
  };
  
  // Determinar estilos del texto según las props
  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...styles.buttonText
    };
    
    // Ajustar tamaño del texto
    switch (size) {
      case 'small':
        baseTextStyle.fontSize = 14;
        break;
      case 'large':
        baseTextStyle.fontSize = 18;
        break;
      default: // medium
        baseTextStyle.fontSize = 16;
    }
    
    // Ajustar color del texto según variante
    switch (variant) {
      case 'outline':
        baseTextStyle.color = getColorValue(theme.colors.primary);
        break;
      case 'text':
        baseTextStyle.color = getColorValue(theme.colors.primary);
        break;
      default: // primary, secondary
        baseTextStyle.color = '#FFFFFF';
    }
    
    return baseTextStyle;
  };
  
  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'text' 
            ? getColorValue(theme.colors.primary) 
            : '#FFFFFF'
          } 
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
}); 