import React from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Text } from './Text';
import { colors } from '@theme/base/colors';
import { getColorValue } from '@theme/index';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

// Define los estilos para el Checkbox
const getStyles = () => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: getColorValue(colors.grey[400]),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: 'transparent',
  },
  checked: {
    backgroundColor: getColorValue(colors.primary),
    borderColor: getColorValue(colors.primary),
  },
  disabled: {
    opacity: 0.5,
  },
  indicator: {
    width: 12,
    height: 12,
    backgroundColor: getColorValue(colors.common.white),
    borderRadius: 2,
  },
  label: {
    fontSize: 16,
    color: getColorValue(colors.text),
  },
  labelDisabled: {
    opacity: 0.5,
  },
});

export function Checkbox({ label, checked, disabled, onChange, style }: CheckboxProps) {
  const styles = getStyles();

  const handlePress = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          checked && styles.checked,
          disabled && styles.disabled,
        ]}
      >
        {checked && <View style={styles.indicator} />}
      </View>
      {label && (
        <Text
          style={[
            styles.label,
            disabled && styles.labelDisabled,
          ]}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

export default Checkbox; 