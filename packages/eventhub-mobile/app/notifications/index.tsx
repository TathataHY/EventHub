import { Stack } from 'expo-router';
import { NotificationsScreen } from '@modules/notifications/screens';

export default function NotificationsPage() {
  return (
    <>
      <Stack.Screen options={{ 
        title: 'Notificaciones',
        headerShown: true 
      }} />
      <NotificationsScreen />
    </>
  );
} 