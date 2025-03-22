import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../../../src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Divider } from '../../../../src/components/common/Divider';

// Tipo para la ubicación
interface LocationType {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  city: string;
  country: string;
}

// Tipo para los datos del evento
interface EventDetails {
  id: string;
  title: string;
  date: string;
  location: LocationType;
}

export default function EventLocationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useTheme();
  const router = useRouter();
  
  // Estados
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [region, setRegion] = useState({
    latitude: 19.4326, // Centro de Ciudad de México por defecto
    longitude: -99.1332,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  // Cargar datos del evento y ubicación
  useEffect(() => {
    // En una app real, esto sería una petición a la API
    setTimeout(() => {
      // Datos de ejemplo
      const mockEvent: EventDetails = {
        id: id || '1',
        title: 'Festival de Música Electrónica',
        date: '2023-12-15T20:00:00',
        location: {
          latitude: 19.4326,
          longitude: -99.1332,
          name: 'Parque Chapultepec',
          address: 'Paseo de la Reforma s/n, Bosque de Chapultepec',
          city: 'Ciudad de México',
          country: 'México',
        },
      };
      
      setEvent(mockEvent);
      
      // Actualizar región del mapa
      if (mockEvent.location) {
        setRegion({
          latitude: mockEvent.location.latitude,
          longitude: mockEvent.location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
      
      setIsLoading(false);
    }, 1000);
  }, [id]);

  // Abrir dirección en mapas
  const openInMaps = () => {
    if (!event || !event.location) return;
    
    const { latitude, longitude, name } = event.location;
    const label = encodeURIComponent(name);
    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });
    
    if (url) {
      Linking.openURL(url);
    }
  };

  // Abrir dirección en Google Maps
  const openInGoogleMaps = () => {
    if (!event || !event.location) return;
    
    const { latitude, longitude } = event.location;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    
    Linking.openURL(url);
  };

  // Abrir dirección en Waze
  const openInWaze = () => {
    if (!event || !event.location) return;
    
    const { latitude, longitude } = event.location;
    const url = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
    
    Linking.openURL(url);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Cargando ubicación...
        </Text>
      </View>
    );
  }

  if (!event || !event.location) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Ionicons name="location-off" size={80} color={theme.colors.error} />
        <Text style={[styles.errorTitle, { color: theme.colors.text }]}>
          Ubicación no disponible
        </Text>
        <Text style={[styles.errorMessage, { color: theme.colors.secondaryText }]}>
          No se pudo cargar la ubicación de este evento.
        </Text>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Cabecera */}
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.eventTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {event.title}
        </Text>
        <Text style={[styles.locationName, { color: theme.colors.primary }]}>
          {event.location.name}
        </Text>
      </View>
      
      <Divider />
      
      {/* Mapa */}
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={region}
          showsUserLocation
          showsMyLocationButton
          showsCompass
          showsScale
          initialRegion={region}
        >
          <Marker
            coordinate={{
              latitude: event.location.latitude,
              longitude: event.location.longitude,
            }}
            title={event.location.name}
            description={event.location.address}
            pinColor={theme.mode === 'dark' ? '#FF5252' : '#FF5252'}
          />
        </MapView>
      </View>

      {/* Información de ubicación */}
      <View style={[styles.locationInfo, { backgroundColor: theme.colors.card }]}>
        <View style={styles.locationDetails}>
          <Ionicons name="location" size={20} color={theme.colors.primary} style={styles.infoIcon} />
          <View style={styles.addressContainer}>
            <Text style={[styles.addressText, { color: theme.colors.text }]}>
              {event.location.address}
            </Text>
            <Text style={[styles.cityText, { color: theme.colors.secondaryText }]}>
              {event.location.city}, {event.location.country}
            </Text>
          </View>
        </View>
      </View>
      
      <Divider />

      {/* Opciones de navegación */}
      <View style={[styles.navigationOptions, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.navigationTitle, { color: theme.colors.text }]}>
          Abrir con
        </Text>
        
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: theme.colors.background }]}
            onPress={openInMaps}
          >
            <Ionicons name="map" size={24} color={theme.colors.primary} />
            <Text style={[styles.navButtonText, { color: theme.colors.text }]}>
              Maps
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: theme.colors.background }]}
            onPress={openInGoogleMaps}
          >
            <Ionicons name="location" size={24} color="#4285F4" />
            <Text style={[styles.navButtonText, { color: theme.colors.text }]}>
              Google Maps
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: theme.colors.background }]}
            onPress={openInWaze}
          >
            <Ionicons name="navigate" size={24} color="#33CCFF" />
            <Text style={[styles.navButtonText, { color: theme.colors.text }]}>
              Waze
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Botón flotante para volver */}
      <TouchableOpacity
        style={[styles.floatingBackButton, { backgroundColor: theme.colors.card }]}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  locationInfo: {
    padding: 16,
  },
  locationDetails: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  addressContainer: {
    flex: 1,
  },
  addressText: {
    fontSize: 16,
    marginBottom: 4,
  },
  cityText: {
    fontSize: 14,
  },
  navigationOptions: {
    padding: 16,
  },
  navigationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  navButtonText: {
    fontSize: 12,
    marginTop: 4,
  },
  floatingBackButton: {
    position: 'absolute',
    top: 70,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
}); 