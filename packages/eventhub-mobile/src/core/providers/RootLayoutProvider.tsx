import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@core/context/ThemeContext';
import { RootLayout } from '../../modules/navigation';
import { ToastProvider } from '../../shared/components/ui/Toast';
import { StyleSheet, View } from 'react-native';
// FIXME: Crear archivos para estos contextos o modificar las rutas de importación
// import { UserContext } from '@modules/auth/context';
// import { NotificationContext } from '@modules/notifications/context';
import { Slot } from 'expo-router';

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
          <ToastProvider />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}; 