import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useEffect, useState } from 'react';

// Simulación de datos de eventos
const mockEvents = [
  { id: '1', title: 'Conferencia de Tecnología', date: '2025-04-15', location: 'Madrid' },
  { id: '2', title: 'Festival de Música', date: '2025-05-20', location: 'Barcelona' },
  { id: '3', title: 'Exposición de Arte', date: '2025-06-10', location: 'Valencia' },
  { id: '4', title: 'Maratón Benéfico', date: '2025-07-05', location: 'Sevilla' },
  { id: '5', title: 'Feria Gastronómica', date: '2025-08-12', location: 'Bilbao' },
];

export default function EventsScreen() {
  const [events, setEvents] = useState(mockEvents);

  // En el futuro, aquí se cargarían los eventos desde la API
  useEffect(() => {
    // Simulación de carga de datos
    console.log('Cargando eventos...');
  }, []);

  const renderEventItem = ({ item }) => (
    <View style={styles.eventCard}>
      <Text style={styles.eventTitle}>{item.title}</Text>
      <Text style={styles.eventDetails}>Fecha: {item.date}</Text>
      <Text style={styles.eventDetails}>Ubicación: {item.location}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Próximos Eventos</Text>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2e78b7',
  },
  eventDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
});