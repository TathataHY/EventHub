import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';

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
  color,
  style,
  textStyle,
  spacing,
  dashed = false,
}) => {
  const { theme } = useTheme();
  
  // Usar el color proporcionado o el color divider del tema
  const dividerColor = color || theme.colors.grey[300];
  const dividerSpacing = spacing || 16;
  
  // Estilos condicionales basados en la orientación
  const getOrientationStyles = (): ViewStyle => {
    if (orientation === 'vertical') {
      return {
        width: thickness,
        height: '100%' as any,
        marginHorizontal: dividerSpacing,
      };
    }
    
    return {
      height: thickness,
      width: '100%' as any,
      marginVertical: dividerSpacing,
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
              backgroundColor: dividerColor,
              borderStyle: dashed ? 'dashed' : 'solid',
            },
          ]}
        />
        <Text
          style={[
            styles.text,
            { 
              marginHorizontal: 16,
              color: theme.colors.text.secondary,
              fontSize: 14
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
              backgroundColor: dividerColor,
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
          backgroundColor: dividerColor,
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
  text: {},
});

export default Divider; 