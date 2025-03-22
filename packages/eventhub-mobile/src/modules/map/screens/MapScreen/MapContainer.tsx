import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useMapEvents, useLocationServices, useMapUtils } from '../../hooks';
import { MapPresenter } from './MapPresenter';

/**
 * Contenedor para la pantalla de mapa
 * Maneja la lógica de negocio y proporciona datos al presentador
 */
export function MapContainer() {
  const router = useRouter();
  
  // Hooks personalizados para la lógica de negocio
  const { 
    isLoading, 
    filteredEvents, 
    selectedCategory, 
    loadEvents, 
    filterEventsByCategory 
  } = useMapEvents();
  
  const { 
    userLocation, 
    region, 
    setRegion, 
    getCurrentLocation,
    LATITUDE_DELTA,
    LONGITUDE_DELTA
  } = useLocationServices();
  
  const { 
    mapRef, 
    getCategoryColor, 
    centerMapOnLocation, 
    fitMapToMarkers 
  } = useMapUtils();
  
  // Cargar los datos
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);
  
  // Ajustar el mapa cuando cambian los eventos filtrados
  useEffect(() => {
    if (!isLoading && filteredEvents.length > 0) {
      setTimeout(() => fitMapToMarkers(filteredEvents, userLocation, LATITUDE_DELTA, LONGITUDE_DELTA), 300);
    }
  }, [filteredEvents, fitMapToMarkers, isLoading, userLocation, LATITUDE_DELTA, LONGITUDE_DELTA]);
  
  // Navegar al detalle del evento
  const navigateToEventDetails = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };
  
  // Centrar mapa en ubicación actual
  const centerMapOnCurrentLocation = () => {
    if (!userLocation) return;
    centerMapOnLocation(userLocation.latitude, userLocation.longitude, LATITUDE_DELTA, LONGITUDE_DELTA);
  };

  return (
    <MapPresenter
      isLoading={isLoading}
      filteredEvents={filteredEvents}
      selectedCategory={selectedCategory}
      region={region}
      mapRef={mapRef}
      onRegionChange={setRegion}
      onEventPress={navigateToEventDetails}
      onCategorySelect={filterEventsByCategory}
      getCategoryColor={getCategoryColor}
      onCenterLocation={centerMapOnCurrentLocation}
      onFitToMarkers={() => fitMapToMarkers(filteredEvents, userLocation, LATITUDE_DELTA, LONGITUDE_DELTA)}
      onRefresh={loadEvents}
    />
  );
} 