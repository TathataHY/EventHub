import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import theme from '../../theme';

interface DividerProps {
  text?: string;
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  spacing?: number;
  dashed?: boolean;
}

export const Divider: React.FC<DividerProps> = ({
  text,
  orientation = 'horizontal',
  thickness = 1,
  color = theme.colors.border.main,
  style,
  textStyle,
  spacing = theme.spacing.md,
  dashed = false,
}) => {
  // Estilos condicionales basados en la orientación
  const getOrientationStyles = (): ViewStyle => {
    if (orientation === 'vertical') {
      return {
        width: thickness,
        height: '100%' as any,
        marginHorizontal: spacing,
      };
    }
    
    return {
      height: thickness,
      width: '100%' as any,
      marginVertical: spacing,
    };
  };

  // Si hay texto, renderizar un divisor con texto
  if (text && orientation === 'horizontal') {
    return (
      <View style={[styles.textContainer, style]}>
        <View
          style={[
            styles.divider,
            getOrientationStyles(),
            {
              backgroundColor: color,
              borderStyle: dashed ? 'dashed' : 'solid',
            },
          ]}
        />
        <Text
          style={[
            styles.text,
            { 
              marginHorizontal: theme.spacing.md,
              color: theme.colors.text.secondary,
            },
            textStyle,
          ]}
        >
          {text}
        </Text>
        <View
          style={[
            styles.divider,
            getOrientationStyles(),
            {
              backgroundColor: color,
              borderStyle: dashed ? 'dashed' : 'solid',
            },
          ]}
        />
      </View>
    );
  }

  // Sin texto, renderizar un divisor simple
  return (
    <View
      style={[
        styles.divider,
        getOrientationStyles(),
        {
          backgroundColor: color,
          borderStyle: dashed ? 'dashed' : 'solid',
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    borderWidth: 0,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    fontSize: theme.typography.fontSize.sm,
  },
});

export default Divider; 