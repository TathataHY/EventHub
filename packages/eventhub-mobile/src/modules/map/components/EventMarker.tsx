import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { Event } from '../hooks/useMapEvents';

interface EventMarkerProps {
  event: Event;
  getCategoryColor: (category: string) => string;
  onEventPress: (eventId: string) => void;
}

// Definir los iconos disponibles para categorías como type
type CategoryIcon = 'musical-notes' | 'football' | 'hardware-chip' | 
  'color-palette' | 'restaurant' | 'film' | 'glasses' | 'people' | 'calendar';

export function EventMarker({ event, getCategoryColor, onEventPress }: EventMarkerProps) {
  const { theme } = useTheme();
  const markerColor = getCategoryColor(event.category);

  return (
    <Marker
      coordinate={{
        latitude: event.latitude,
        longitude: event.longitude,
      }}
      onCalloutPress={() => onEventPress(event.id)}
    >
      <View style={styles.markerContainer}>
        <View style={[styles.marker, { backgroundColor: markerColor }]}>
          <Ionicons 
            name={getIconForCategory(event.category)} 
            size={16} 
            color="#FFF" 
          />
        </View>
      </View>
      
      <Callout tooltip onPress={() => onEventPress(event.id)}>
        <View style={[styles.callout, { backgroundColor: theme.colors.background.default }]}>
          <Text style={[styles.calloutTitle, { color: theme.colors.text.primary }]}>
            {event.title}
          </Text>
          
          <Text style={[styles.calloutInfo, { color: theme.colors.text.secondary }]}>
            {formatDate(event.date)}
          </Text>
          
          <View style={styles.categoryContainer}>
            <View 
              style={[
                styles.categoryBadge, 
                { backgroundColor: markerColor + '20' }
              ]}
            >
              <Text style={[styles.categoryText, { color: markerColor }]}>
                {event.category}
              </Text>
            </View>
          </View>
          
          <Text style={[styles.calloutAction, { color: theme.colors.primary.main }]}>
            Toca para ver detalles
          </Text>
        </View>
      </Callout>
    </Marker>
  );
}

// Función para obtener el icono basado en la categoría
function getIconForCategory(category: string): CategoryIcon {
  switch (category) {
    case 'Música':
      return 'musical-notes';
    case 'Deportes':
      return 'football';
    case 'Tecnología':
      return 'hardware-chip';
    case 'Arte':
      return 'color-palette';
    case 'Gastronomía':
      return 'restaurant';
    case 'Cine':
      return 'film';
    case 'Teatro':
      return 'glasses';
    case 'Conferencia':
      return 'people';
    default:
      return 'calendar';
  }
}

// Formatear fecha para mostrar
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  callout: {
    width: 200,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  calloutInfo: {
    fontSize: 14,
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  calloutAction: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'right',
    marginTop: 4,
  },
}); 