import React, { useEffect, ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '@core/context/ThemeContext';
// import { RootLayout } from '@modules/navigation';
import { ToastProvider } from '@shared/components/ui/Toast';
import { setupDependencies } from '@core/init';
import { StyleSheet } from 'react-native';
import { SimpleRootLayout } from './SimpleRootLayout';
// FIXME: Crear archivos para estos contextos o modificar las rutas de importación
// import { UserContext } from '@modules/auth/context';
// import { NotificationContext } from '@modules/notifications/context';

interface RootLayoutProviderProps {
  children: ReactNode;
}

/**
 * Proveedor principal de la aplicación que combina todos los proveedores necesarios
 * y proporciona el diseño raíz de la aplicación
 */
export const RootLayoutProvider: React.FC<RootLayoutProviderProps> = ({ children }) => {
  // Inicializar dependencias al montar el componente
  useEffect(() => {
    setupDependencies();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <SimpleRootLayout>
            {children}
          </SimpleRootLayout>
          <ToastProvider />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}; 