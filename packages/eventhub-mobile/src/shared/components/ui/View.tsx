import React from 'react';
import { View as RNView, ViewProps as RNViewProps, StyleSheet } from 'react-native';

interface ViewProps extends RNViewProps {
  flex?: number;
  direction?: 'row' | 'column';
  justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  align?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
  padding?: 'none' | 'small' | 'medium' | 'large';
  margin?: 'none' | 'small' | 'medium' | 'large';
  background?: 'primary' | 'secondary' | 'surface' | 'error' | 'success' | 'warning';
}

export const View: React.FC<ViewProps> = ({
  flex,
  direction = 'column',
  justify = 'flex-start',
  align = 'flex-start',
  padding = 'none',
  margin = 'none',
  background = 'surface',
  style,
  ...props
}) => {
  const viewStyles = [
    styles.base,
    flex && { flex },
    styles[direction],
    styles[`justify${justify}`],
    styles[`align${align}`],
    styles[`padding${padding}`],
    styles[`margin${margin}`],
    styles[`background${background}`],
    style,
  ];

  return <RNView style={viewStyles} {...props} />;
};

const styles = StyleSheet.create({
  base: {
    flexShrink: 1,
  },
  row: {
    flexDirection: 'row',
  },
  column: {
    flexDirection: 'column',
  },
  justifyflexStart: {
    justifyContent: 'flex-start',
  },
  justifyflexEnd: {
    justifyContent: 'flex-end',
  },
  justifycenter: {
    justifyContent: 'center',
  },
  justifyspaceBetween: {
    justifyContent: 'space-between',
  },
  justifyspaceAround: {
    justifyContent: 'space-around',
  },
  alignflexStart: {
    alignItems: 'flex-start',
  },
  alignflexEnd: {
    alignItems: 'flex-end',
  },
  aligncenter: {
    alignItems: 'center',
  },
  alignstretch: {
    alignItems: 'stretch',
  },
  paddingnone: {
    padding: 0,
  },
  paddingsmall: {
    padding: 8,
  },
  paddingmedium: {
    padding: 16,
  },
  paddinglarge: {
    padding: 24,
  },
  marginnone: {
    margin: 0,
  },
  marginsmall: {
    margin: 8,
  },
  marginmedium: {
    margin: 16,
  },
  marginlarge: {
    margin: 24,
  },
  backgroundprimary: {
    backgroundColor: '#007AFF',
  },
  backgroundsecondary: {
    backgroundColor: '#5856D6',
  },
  backgroundsurface: {
    backgroundColor: '#FFFFFF',
  },
  backgrounderror: {
    backgroundColor: '#FF3B30',
  },
  backgroundsuccess: {
    backgroundColor: '#34C759',
  },
  backgroundwarning: {
    backgroundColor: '#FF9500',
  },
}); 