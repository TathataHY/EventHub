import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../core/context';

/**
 * @deprecated Este componente está obsoleto y será eliminado en versiones futuras.
 * Usar RootLayoutProvider de src/core/providers en su lugar.
 * 
 * Componente que encapsula todos los proveedores de la aplicación
 * Se utiliza en el layout principal para proporcionar contexto global
 */
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          {children}
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}; 