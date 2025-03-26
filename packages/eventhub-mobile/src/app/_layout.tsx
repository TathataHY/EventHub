import { Stack } from 'expo-router';
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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Creamos una instancia de QueryClient
const queryClient = new QueryClient();

// Prevenir que la splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

/**
 * Layout principal simplificado para la aplicación
 * Se han eliminado las dependencias problemáticas temporalmente
 */
export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          ...Ionicons.font,
          ...MaterialIcons.font,
          ...FontAwesome.font,
        });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
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
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
} 