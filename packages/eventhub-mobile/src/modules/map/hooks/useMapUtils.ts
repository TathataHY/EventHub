import { useRef, useCallback } from 'react';
import MapView, { Region } from 'react-native-maps';
import { Event } from './useMapEvents';

export function useMapUtils() {
  const mapRef = useRef<MapView | null>(null);

  // Centrar mapa en una ubicación específica
  const centerMapOnLocation = useCallback((
    latitude: number, 
    longitude: number, 
    latitudeDelta = 0.01, 
    longitudeDelta = 0.01
  ) => {
    if (!mapRef.current) return;
    
    const region: Region = {
      latitude,
      longitude,
      latitudeDelta,
      longitudeDelta
    };
    
    mapRef.current.animateToRegion(region, 500);
  }, []);

  // Ajustar el mapa para mostrar todos los marcadores
  const fitMapToMarkers = useCallback((
    events: Event[], 
    userLocation: { latitude: number; longitude: number } | null,
    latitudeDelta = 0.1,
    longitudeDelta = 0.1
  ) => {
    if (!mapRef.current || !events.length) return;
    
    // Si solo hay un evento, centramos el mapa en ese evento
    if (events.length === 1) {
      centerMapOnLocation(
        events[0].latitude, 
        events[0].longitude, 
        latitudeDelta, 
        longitudeDelta
      );
      return;
    }
    
    // Encontrar los límites para incluir todos los eventos y la ubicación del usuario
    let minLat = events[0].latitude;
    let maxLat = events[0].latitude;
    let minLng = events[0].longitude;
    let maxLng = events[0].longitude;
    
    events.forEach(event => {
      minLat = Math.min(minLat, event.latitude);
      maxLat = Math.max(maxLat, event.latitude);
      minLng = Math.min(minLng, event.longitude);
      maxLng = Math.max(maxLng, event.longitude);
    });
    
    // Incluir la ubicación del usuario si está disponible
    if (userLocation) {
      minLat = Math.min(minLat, userLocation.latitude);
      maxLat = Math.max(maxLat, userLocation.latitude);
      minLng = Math.min(minLng, userLocation.longitude);
      maxLng = Math.max(maxLng, userLocation.longitude);
    }
    
    // Añadir un margen
    const PADDING = 1.1;
    const latDelta = (maxLat - minLat) * PADDING;
    const lngDelta = (maxLng - minLng) * PADDING;
    
    const center = {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, latitudeDelta),
      longitudeDelta: Math.max(lngDelta, longitudeDelta)
    };
    
    mapRef.current.animateToRegion(center, 500);
  }, [centerMapOnLocation]);

  // Obtener color según categoría
  const getCategoryColor = useCallback((category: string): string => {
    const categoryColors: { [key: string]: string } = {
      'Música': '#FF5733',
      'Deportes': '#33A8FF',
      'Tecnología': '#33FF57',
      'Arte': '#A833FF',
      'Gastronomía': '#FFD700',
      'Cine': '#FF4081',
      'Teatro': '#9C27B0',
      'Conferencia': '#009688'
    };
    
    return categoryColors[category] || '#757575';
  }, []);

  return {
    mapRef,
    centerMapOnLocation,
    fitMapToMarkers,
    getCategoryColor
  };
} 