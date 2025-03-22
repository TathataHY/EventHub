import React from 'react';
import { 
  View, 
  StyleSheet, 
  ViewStyle, 
  StyleProp, 
  TouchableOpacity,
  TouchableOpacityProps 
} from 'react-native';
import { colors } from '@theme/base/colors';

interface CardProps extends TouchableOpacityProps {
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
  onPress?: () => void;
}

/**
 * Componente Card reutilizable para mostrar contenido en una tarjeta con sombras
 */
export function Card({ style, children, onPress, ...rest }: CardProps) {
  // Si hay un onPress, renderizar como TouchableOpacity, de lo contrario como View
  if (onPress) {
    return (
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={onPress}
        activeOpacity={0.7}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.common.white,
    borderRadius: 8,
    padding: 16,
    shadowColor: colors.common.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
}); 