import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Linking, 
  Alert,
  ActivityIndicator,
  Dimensions,
  Platform
} from 'react-native';
import { useTheme } from '../../../shared/hooks/useTheme';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { eventService } from '../services';

const { width, height } = Dimensions.get('window');

/**
 * Pantalla de ubicación de un evento
 */
export const EventLocationScreen = () => {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [event, setEvent] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Coordenadas por defecto (se actualizan cuando se carga el evento)
  const [coordinates, setCoordinates] = useState({
    latitude: 40.4168,
    longitude: -3.7038,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  
  // Cargar datos del evento
  useEffect(() => {
    const loadEventData = async () => {
      try {
        setIsLoading(true);
        const eventData = await eventService.getEventById(id?.toString() || '');
        setEvent(eventData);
        
        // Si el evento tiene coordenadas, actualizar el mapa
        if (eventData?.location?.coordinates) {
          const { latitude, longitude } = eventData.location.coordinates;
          setCoordinates({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          });
        }
      } catch (error) {
        console.error('Error al cargar datos del evento:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos de ubicación');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadEventData();
  }, [id]);
  
  // Abrir en mapas nativos
  const openInMaps = () => {
    try {
      const { latitude, longitude } = coordinates;
      const label = event?.location?.name || event?.title || 'Evento';
      const url = Platform.select({
        ios: `maps:${latitude},${longitude}?q=${label}`,
        android: `geo:${latitude},${longitude}?q=${label}`,
      });
      
      if (url) {
        Linking.openURL(url);
      }
    } catch (error) {
      console.error('Error al abrir mapas:', error);
      Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
    }
  };
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.default }]}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>
          Cargando ubicación...
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={coordinates}
        region={coordinates}
        showsUserLocation
        showsCompass
      >
        <Marker
          coordinate={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          }}
          title={event?.title || 'Evento'}
          description={event?.location?.name || ''}
        />
      </MapView>
      
      <View style={[styles.infoPanel, { backgroundColor: theme.colors.background.default }]}>
        <Text style={[styles.eventTitle, { color: theme.colors.text.primary }]}>
          {event?.title || 'Evento'}
        </Text>
        
        <View style={styles.locationRow}>
          <Ionicons name="location" size={20} color={theme.colors.primary.main} />
          <Text style={[styles.locationText, { color: theme.colors.text.secondary }]}>
            {event?.location?.name || event?.location || 'Ubicación no disponible'}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.directionsButton, { backgroundColor: theme.colors.primary.main }]}
          onPress={openInMaps}
        >
          <Ionicons name="navigate" size={20} color="#FFFFFF" />
          <Text style={styles.directionsButtonText}>Obtener indicaciones</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  map: {
    width: width,
    height: height,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    marginLeft: 8,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  directionsButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 