import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import theme from '@theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}) => {
  // Determinar los estilos según la variante y el tamaño
  const getButtonStyles = () => {
    const baseStyle: ViewStyle = {
      ...styles.base,
      ...styles[variant],
      ...styles[size],
      opacity: disabled ? theme.opacity.disabled : 1,
    };
    
    // Estilos según la variante
    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.primary.main,
        };
      
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.secondary.main,
        };
      
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.primary.main,
        };
      
      case 'text':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          paddingHorizontal: 4,
          paddingVertical: 4,
        };
      
      default:
        return baseStyle;
    }
  };
  
  // Determinar los estilos de texto según la variante y el tamaño
  const getTextStyles = () => {
    const baseStyle: TextStyle = {
      ...styles.buttonText,
      ...theme.typography.variant.button,
    };
    
    // Estilos según el tamaño
    switch (size) {
      case 'small':
        return {
          ...baseStyle,
          fontSize: theme.typography.fontSize.sm,
        };
      
      case 'large':
        return {
          ...baseStyle,
          fontSize: theme.typography.fontSize.lg,
        };
      
      default:
        return baseStyle;
    }
  };
  
  // Estilos de texto según la variante
  const getTextColorStyles = () => {
    switch (variant) {
      case 'outline':
      case 'text':
        return {
          color: theme.colors.primary.main,
        };
      
      default:
        return {
          color: theme.colors.common.white,
        };
    }
  };
  
  // Determinar los estilos según el tamaño
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: theme.spacing.sm,
          paddingVertical: theme.spacing.xs,
          borderRadius: theme.borderRadius.sm,
        };
      
      case 'large':
        return {
          paddingHorizontal: theme.spacing.lg,
          paddingVertical: theme.spacing.md,
          borderRadius: theme.borderRadius.md,
        };
      
      default:
        return {
          paddingHorizontal: theme.spacing.md,
          paddingVertical: theme.spacing.sm,
          borderRadius: theme.borderRadius.sm,
        };
    }
  };
  
  const buttonStyles = [
    getButtonStyles(),
    getSizeStyles(),
    fullWidth && styles.fullWidth,
    style,
  ];
  
  const textStyles = [
    getTextStyles(),
    getTextColorStyles(),
    textStyle,
  ];
  
  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={disabled ? 1 : 0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'text' 
            ? theme.colors.primary.main 
            : theme.colors.common.white
          }
        />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && (
            <FontAwesome 
              name={leftIcon} 
              size={16} 
              color={variant === 'outline' || variant === 'text' 
                ? theme.colors.primary.main 
                : theme.colors.common.white
              } 
              style={styles.leftIcon} 
            />
          )}
          
          <Text style={textStyles}>{title}</Text>
          
          {rightIcon && (
            <FontAwesome 
              name={rightIcon} 
              size={16} 
              color={variant === 'outline' || variant === 'text' 
                ? theme.colors.primary.main 
                : theme.colors.common.white
              } 
              style={styles.rightIcon} 
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.main,
    borderRadius: theme.borderRadius.sm,
  },
  buttonText: {
    color: theme.colors.common.white,
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default Button; 