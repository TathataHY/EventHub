import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

import { useTheme } from '../../../core/context';
import { EventCard } from '@modules/events/components/EventCard';
import { eventService, ServiceEvent } from '@modules/events/services/event.service';
import { Event } from '@modules/events/types';
import { getColorValue, getIconColor } from '../../../shared/utils/color.utils';

interface NearbyEventsSectionProps {
  title?: string;
  maxEvents?: number;
  showLocation?: boolean;
  events?: ServiceEvent[];
  onEventPress?: (event: Event) => void;
}

export const NearbyEventsSection: React.FC<NearbyEventsSectionProps> = ({
  title = 'Eventos cerca de ti',
  maxEvents = 5,
  showLocation = true,
  events: externalEvents,
  onEventPress
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [nearbyEvents, setNearbyEvents] = useState<ServiceEvent[]>([]);
  
  useEffect(() => {
    // Si se proporcionan eventos externos, usarlos directamente
    if (externalEvents && externalEvents.length > 0) {
      setNearbyEvents(externalEvents.slice(0, maxEvents));
      setIsLoading(false);
      return;
    }

    // Si no hay eventos externos, cargar desde la ubicación
    const getLocationAsync = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('No se ha concedido permiso para acceder a la ubicación');
          loadRandomEvents();
          return;
        }

        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserLocation(location);
        loadNearbyEvents(location);
      } catch (error) {
        console.error('Error al obtener la ubicación:', error);
        setLocationError('No se pudo obtener tu ubicación actual');
        loadRandomEvents();
      }
    };

    getLocationAsync();
  }, []);
  
  const loadNearbyEvents = async (location: Location.LocationObject) => {
    try {
      setIsLoading(true);
      // Obtener eventos de la API o servicio
      const allEvents = await eventService.getAllEvents();
      
      if (!allEvents || allEvents.length === 0) {
        setNearbyEvents([]);
        return;
      }

      // Calcular distancia para cada evento
      const eventsWithDistance = allEvents
        .filter(event => event.latitude && event.longitude)
        .map(event => {
          const distance = getDistance(
            { latitude: location.coords.latitude, longitude: location.coords.longitude },
            { latitude: event.latitude || 0, longitude: event.longitude || 0 }
          );
          
          return {
            ...event,
            distance: Math.round(distance / 1000) // Convertir a km
          };
        });

      // Ordenar por distancia
      const sortedEvents = eventsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      // Establecer eventos cercanos
      setNearbyEvents(sortedEvents.slice(0, maxEvents).map(event => {
        return {
          ...event,
          id: String(event.id),
          organizerId: String(event.organizerId)
        };
      }));
      
    } catch (error) {
      console.error('Error al cargar eventos cercanos:', error);
      loadRandomEvents();
    } finally {
      setIsLoading(false);
    }
  };
  
  const loadRandomEvents = async () => {
    try {
      setIsLoading(true);
      const allEvents = await eventService.getAllEvents();
      
      // Tomar algunos eventos aleatorios
      const shuffled = [...allEvents].sort(() => 0.5 - Math.random());
      setNearbyEvents(shuffled.slice(0, maxEvents).map(event => {
        return {
          ...event,
          id: String(event.id),
          organizerId: String(event.organizerId)
        };
      }));
    } catch (error) {
      console.error('Error al cargar eventos aleatorios:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const navigateToEventDetails = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleEventPress = (event: Event) => {
    if (onEventPress) {
      onEventPress(event);
    } else {
      navigateToEventDetails(event.id);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={getColorValue(theme.colors.primary)} size="large" />
      </View>
    );
  }

  if (nearbyEvents.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: getColorValue(theme.colors.text.secondary) }]}>
          No hay eventos cercanos disponibles
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: getColorValue(theme.colors.text.primary) }]}>
          {title}
        </Text>
        <TouchableOpacity onPress={() => router.push('/events/search?filter=nearby')}>
          <Text style={[styles.viewAll, { color: getColorValue(theme.colors.primary) }]}>
            Ver todos
          </Text>
        </TouchableOpacity>
      </View>
      
      {locationError && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning-outline" size={14} color={getIconColor(theme.colors.warning)} />
          <Text style={[styles.warningText, { color: getColorValue(theme.colors.text.secondary) }]}>
            {locationError}
          </Text>
        </View>
      )}
      
      <FlatList
        data={nearbyEvents}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <EventCard
            event={{
              id: item.id.toString(),
              title: item.title,
              description: item.description,
              image: item.image,
              location: item.location,
              startDate: item.startDate,
              endDate: item.endDate,
              price: item.price,
              organizer: {
                id: item.organizerId ? item.organizerId.toString() : '',
                name: item.organizer?.name || 'Organizador'
              },
              category: item.category
            }}
            onPress={() => handleEventPress({
              id: item.id.toString(),
              title: item.title,
              description: item.description,
              image: item.image,
              location: item.location,
              startDate: item.startDate,
              endDate: item.endDate,
              price: item.price,
              organizer: {
                id: item.organizerId ? item.organizerId.toString() : '',
                name: item.organizer?.name || 'Organizador'
              },
              category: item.category,
              organizerId: item.organizerId ? item.organizerId.toString() : ''
            })}
            style={styles.card}
            showDistance={showLocation && typeof item.distance === 'number'}
            distance={item.distance}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 10,
  },
  card: {
    width: Dimensions.get('window').width * 0.75,
    marginRight: 16,
  },
  loadingContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  emptyContainer: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
  },
  warningText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
}); 