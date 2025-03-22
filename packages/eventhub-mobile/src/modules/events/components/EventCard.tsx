import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StyleProp,
  ViewStyle
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Event, EventStatus } from '@modules/events/types';
import { useTheme } from '@core/context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@shared/components/ui/Card';

// Constantes para tipos de eventos
const EVENT_TYPES = {
  IN_PERSON: 'presencial',
  ONLINE: 'online',
  HYBRID: 'hybrid'
};

interface EventCardProps {
  event: Event;
  style?: StyleProp<ViewStyle>;
  onPress?: (event: Event) => void;
}

/**
 * Componente para mostrar la información resumida de un evento en una tarjeta
 */
export const EventCard = ({ event, style, onPress }: EventCardProps) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  // Función para navegar a la pantalla de detalles del evento
  const handlePress = () => {
    if (onPress) {
      onPress(event);
    } else {
      // @ts-ignore - Ignorar error de tipado en navegación
      navigation.navigate('EventDetail', { eventId: event.id });
    }
  };
  
  // Función para formatear la fecha
  const getFormattedDate = () => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    };
    
    if (event.startDate === event.endDate) {
      return formatDate(event.startDate);
    } else {
      return `${formatDate(event.startDate)} - ${formatDate(event.endDate)}`;
    }
  };
  
  // Función para formatear la ubicación
  const getFormattedLocation = () => {
    if (event.type === EVENT_TYPES.ONLINE) {
      return 'Evento virtual';
    } else if (event.location) {
      return typeof event.location === 'string' 
        ? event.location 
        : (event.location.name || 'Ubicación no disponible');
    } else {
      return 'Ubicación no disponible';
    }
  };
  
  // Verificar si el evento está cancelado
  const isCancelled = () => {
    return event.status === EventStatus.CANCELLED;
  };
  
  // Renderizar badge de estado
  const renderStatusBadge = () => {
    if (isCancelled()) {
      return (
        <View style={styles.cancellationBadge}>
          <Text style={styles.cancellationText}>Cancelado</Text>
        </View>
      );
    }
    
    if (event.featured) {
      return (
        <View style={[styles.featuredBadge, { backgroundColor: theme.colors.primary.main }]}>
          <FontAwesome name="star" size={12} color="#FFF" />
          <Text style={styles.featuredText}>Destacado</Text>
        </View>
      );
    }
    
    const now = new Date();
    const eventDate = new Date(event.startDate);
    const daysUntilEvent = Math.ceil((eventDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilEvent <= 3 && daysUntilEvent > 0) {
      return (
        <View style={[styles.soonBadge, { backgroundColor: theme.colors.warning.main }]}>
          <Text style={styles.soonText}>Próximamente</Text>
        </View>
      );
    }
    
    return null;
  };
  
  // Renderizar indicador de precio
  const renderPriceIndicator = () => {
    if (event.isFree) {
      return (
        <View style={[styles.priceTag, { backgroundColor: theme.colors.success.main }]}>
          <Text style={styles.priceText}>Gratis</Text>
        </View>
      );
    } else if (event.price && event.price > 0) {
      return (
        <View style={[styles.priceTag, { backgroundColor: theme.colors.primary.main }]}>
          <Text style={styles.priceText}>{event.price} €</Text>
        </View>
      );
    }
    
    return null;
  };
  
  return (
    <Card style={[styles.card, style, isCancelled() && styles.cancelledCard]}>
      <TouchableOpacity
        style={styles.container}
        onPress={handlePress}
        disabled={isCancelled()}
      >
        {/* Imagen del evento */}
        <View style={styles.imageContainer}>
          <Image
            source={
              event.imageUrl
                ? { uri: event.imageUrl }
                : require('@assets/images/event-placeholder.jpg')
            }
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Badges e indicadores */}
          <View style={styles.badgeContainer}>
            {renderStatusBadge()}
            {renderPriceIndicator()}
          </View>
          
          {/* Tipo de evento (online/presencial) */}
          <View style={[
            styles.typeIndicator,
            { backgroundColor: event.type === EVENT_TYPES.ONLINE ? 
              theme.colors.info.main : theme.colors.success.main }
          ]}>
            <Ionicons
              name={event.type === EVENT_TYPES.ONLINE ? 'globe-outline' : 'location-outline'}
              size={14}
              color="#FFF"
            />
            <Text style={styles.typeText}>
              {event.type === EVENT_TYPES.ONLINE ? 'Online' : 'Presencial'}
            </Text>
          </View>
        </View>
        
        {/* Detalles del evento */}
        <View style={styles.detailsContainer}>
          {/* Título */}
          <Text 
            style={[
              styles.title, 
              { color: theme.colors.text.primary },
              isCancelled() && styles.cancelledText
            ]}
            numberOfLines={2}
          >
            {event.title}
          </Text>
          
          {/* Fecha */}
          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={theme.colors.text.secondary}
              style={styles.infoIcon}
            />
            <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
              {getFormattedDate()}
            </Text>
          </View>
          
          {/* Ubicación */}
          <View style={styles.infoRow}>
            <Ionicons
              name={event.type === EVENT_TYPES.ONLINE ? 'globe-outline' : 'location-outline'}
              size={14}
              color={theme.colors.text.secondary}
              style={styles.infoIcon}
            />
            <Text 
              style={[styles.infoText, { color: theme.colors.text.secondary }]}
              numberOfLines={1}
            >
              {getFormattedLocation()}
            </Text>
          </View>
          
          {/* Categoría */}
          {event.category && (
            <View style={styles.categoryContainer}>
              <Text style={[styles.category, { color: theme.colors.primary.main }]}>
                {typeof event.category === 'string' ? event.category : event.category.name}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Card>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24; // Para mostrar 2 por fila con margen

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    overflow: 'hidden',
    width: cardWidth,
    margin: 8,
  },
  container: {
    flexDirection: 'column',
  },
  cancelledCard: {
    opacity: 0.7,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 120,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'column',
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  featuredText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  soonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  soonText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  cancellationBadge: {
    backgroundColor: '#F44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 4,
  },
  cancellationText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  priceTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  priceText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  typeIndicator: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  typeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  detailsContainer: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cancelledText: {
    textDecorationLine: 'line-through',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    marginRight: 4,
  },
  infoText: {
    fontSize: 12,
  },
  categoryContainer: {
    marginTop: 8,
  },
  category: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 