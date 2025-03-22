import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import theme from '../../theme';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  labelStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  maxLength?: number;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  disabled = false,
  style,
  inputStyle,
  labelStyle,
  errorStyle,
  maxLength,
  autoCapitalize = 'none',
  autoCorrect = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(!secureTextEntry);

  // Determinar el color del borde basado en el estado
  const getBorderColor = () => {
    if (error) return theme.colors.error.main;
    if (isFocused) return theme.colors.primary.main;
    if (disabled) return theme.colors.border.disabled;
    return theme.colors.border.main;
  };

  // Función para manejar el toggle de mostrar/ocultar contraseña
  const toggleSecureEntry = () => {
    setIsSecureVisible(!isSecureVisible);
  };

  // Determinar el ícono correcto si es un campo de contraseña
  const getSecureIcon = () => {
    return isSecureVisible ? 'eye-slash' : 'eye';
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: disabled
                ? theme.colors.text.disabled
                : error
                ? theme.colors.error.main
                : theme.colors.text.secondary,
            },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: disabled
              ? theme.colors.background.disabled
              : theme.colors.background.card,
          },
        ]}
      >
        {leftIcon && (
          <FontAwesome
            name={leftIcon}
            size={18}
            color={
              disabled
                ? theme.colors.text.disabled
                : theme.colors.text.secondary
            }
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            {
              color: disabled
                ? theme.colors.text.disabled
                : theme.colors.text.primary,
              textAlignVertical: multiline ? 'top' : 'center',
              height: multiline ? 100 : 'auto',
              paddingLeft: leftIcon ? 0 : theme.spacing.md,
              paddingRight: rightIcon || secureTextEntry ? 0 : theme.spacing.md,
            },
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.placeholder}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : undefined}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
        />

        {secureTextEntry && (
          <TouchableOpacity
            onPress={toggleSecureEntry}
            style={styles.rightIconContainer}
          >
            <FontAwesome
              name={getSecureIcon()}
              size={18}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconContainer}
            disabled={!onRightIconPress}
          >
            <FontAwesome
              name={rightIcon}
              size={18}
              color={
                disabled
                  ? theme.colors.text.disabled
                  : theme.colors.text.secondary
              }
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? theme.spacing.sm : theme.spacing.xs,
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.regular,
  },
  leftIcon: {
    paddingHorizontal: theme.spacing.md,
  },
  rightIconContainer: {
    paddingHorizontal: theme.spacing.md,
    height: '100%',
    justifyContent: 'center',
  },
  error: {
    color: theme.colors.error.main,
    fontSize: theme.fontSizes.sm,
    marginTop: theme.spacing.xs,
  },
});

export default Input; 