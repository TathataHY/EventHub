import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../../shared/hooks/useTheme';
import { Divider } from '@shared/components/ui/Divider';
import { LoadingState } from '@shared/components/ui/LoadingState';
import { CategoryFilters, EventMarker } from '../../components';
import { Event } from '../../hooks/useMapEvents';

interface MapPresenterProps {
  isLoading: boolean;
  filteredEvents: Event[];
  selectedCategory: string | null;
  region: Region;
  mapRef: React.RefObject<MapView>;
  onRegionChange: (region: Region) => void;
  onEventPress: (eventId: string) => void;
  onCategorySelect: (category: string | null) => void;
  getCategoryColor: (category: string) => string;
  onCenterLocation: () => void;
  onFitToMarkers: () => void;
  onRefresh: () => void;
}

/**
 * Presentador para la pantalla de mapa
 * Se encarga únicamente de la representación visual
 */
export function MapPresenter({
  isLoading,
  filteredEvents,
  selectedCategory,
  region,
  mapRef,
  onRegionChange,
  onEventPress,
  onCategorySelect,
  getCategoryColor,
  onCenterLocation,
  onFitToMarkers,
  onRefresh
}: MapPresenterProps) {
  const { theme } = useTheme();
  
  // Renderizar contenido cargando
  if (isLoading && filteredEvents.length === 0) {
    return <LoadingState message="Cargando mapa..." />;
  }
  
  return (
    <View style={styles.container}>
      {/* Filtros por categoría */}
      <CategoryFilters
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
        getCategoryColor={getCategoryColor}
      />
      
      <Divider />
      
      {/* Mapa */}
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          region={region}
          onRegionChangeComplete={onRegionChange}
          showsUserLocation
          showsMyLocationButton={false}
        >
          {filteredEvents.map(event => (
            <EventMarker
              key={event.id}
              event={event}
              getCategoryColor={getCategoryColor}
              onEventPress={onEventPress}
            />
          ))}
        </MapView>
        
        {/* Botones de acción flotantes */}
        <View style={styles.fabContainer}>
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: '#FFFFFF' }]}
            onPress={onCenterLocation}
          >
            <Ionicons name="locate" size={24} color="#2196F3" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: '#FFFFFF' }]}
            onPress={onFitToMarkers}
          >
            <Ionicons name="expand" size={24} color="#2196F3" />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.fab, { backgroundColor: '#FFFFFF' }]}
            onPress={onRefresh}
          >
            <Ionicons name="refresh" size={24} color="#2196F3" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  fabContainer: {
    position: 'absolute',
    right: 16,
    bottom: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 160,
  },
  fab: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
}); 