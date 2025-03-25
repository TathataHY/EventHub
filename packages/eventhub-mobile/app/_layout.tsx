import { Slot } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@core/context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ToastProvider } from '@shared/components/ui/Toast';

/**
 * Layout principal para la aplicación
 */
export default function Layout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        ...Ionicons.font,
      });
      setFontsLoaded(true);
    }
    
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SafeAreaProvider>
          <StatusBar style="auto" />
          <Slot />
          <ToastProvider />
        </SafeAreaProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
} 