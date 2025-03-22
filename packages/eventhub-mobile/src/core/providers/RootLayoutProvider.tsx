import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../context';
import { RootLayout } from '../../modules/navigation';

/**
 * Proveedor principal de la aplicación que combina todos los proveedores necesarios
 * y proporciona el diseño raíz de la aplicación
 */
export const RootLayoutProvider = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <RootLayout />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}; 