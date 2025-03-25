import { Stack } from 'expo-router';
import { EventDetailsScreen } from '@modules/events/screens';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';

/**
 * Pantalla de detalles de evento usando la estructura modular
 */
export default function EventPage() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Stack.Screen options={{ 
        title: '',
        headerTransparent: true,
        headerTintColor: 'white',
        headerBackTitle: 'Atrás',
      }} />
      <EventDetailsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 