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
} from 'react-native';
import { appColors as colors, appTypography as typography } from '../../../theme';

export interface ButtonProps {
  title?: string;
  text?: string;
  onPress: () => void;
  type?: 'solid' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  containerStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
}

/**
 * Componente Button reutilizable 
 */
export function Button({
  title,
  text,
  onPress,
  type = 'solid',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  containerStyle,
  textStyle,
  style,
}: ButtonProps) {
  const buttonText = title || text;
  
  const getBackgroundColor = () => {
    if (disabled) return colors.grey[300];
    if (type === 'outline' || type === 'text') return 'transparent';
    return colors.primary.main;
  };

  const getBorderColor = () => {
    if (disabled) return colors.grey[300];
    if (type === 'outline') return colors.primary.main;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return colors.grey[500];
    if (type === 'outline' || type === 'text') return colors.primary.main;
    return colors.common.white;
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallButton;
      case 'large':
        return styles.largeButton;
      default:
        return styles.mediumButton;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'large':
        return styles.largeText;
      default:
        return styles.mediumText;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getSizeStyle(),
        { backgroundColor: getBackgroundColor(), borderColor: getBorderColor() },
        type === 'outline' && styles.outlineButton,
        type === 'text' && styles.textButton,
        containerStyle,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={type === 'solid' ? colors.common.white : colors.primary.main}
        />
      ) : (
        <View style={styles.contentContainer}>
          {icon && iconPosition === 'left' && (
            <View style={styles.iconLeftContainer}>{icon}</View>
          )}
          <Text
            style={[
              styles.text,
              getTextSizeStyle(),
              { color: getTextColor() },
              textStyle,
            ]}
          >
            {buttonText}
          </Text>
          {icon && iconPosition === 'right' && (
            <View style={styles.iconRightContainer}>{icon}</View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 32,
  },
  mediumButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    minHeight: 40,
  },
  largeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    minHeight: 48,
  },
  outlineButton: {
    borderWidth: 1,
  },
  textButton: {
    paddingHorizontal: 8,
    minHeight: 'auto' as any,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeftContainer: {
    marginRight: 8,
  },
  iconRightContainer: {
    marginLeft: 8,
  },
  text: {
    textAlign: 'center',
    fontWeight: '500',
  },
  smallText: {
    ...typography.button2,
    fontWeight: '500' as '500',
  },
  mediumText: {
    ...typography.button1,
    fontWeight: '500' as '500',
  },
  largeText: {
    ...typography.button1,
    fontSize: 16,
    fontWeight: '500' as '500',
  },
}); 