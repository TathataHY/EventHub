import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  Alert
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import MapView, { Marker, Region, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../src/context/ThemeContext';
import { eventService } from '../../src/services/event.service';
import { Divider } from '../../src/components/common/Divider';

// Mapa de colores para las categorías
const categoryColors: Record<string, string> = {
  'música': '#FF5733',
  'deportes': '#33FF57',
  'tecnología': '#3357FF',
  'arte': '#F033FF',
  'educación': '#FF9F33',
  'negocios': '#33FFF8',
  'social': '#FF33A8',
  'gastronomía': '#A833FF',
  'default': '#FF5733'
};

export default function MapScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Cargar eventos y obtener ubicación actual
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        
        // Cargar eventos
        const allEvents = await eventService.getAllEvents();
        
        // Extraer categorías únicas
        const uniqueCategories = [...new Set(allEvents.map(event => event.category))];
        setCategories(uniqueCategories);
        
        // Filtrar eventos que tienen ubicación
        const eventsWithLocation = allEvents.filter(
          event => event.location?.latitude && event.location?.longitude
        );
        
        setEvents(eventsWithLocation);
        setFilteredEvents(eventsWithLocation);
        
        // Obtener ubicación actual
        await getCurrentLocation();
      } catch (error) {
        console.error('Error al cargar datos:', error);
        Alert.alert(
          'Error',
          'No se pudieron cargar los eventos cercanos. Inténtalo de nuevo más tarde.'
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Obtener ubicación actual
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Para ver eventos cercanos, necesitamos acceso a tu ubicación.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      
      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      });
      
      // Mover el mapa a la ubicación actual
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        });
      }
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
    }
  };
  
  // Filtrar eventos por categoría
  const filterEventsByCategory = (category: string | null) => {
    setSelectedCategory(category);
    
    if (category === null) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event => event.category === category);
      setFilteredEvents(filtered);
    }
  };
  
  // Navegar a los detalles del evento
  const navigateToEventDetails = (eventId: string) => {
    router.push(`/events/evento/${eventId}`);
  };
  
  // Región inicial del mapa (centrada en una ubicación predeterminada)
  const initialRegion: Region = {
    latitude: 40.416775, // Madrid, España como ubicación predeterminada
    longitude: -3.70379,
    latitudeDelta: 0.5,
    longitudeDelta: 0.5
  };
  
  // Obtener el color según la categoría
  const getCategoryColor = (category: string): string => {
    return categoryColors[category.toLowerCase()] || categoryColors['default'];
  };
  
  // Centrar el mapa en la ubicación actual
  const centerMapOnCurrentLocation = () => {
    if (!currentLocation || !mapRef.current) return;
    
    mapRef.current.animateToRegion({
      latitude: currentLocation.latitude,
      longitude: currentLocation.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05
    });
  };
  
  // Ajustar el mapa para mostrar todos los marcadores
  const fitMapToMarkers = () => {
    if (filteredEvents.length === 0 || !mapRef.current) return;
    
    setTimeout(() => {
      mapRef.current?.fitToElements({
        animated: true,
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50
        }
      });
    }, 100);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Mapa de Eventos',
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerShadowVisible: false,
          headerTintColor: theme.colors.text,
        }}
      />
      
      {/* Filtros de categoría */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
        style={{ backgroundColor: theme.colors.card }}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            selectedCategory === null
              ? { backgroundColor: theme.colors.primary }
              : { backgroundColor: 'transparent', borderColor: theme.colors.border, borderWidth: 1 }
          ]}
          onPress={() => filterEventsByCategory(null)}
        >
          <Text
            style={[
              styles.filterChipText,
              selectedCategory === null
                ? { color: '#FFFFFF' }
                : { color: theme.colors.text }
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>
        
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.filterChip,
              selectedCategory === category
                ? { backgroundColor: theme.colors.primary }
                : { backgroundColor: 'transparent', borderColor: theme.colors.border, borderWidth: 1 }
            ]}
            onPress={() => filterEventsByCategory(category)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === category
                  ? { color: '#FFFFFF' }
                  : { color: theme.colors.text }
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      <Divider />
      
      {/* Contenido principal */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.secondaryText }]}>
            Cargando eventos cercanos...
          </Text>
        </View>
      ) : (
        <>
          {/* Mapa con eventos */}
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              initialRegion={
                currentLocation
                  ? {
                      latitude: currentLocation.latitude,
                      longitude: currentLocation.longitude,
                      latitudeDelta: 0.05,
                      longitudeDelta: 0.05
                    }
                  : initialRegion
              }
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              showsUserLocation={true}
              showsMyLocationButton={false}
              onMapReady={fitMapToMarkers}
            >
              {filteredEvents.map((event) => (
                <Marker
                  key={event.id}
                  coordinate={{
                    latitude: event.location.latitude,
                    longitude: event.location.longitude
                  }}
                  pinColor={getCategoryColor(event.category)}
                  onPress={() => navigateToEventDetails(event.id)}
                >
                  <Callout
                    tooltip
                    onPress={() => navigateToEventDetails(event.id)}
                  >
                    <View style={[styles.calloutContainer, { backgroundColor: theme.colors.card }]}>
                      <Text style={[styles.calloutTitle, { color: theme.colors.text }]}>
                        {event.title}
                      </Text>
                      <Text style={[styles.calloutInfo, { color: theme.colors.secondaryText }]}>
                        {event.date ? new Date(event.date).toLocaleDateString() : 'Fecha no disponible'}
                      </Text>
                      <Text style={[styles.calloutCategory, { color: getCategoryColor(event.category) }]}>
                        {event.category}
                      </Text>
                      <Text style={[styles.calloutAction, { color: theme.colors.primary }]}>
                        Toca para ver detalles
                      </Text>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>
            
            {/* Botones flotantes */}
            <View style={styles.mapButtons}>
              <TouchableOpacity
                style={[styles.mapButton, { backgroundColor: theme.colors.card }]}
                onPress={centerMapOnCurrentLocation}
              >
                <Ionicons name="locate" size={22} color={theme.colors.primary} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.mapButton, { backgroundColor: theme.colors.card }]}
                onPress={fitMapToMarkers}
              >
                <Ionicons name="expand" size={22} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            
            {/* Contador de eventos */}
            <View style={[styles.eventCounter, { backgroundColor: theme.colors.card }]}>
              <Text style={{ color: theme.colors.text }}>
                {filteredEvents.length} {filteredEvents.length === 1 ? 'evento' : 'eventos'} encontrados
              </Text>
            </View>
          </View>
          
          {/* Mensaje cuando no hay eventos */}
          {filteredEvents.length === 0 && (
            <View style={styles.emptyContainer}>
              <Ionicons name="map-outline" size={64} color={theme.colors.secondaryText} />
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                No hay eventos cercanos
              </Text>
              <Text style={[styles.emptySubText, { color: theme.colors.secondaryText }]}>
                {selectedCategory 
                  ? `No hay eventos de la categoría ${selectedCategory}`
                  : 'No encontramos eventos cercanos'}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filtersContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapButtons: {
    position: 'absolute',
    right: 16,
    top: 16,
    gap: 8,
  },
  mapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  calloutContainer: {
    width: 200,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  calloutInfo: {
    fontSize: 12,
    marginBottom: 2,
  },
  calloutCategory: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  calloutAction: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
  },
  eventCounter: {
    position: 'absolute',
    left: 16,
    top: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  emptyContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
}); 