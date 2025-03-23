import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Platform, 
  Text,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Dimensions,
  ColorValue
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';

// Propiedades del componente
interface EventLocationMapProps {
  latitude: number;
  longitude: number;
  name: string;
  address?: string;
  showUserLocation?: boolean;
  onDirectionsPress?: () => void;
  height?: number | string;
  interactive?: boolean;
}

/**
 * Componente para mostrar la ubicación de un evento en un mapa
 */
export const EventLocationMap: React.FC<EventLocationMapProps> = ({
  latitude,
  longitude,
  name,
  address,
  showUserLocation = true,
  onDirectionsPress,
  height = 250,
  interactive = true
}) => {
  const { theme } = useTheme();
  
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Solicitar permisos de ubicación
  useEffect(() => {
    if (showUserLocation) {
      getUserLocation();
    } else {
      setIsLoading(false);
    }
  }, [showUserLocation]);

  // Obtener ubicación del usuario
  const getUserLocation = async () => {
    try {
      setIsLoading(true);
      
      // Solicitar permisos de ubicación
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      // Si no hay permisos, no continuar
      if (status !== 'granted') {
        setIsLoading(false);
        return;
      }
      
      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      
      setUserLocation(location);
    } catch (error) {
      console.error('Error al obtener ubicación:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir aplicación de mapas con direcciones
  const openMapsWithDirections = () => {
    if (onDirectionsPress) {
      onDirectionsPress();
      return;
    }
    
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${latitude},${longitude}`;
    const label = name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });
    
    if (url) {
      Linking.openURL(url);
    }
  };

  // Región inicial del mapa
  const initialRegion: Region = {
    latitude,
    longitude,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005
  };

  // Si está cargando, mostrar indicador
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { 
        height: typeof height === 'number' ? height : parseInt(height as string),
        backgroundColor: theme.colors.background.default
      }]}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
          Cargando mapa...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { 
      height: typeof height === 'number' ? height : parseInt(height as string)
    }]}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        showsUserLocation={showUserLocation && locationPermission === true}
        showsMyLocationButton={false}
        zoomEnabled={interactive}
        scrollEnabled={interactive}
        rotateEnabled={interactive}
        pitchEnabled={interactive}
      >
        {/* Marcador del evento */}
        <Marker
          coordinate={{ latitude, longitude }}
          title={name}
          description={address}
          pinColor={theme.colors.primary.main}
        />
      </MapView>
      
      {/* Botón para ver direcciones */}
      <TouchableOpacity
        style={[styles.directionsButton, { backgroundColor: theme.colors.primary.main }]}
        onPress={openMapsWithDirections}
      >
        <Ionicons name="navigate" size={20} color="#FFFFFF" />
        <Text style={styles.directionsButtonText}>
          Cómo llegar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 12,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  directionsButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  directionsButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
}); 