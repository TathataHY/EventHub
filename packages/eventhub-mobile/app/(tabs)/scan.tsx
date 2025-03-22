import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '@core/context/ThemeContext';

/**
 * Pantalla de marcador para la pestaña de escaneo
 * Esta pantalla solo redirige a la pantalla de validación de tickets
 */
export default function ScanScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  
  // Redirigir automáticamente a la pantalla de validación de tickets
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      router.replace('/events/validate-tickets');
    }, 500);
    
    return () => clearTimeout(redirectTimer);
  }, []);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.text, { color: theme.colors.text }]}>
        Redirigiendo...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
  },
}); 