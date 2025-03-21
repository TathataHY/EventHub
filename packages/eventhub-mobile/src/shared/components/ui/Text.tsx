import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body1' | 'body2' | 'caption';
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning';
  align?: 'left' | 'center' | 'right';
  weight?: 'regular' | 'medium' | 'bold';
}

export const Text: React.FC<TextProps> = ({
  variant = 'body1',
  color = 'primary',
  align = 'left',
  weight = 'regular',
  style,
  ...props
}) => {
  const textStyles = [
    styles.base,
    styles[variant],
    styles[color],
    styles[align],
    styles[weight],
    style,
  ];

  return <RNText style={textStyles} {...props} />;
};

const styles = StyleSheet.create({
  base: {
    fontFamily: 'System',
  },
  h1: {
    fontSize: 32,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
  },
  body1: {
    fontSize: 16,
    lineHeight: 24,
  },
  body2: {
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
  },
  primary: {
    color: '#000000',
  },
  secondary: {
    color: '#666666',
  },
  error: {
    color: '#FF3B30',
  },
  success: {
    color: '#34C759',
  },
  warning: {
    color: '#FF9500',
  },
  left: {
    textAlign: 'left',
  },
  center: {
    textAlign: 'center',
  },
  right: {
    textAlign: 'right',
  },
  regular: {
    fontWeight: '400',
  },
  medium: {
    fontWeight: '500',
  },
  bold: {
    fontWeight: '700',
  },
}); 