import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

// Importaciones de servicios y componentes necesarios
import { mockService } from '../../../core/services/mock.service';
import { eventService } from '../services/event.service';
import { Avatar } from '../../../shared/components/common/Avatar';
import { Card } from '../../../shared/components/common/Card';
import { Empty } from '../../../shared/components/common/Empty';
import { ErrorMessage } from '../../../shared/components/common/ErrorMessage';
import { theme } from '../../../theme';

/**
 * Pantalla que muestra la lista de asistentes a un evento
 */
export const EventAttendeesScreen = () => {
  const { id } = useLocalSearchParams();
  const eventId = typeof id === 'string' ? id : '';
  
  const [attendees, setAttendees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [event, setEvent] = useState(null);
  
  useEffect(() => {
    loadAttendees();
  }, [eventId]);
  
  const loadAttendees = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      // En producción, esto debe usar el servicio real
      const eventData = await mockService.getEventById(eventId);
      setEvent(eventData);
      
      // En producción, esto debe usar el servicio real
      const attendeesData = await mockService.getEventAttendees(eventId);
      setAttendees(attendeesData);
    } catch (err) {
      console.error('Error cargando asistentes:', err);
      setError('No se pudieron cargar los asistentes');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  if (error) {
    return (
      <ErrorMessage 
        message={error} 
        onRetry={loadAttendees}
      />
    );
  }
  
  if (!attendees.length) {
    return (
      <Empty 
        message="No hay asistentes registrados para este evento" 
        icon="users-slash"
      />
    );
  }
  
  return (
    <View style={styles.container}>
      {event && (
        <View style={styles.eventInfo}>
          <Text style={styles.title}>{event.title}</Text>
          <Text style={styles.subtitle}>
            <FontAwesome name="users" size={16} color={theme.colors.text} /> {' '}
            {attendees.length} {attendees.length === 1 ? 'Asistente' : 'Asistentes'}
          </Text>
        </View>
      )}
      
      <FlatList
        data={attendees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.attendeeCard}>
            <View style={styles.attendeeRow}>
              <Avatar 
                uri={item.profileImage} 
                size={50}
                name={item.name}
              />
              <View style={styles.attendeeInfo}>
                <Text style={styles.attendeeName}>{item.name}</Text>
                <Text style={styles.attendeeStatus}>
                  {item.isConfirmed ? 
                    <Text style={styles.confirmed}>
                      <Ionicons name="checkmark-circle" size={14} /> Confirmado
                    </Text> : 
                    <Text style={styles.pending}>
                      <Ionicons name="time" size={14} /> Pendiente
                    </Text>
                  }
                </Text>
              </View>
            </View>
          </Card>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  eventInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  list: {
    padding: 16,
  },
  attendeeCard: {
    marginBottom: 12,
    padding: 12,
  },
  attendeeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendeeInfo: {
    marginLeft: 12,
    flex: 1,
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: '500',
    color: theme.colors.text,
  },
  attendeeStatus: {
    fontSize: 14,
    marginTop: 4,
  },
  confirmed: {
    color: theme.colors.success,
  },
  pending: {
    color: theme.colors.warning,
  },
}); 