import { useState, useEffect } from 'react';
import { Alert, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { Region } from 'react-native-maps';

export function useLocationServices() {
  // Dimensiones de la pantalla para el cálculo del delta
  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
  
  // Estado
  const [userLocation, setUserLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const [region, setRegion] = useState<Region>({
    latitude: 40.4168, // Madrid por defecto
    longitude: -3.7038,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  
  // Obtener ubicación actual
  useEffect(() => {
    getCurrentLocation();
  }, []);
  
  // Obtener ubicación actual del usuario
  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permiso denegado',
          'Necesitamos permisos de ubicación para mostrar tu posición en el mapa.'
        );
        return;
      }
      
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      const userLocationCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      
      setUserLocation(userLocationCoords);
      
      // Actualizar región del mapa
      setRegion({
        latitude: userLocationCoords.latitude,
        longitude: userLocationCoords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      Alert.alert(
        'Error de ubicación',
        'No se pudo obtener tu ubicación actual. Verifica que los servicios de ubicación estén activados.'
      );
    }
  };
  
  return {
    userLocation,
    region,
    setRegion,
    getCurrentLocation,
    LATITUDE_DELTA,
    LONGITUDE_DELTA
  };
} 