import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event, EventStatus } from '../types';
import { colors } from '@theme';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { EventCategory, EventType } from '../types/event.types';
import { formatDate, formatLocation } from '../../../utils/formatters';

interface EventCardProps {
  event: Event;
  onPress?: () => void;
  compact?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  compact = false
}) => {
  // Formatear fecha de forma breve
  const getFormattedDate = () => {
    try {
      const date = new Date(event.startDate);
      const options = { 
        day: 'numeric',
        month: 'short'
      } as Intl.DateTimeFormatOptions;
      
      return date.toLocaleDateString('es-ES', options);
    } catch (error) {
      return event.startDate?.toString() || 'Fecha no disponible';
    }
  };
  
  // Devolver la ubicación formateada
  const getFormattedLocation = () => {
    if (typeof event.location === 'string') {
      return event.location;
    } else if (event.location) {
      const loc = event.location as any;
      return loc.city ? loc.city : (loc.address || 'Ubicación no disponible');
    }
    return 'Ubicación no disponible';
  };
  
  // Verificar si el evento está cancelado
  const isCancelled = () => {
    return event.status === EventStatus.CANCELLED;
  };
  
  // Renderizar la etiqueta de estado
  const renderStatusBadge = () => {
    if (!event.status || event.status === EventStatus.PUBLISHED) return null;
    
    let badgeColor = colors.warning;
    let badgeText = 'Borrador';
    
    switch (event.status) {
      case EventStatus.CANCELLED:
        badgeColor = colors.danger;
        badgeText = 'Cancelado';
        break;
      case EventStatus.COMPLETED:
        badgeColor = colors.gray;
        badgeText = 'Finalizado';
        break;
      case EventStatus.POSTPONED:
        badgeColor = colors.warning;
        badgeText = 'Pospuesto';
        break;
    }
    
    return (
      <View style={[styles.badge, { backgroundColor: badgeColor }]}>
        <Text style={styles.badgeText}>{badgeText}</Text>
      </View>
    );
  };
  
  // Renderizar indicador de gratuito o precio
  const renderPriceIndicator = () => {
    const ticketInfo = event.ticketInfo as any;
    
    if (!ticketInfo) return null;
    
    if (ticketInfo.isFree) {
      return (
        <View style={styles.freeTag}>
          <Text style={styles.freeTagText}>Gratis</Text>
        </View>
      );
    }
    
    if (ticketInfo.price) {
      return (
        <View style={styles.priceTag}>
          <Text style={styles.priceTagText}>
            {`${ticketInfo.price} ${ticketInfo.currency || 'EUR'}`}
          </Text>
        </View>
      );
    }
    
    return null;
  };
  
  const getEventIcon = (category: string) => {
    switch (category) {
      case EventCategory.MUSIC:
        return 'music';
      case EventCategory.SPORTS:
        return 'dribbble';
      case EventCategory.TECHNOLOGY:
        return 'laptop';
      case EventCategory.ARTS:
        return 'paint-brush';
      case EventCategory.FOOD:
        return 'cutlery';
      case EventCategory.EDUCATION:
        return 'graduation-cap';
      case EventCategory.BUSINESS:
        return 'briefcase';
      case EventCategory.HEALTH:
        return 'heartbeat';
      default:
        return 'calendar';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case EventType.IN_PERSON:
        return 'Presencial';
      case EventType.ONLINE:
        return 'Online';
      case EventType.HYBRID:
        return 'Híbrido';
      default:
        return 'Evento';
    }
  };

  const isOnlineEvent = event.type === EventType.ONLINE || event.type === EventType.HYBRID;
  
  // Si es versión compacta, mostrar en formato más pequeño
  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={onPress}
        disabled={isCancelled()}
      >
        <View style={styles.compactImageContainer}>
          <Image
            source={{ uri: event.imageUrl || 'https://via.placeholder.com/100?text=Evento' }}
            style={styles.compactImage}
            resizeMode="cover"
          />
          {renderStatusBadge()}
        </View>
        
        <View style={styles.compactContent}>
          <Text 
            style={[styles.compactTitle, isCancelled() && styles.cancelledText]} 
            numberOfLines={1}
          >
            {event.title}
          </Text>
          
          <View style={styles.compactInfo}>
            <Ionicons name="calendar" size={12} color={colors.primary} />
            <Text style={styles.compactInfoText}>{getFormattedDate()}</Text>
          </View>
          
          <View style={styles.compactInfo}>
            <Ionicons name="location" size={12} color={colors.primary} />
            <Text 
              style={styles.compactInfoText} 
              numberOfLines={1}
            >
              {getFormattedLocation()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  
  // Versión normal (completa)
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={isCancelled()}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.imageUrl || 'https://via.placeholder.com/400x200?text=Evento' }}
          style={styles.image}
          resizeMode="cover"
        />
        {renderStatusBadge()}
        {renderPriceIndicator()}
      </View>
      
      <View style={styles.content}>
        <Text 
          style={[styles.title, isCancelled() && styles.cancelledText]} 
          numberOfLines={2}
        >
          {event.title}
        </Text>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={14} color={colors.primary} />
            <Text style={styles.infoText}>{getFormattedDate()}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="location" size={14} color={colors.primary} />
            <Text style={styles.infoText} numberOfLines={1}>
              {getFormattedLocation()}
            </Text>
          </View>
        </View>
        
        {event.organizerName && (
          <View style={styles.organizerContainer}>
            <Text style={styles.organizerText} numberOfLines={1}>
              Por: {event.organizerName}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // Estilos versión normal
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  freeTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: colors.success,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  freeTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  priceTag: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  priceTagText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  cancelledText: {
    textDecorationLine: 'line-through',
    color: colors.textLight,
  },
  infoContainer: {
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: colors.textDark,
    marginLeft: 8,
  },
  organizerContainer: {
    marginTop: 4,
  },
  organizerText: {
    fontSize: 14,
    color: colors.textLight,
  },
  
  // Estilos versión compacta
  compactContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    height: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  compactImageContainer: {
    position: 'relative',
    width: 80,
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  compactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  compactInfoText: {
    fontSize: 12,
    color: colors.textDark,
    marginLeft: 4,
  },
}); 