import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  StyleProp,
  TouchableOpacity,
  Keyboard,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { appColors as colors } from '@theme';
import { typography } from '@theme/base/typography';
import { appSpacing as spacing } from '@theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  errorStyle?: StyleProp<TextStyle>;
  secureTextEntry?: boolean;
  touched?: boolean;
  iconName?: string;
  iconPosition?: 'left' | 'right';
  isPassword?: boolean;
  onIconPress?: () => void;
}

/**
 * Componente Input reutilizable para formularios
 */
export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  secureTextEntry,
  style,
  touched,
  iconName,
  iconPosition,
  isPassword,
  onIconPress,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (rest.onBlur) {
      rest.onBlur(e);
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Determinar si mostrar el error (si hay error y el campo ha sido tocado o no se especifica tocado)
  const showError = error && (touched === undefined || touched);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          showError && styles.inputContainerError,
          style as any,
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
            inputStyle,
          ]}
          placeholderTextColor={colors.grey[400]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          {...rest}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={togglePasswordVisibility}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.grey[500]}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !secureTextEntry && (
          <View style={styles.iconContainer}>{rightIcon}</View>
        )}
      </View>

      {showError && (
        <Text style={[styles.errorText, errorStyle]}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...typography.subtitle2,
    color: colors.grey[700],
    marginBottom: 8,
    fontWeight: "600" as const,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.grey[300],
    borderRadius: 8,
    backgroundColor: colors.common.white,
    minHeight: 48,
  },
  inputContainerFocused: {
    borderColor: colors.primary.main,
  },
  inputContainerError: {
    borderColor: colors.error.main,
  },
  input: {
    ...typography.body1,
    flex: 1,
    color: colors.text,
    padding: spacing.xs,
    fontWeight: "normal" as const,
  },
  inputWithLeftIcon: {
    paddingLeft: 8,
  },
  inputWithRightIcon: {
    paddingRight: 8,
  },
  iconContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.caption,
    color: colors.error.main,
    marginTop: 4,
    fontWeight: "normal" as const,
  },
}); 