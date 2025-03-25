import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  coords: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

export function useLocation() {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Solicitar permiso y obtener ubicación al montar el componente
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        
        // Solicitar permisos de ubicación
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status !== 'granted') {
          setErrorMsg('No se concedió permiso para acceder a la ubicación');
          setLoading(false);
          return;
        }
        
        // Obtener ubicación actual
        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        
        setLocation({
          coords: {
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            altitude: currentLocation.coords.altitude,
            accuracy: currentLocation.coords.accuracy,
            altitudeAccuracy: currentLocation.coords.altitudeAccuracy,
            heading: currentLocation.coords.heading,
            speed: currentLocation.coords.speed,
          },
          timestamp: currentLocation.timestamp,
        });
        
        setErrorMsg(null);
      } catch (error) {
        setErrorMsg('Error al obtener la ubicación');
        console.error('Error getting location:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Función para actualizar la ubicación manualmente
  const updateLocation = async () => {
    try {
      setLoading(true);
      
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      
      setLocation({
        coords: {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          altitude: currentLocation.coords.altitude,
          accuracy: currentLocation.coords.accuracy,
          altitudeAccuracy: currentLocation.coords.altitudeAccuracy,
          heading: currentLocation.coords.heading,
          speed: currentLocation.coords.speed,
        },
        timestamp: currentLocation.timestamp,
      });
      
      setErrorMsg(null);
    } catch (error) {
      setErrorMsg('Error al actualizar la ubicación');
      console.error('Error updating location:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    errorMsg,
    loading,
    updateLocation,
  };
} 