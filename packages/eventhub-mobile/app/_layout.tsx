import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Tabs screenOptions={{
        tabBarActiveTintColor: '#4a80f5',
        tabBarInactiveTintColor: '#888',
      }}>
        <Tabs.Screen 
          name="index" 
          options={{
            title: 'Inicio',
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <FontAwesome name="home" size={24} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="tabs/eventos" 
          options={{
            title: 'Eventos',
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <FontAwesome name="calendar" size={24} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="tabs/perfil" 
          options={{
            title: 'Perfil',
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user" size={24} color={color} />
            ),
          }} 
        />
        <Tabs.Screen 
          name="tabs/notificaciones" 
          options={{
            title: 'Notificaciones',
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <FontAwesome name="bell" size={24} color={color} />
            ),
          }} 
        />
      </Tabs>
    </>
  );
} 