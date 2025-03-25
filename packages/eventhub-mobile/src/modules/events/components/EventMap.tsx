import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Platform, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTheme } from '@core/context/ThemeContext';

interface EventMapProps {
  latitude: number;
  longitude: number;
  name: string;
  showUserLocation?: boolean;
}

export const EventMap: React.FC<EventMapProps> = ({
  latitude,
  longitude,
  name,
  showUserLocation = false,
}) => {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (showUserLocation) {
      (async () => {
        try {
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permiso para acceder a la ubicación denegado');
            setIsLoading(false);
            return;
          }

          const location = await Location.getCurrentPositionAsync({});
          setUserLocation(location);
        } catch (error) {
          setErrorMsg('No se pudo obtener la ubicación actual');
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      setIsLoading(false);
    }
  }, [showUserLocation]);

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.paper }]}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>Cargando mapa...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background.paper }]}>
        <Text style={[styles.errorText, { color: theme.colors.error.main }]}>{errorMsg}</Text>
      </View>
    );
  }

  const initialRegion = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={[styles.container, { borderRadius: 8 }]}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title={name}
          description="Ubicación del evento"
          pinColor={theme.colors.primary.main}
        />
        
        {showUserLocation && userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            }}
            title="Tu ubicación"
            pinColor={theme.colors.success.main}
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    width: '100%',
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    height: 250,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
  },
  errorContainer: {
    height: 250,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    textAlign: 'center',
  },
}); 