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

import { useTheme } from '../../../shared/hooks/useTheme';
import { EventCard } from '@modules/events/components/EventCard';
import { eventService } from '@modules/events/services/event.service';
import { Event } from '@modules/events/types';

interface NearbyEventsSectionProps {
  events?: Event[];
  maxEvents?: number;
  onEventPress?: (event: Event) => void;
}

export const NearbyEventsSection: React.FC<NearbyEventsSectionProps> = ({
  events,
  maxEvents = 3,
  onEventPress
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [hasLocationPermission, setHasLocationPermission] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  
  useEffect(() => {
    if (events && events.length > 0) {
      setNearbyEvents(events.slice(0, maxEvents));
      setIsLoading(false);
    } else {
      getLocationAndEvents();
    }
  }, [events, maxEvents]);
  
  // Solicitar permisos de ubicación y cargar eventos cercanos
  const getLocationAndEvents = async () => {
    try {
      setIsLoading(true);
      
      // Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(status === 'granted');
      
      if (status !== 'granted') {
        // Si no hay permisos, mostrar eventos aleatorios
        loadRandomEvents();
        return;
      }
      
      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      
      // Cargar eventos cercanos
      await loadNearbyEvents(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
      // Si hay un error, mostrar eventos aleatorios
      loadRandomEvents();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cargar eventos cercanos
  const loadNearbyEvents = async (latitude: number, longitude: number) => {
    try {
      // Obtener todos los eventos
      const allEvents = await eventService.getAllEvents();
      
      // Filtrar eventos que tienen ubicación
      const eventsWithLocation = allEvents.filter(
        event => event.location?.latitude && event.location?.longitude
      );
      
      // Calcular distancia a cada evento
      const eventsWithDistance = eventsWithLocation.map(event => {
        const distance = getDistance(
          { latitude, longitude },
          { latitude: event.location.latitude, longitude: event.location.longitude }
        );
        
        return {
          ...event,
          distance // Distancia en metros
        };
      });
      
      // Ordenar por distancia
      const sortedEvents = eventsWithDistance.sort((a, b) => a.distance - b.distance);
      
      // Tomar solo los más cercanos
      setNearbyEvents(sortedEvents.slice(0, maxEvents));
    } catch (error) {
      console.error('Error al cargar eventos cercanos:', error);
      setNearbyEvents([]);
    }
  };
  
  // Cargar eventos aleatorios (si no hay permisos de ubicación)
  const loadRandomEvents = async () => {
    try {
      const allEvents = await eventService.getAllEvents();
      // Elegir algunos eventos aleatoriamente
      const shuffled = [...allEvents].sort(() => 0.5 - Math.random());
      setNearbyEvents(shuffled.slice(0, maxEvents));
    } catch (error) {
      console.error('Error al cargar eventos aleatorios:', error);
      setNearbyEvents([]);
    }
  };
  
  // Navegar a la pantalla de mapa
  const navigateToMap = () => {
    router.push('/map');
  };
  
  // Formatear distancia
  const formatDistance = (meters: number) => {
    if (meters < 1000) {
      return `${meters.toFixed(0)} m`;
    } else {
      return `${(meters / 1000).toFixed(1)} km`;
    }
  };

  // Manejar la selección de un evento
  const handleEventPress = (event: Event) => {
    if (onEventPress) {
      onEventPress(event);
    } else {
      router.push(`/events/${event.id}`);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          {hasLocationPermission ? 'Eventos cercanos' : 'Eventos destacados'}
        </Text>
        <TouchableOpacity onPress={navigateToMap}>
          <Text style={[styles.viewAllText, { color: theme.colors.primary.main }]}>
            Ver mapa
          </Text>
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary.main} />
        </View>
      ) : nearbyEvents.length > 0 ? (
        <FlatList
          data={nearbyEvents}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsList}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.eventCardContainer}
              onPress={() => handleEventPress(item)}
            >
              <EventCard event={item} />
              
              {userLocation && item.distance && (
                <View style={[styles.distanceBadge, { backgroundColor: theme.colors.background.default }]}>
                  <Ionicons name="location" size={12} color={theme.colors.primary.main} />
                  <Text style={[styles.distanceText, { color: theme.colors.text.secondary }]}>
                    {/* @ts-ignore: Ignorar errores de tipo en la propiedad distance */}
                    {formatDistance(item.distance)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="location-outline" size={32} color={theme.colors.text.secondary} />
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            No hay eventos cercanos
          </Text>
        </View>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  eventCardContainer: {
    width: width * 0.75,
    marginRight: 8,
    position: 'relative',
  },
  distanceBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  distanceText: {
    fontSize: 10,
    fontWeight: '500',
    marginLeft: 4,
  },
  emptyContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  emptyText: {
    marginTop: 8,
  }
}); 