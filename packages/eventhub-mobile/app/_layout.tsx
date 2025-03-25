import { Slot } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Comentamos todas las importaciones problemáticas
// import { ThemeProvider } from '@core/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { ToastProvider } from '@shared/components/ui/Toast';
import * as SplashScreen from 'expo-splash-screen';

// Importamos QueryClient y QueryClientProvider de react-query
import { QueryClient, QueryClientProvider } from 'react-query';

// Creamos una instancia de QueryClient
const queryClient = new QueryClient();

// Prevenir que la splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

/**
 * Layout principal simplificado para la aplicación
 * Se han eliminado las dependencias problemáticas temporalmente
 */
export default function Layout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-cargar fuentes - asegurándose que todas las variantes de "ionicons" están cargadas
        await Font.loadAsync({
          ...Ionicons.font,
          'Ionicons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
          'ionicons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
          // Cargar también en minúsculas para casos especiales
          'ionicon': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
          'ion': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
          ...MaterialIcons.font,
          'MaterialIcons': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
          ...FontAwesome.font,
          'FontAwesome': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf'),
        });
        
        // Aumentamos el tiempo de espera para garantizar que las fuentes se carguen completamente
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log('Fuentes cargadas correctamente');
      } catch (e) {
        console.warn('Error al cargar recursos:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // Esto oculta la pantalla de splash una vez que la aplicación está lista
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Cargando recursos...</Text>
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <Slot />
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
} 