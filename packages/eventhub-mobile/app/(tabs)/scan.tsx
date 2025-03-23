import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useTheme } from '../../src/shared/hooks/useTheme';

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
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <ActivityIndicator size="large" color={theme.colors.primary.main} />
      <Text style={[styles.text, { color: theme.colors.text.primary }]}>
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