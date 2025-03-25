import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator, Text } from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { eventService } from '../services/event.service';
import { Event } from '../types';
import { EventsList } from '../components/EventsList';
import { useRouter } from 'expo-router';
import { EmptyState } from '@shared/components/ui/EmptyState';

interface EventsByCategoryProps {
  categoryId: string;
  categoryName?: string;
}

/**
 * Pantalla que muestra eventos filtrados por categoría
 */
export const EventsByCategory: React.FC<EventsByCategoryProps> = ({ categoryId, categoryName }) => {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar eventos al montar el componente
  useEffect(() => {
    loadEvents();
  }, [categoryId]);

  // Función para cargar eventos por categoría
  const loadEvents = async () => {
    if (!categoryId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Usar el servicio de eventos para obtener eventos por categoría
      const categoryEvents = await eventService.getEventsByCategory(categoryId);
      
      // Convertir los eventos al formato esperado por el componente
      const formattedEvents = categoryEvents.map(event => ({
        id: String(event.id),
        title: event.title,
        description: event.description || '',
        imageUrl: event.imageUrl || event.image,
        startDate: event.startDate,
        endDate: event.endDate || '',
        location: event.location,
        price: event.price || 0,
        category: event.category || '',
        organizerId: String(event.organizerId)
      }));
      
      setEvents(formattedEvents);
    } catch (err) {
      console.error('Error al cargar eventos por categoría:', err);
      setError('No se pudieron cargar los eventos. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Manejar refresco
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadEvents();
  };

  // Manejar tap en un evento
  const handleEventPress = (event: Event) => {
    router.push(`/events/${event.id}`);
  };

  // Renderizar estado de cargando
  if (isLoading && !isRefreshing) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
            Cargando eventos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <StatusBar 
        backgroundColor={theme.colors.background.default} 
        barStyle="dark-content" 
      />
      
      {error ? (
        <EmptyState 
          icon="alert-circle"
          title="Ups!"
          message={error}
          actionText="Intentar nuevamente"
          onAction={loadEvents}
        />
      ) : (
        <EventsList
          events={events}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          onRefresh={handleRefresh}
          onEventPress={handleEventPress}
          emptyText={`No hay eventos disponibles en la categoría ${categoryName || ''}`}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
}); 