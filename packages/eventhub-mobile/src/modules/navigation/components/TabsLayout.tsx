import React from 'react';
import { Tabs } from 'expo-router';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useRouter } from 'expo-router';

/**
 * Componente de navegación por pestañas
 * Versión modular del antiguo TabsLayout
 * Usa imágenes estáticas en lugar de iconos para evitar problemas con Ionicons
 */
export const TabsLayout = () => {
  const { theme } = useTheme();
  const router = useRouter();

  // Colores para las opciones de la pantalla
  const primaryColor = theme.colors.primary.main;
  const greyColor = theme.colors.grey[500];
  const backgroundColor = '#FFFFFF';
  const borderColor = theme.colors.grey[300];
  const textColor = theme.colors.text.primary;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: primaryColor,
        tabBarInactiveTintColor: greyColor,
        tabBarStyle: {
          backgroundColor: backgroundColor,
          borderTopColor: borderColor,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: backgroundColor,
        },
        headerShadowVisible: false,
        headerTintColor: textColor,
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => router.push('/map')}
              style={{ marginRight: 15 }}
            >
              <View style={[styles.iconPlaceholder, {backgroundColor: textColor}]} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/search')}
              style={{ marginRight: 15 }}
            >
              <View style={[styles.iconPlaceholder, {backgroundColor: textColor}]} />
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconPlaceholder, {backgroundColor: color}]} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="events"
        options={{
          title: "Eventos",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconPlaceholder, {backgroundColor: color}]} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Validar',
          tabBarIcon: ({ color }) => (
            <View style={[styles.iconPlaceholder, {backgroundColor: color}]} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={() => router.push('/events/validate-tickets')}
            />
          ),
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
          },
        })}
      />
      
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notificaciones",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconPlaceholder, {backgroundColor: color}]} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconPlaceholder, {backgroundColor: color}]} />
          ),
        }}
      />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  iconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    opacity: 0.7
  }
}); 