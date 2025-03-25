import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StyleProp,
  ViewStyle,
  ColorValue
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';
import { getColorValue } from '@theme/theme.types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Event, EventLocation } from '../types';

const { width } = Dimensions.get('window');

// Versión ampliada de EventCardProps para dar soporte a múltiples fuentes
export interface EventCardProps {
  event: {
    id: string | number;
    title: string;
    description?: string;
    imageUrl?: string;
    image?: string;
    location?: string | EventLocation;
    startDate?: string | Date;
    endDate?: string | Date;
    date?: string | Date;
    price?: number | string;
    category?: string;
    categories?: string[];
    attendeesCount?: number;
    organizerId?: string | number;
    organizer?: string | { id: string | number; name: string };
  };
  style?: StyleProp<ViewStyle>;
  onPress?: (eventId: string) => void;
  showDetails?: boolean;
  compact?: boolean;
  showDistance?: boolean;
  distance?: number;
}

/**
 * Componente de tarjeta de evento reutilizable
 */
export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  style, 
  onPress, 
  showDetails = true, 
  compact = false,
  showDistance = false,
  distance
}) => {
  const { theme } = useTheme();
  
  // Handler para el evento de press con conversión de ID a string
  const handlePress = () => {
    if (onPress && event.id) {
      console.log('EventCard - handlePress - eventId:', String(event.id));
      onPress(String(event.id));
    } else {
      console.log('EventCard - handlePress - ERROR - no onPress handler or no eventId:', 
        { hasHandler: !!onPress, eventId: event.id });
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return format(date, "d MMM", { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };
  
  // Obtener imagen del evento
  const getEventImage = () => {
    const imageUrl = event.imageUrl || event.image;
    if (!imageUrl) {
      return require('@assets/images/placeholders/event.png');
    }
    return { uri: imageUrl };
  };
  
  // Obtener ubicación del evento
  const getLocation = () => {
    if (!event.location) return 'Ubicación no especificada';
    
    if (typeof event.location === 'string') {
      return event.location;
    }
    
    // Si es un objeto de ubicación
    const { name, city, state } = event.location;
    if (name) return name;
    return [city, state].filter(Boolean).join(', ') || 'Ubicación no especificada';
  };
  
  // Formatear precio
  const formatPrice = () => {
    if (event.price === 0 || event.price === '0' || event.price === 'free') {
      return 'Gratuito';
    }
    
    if (!event.price) {
      return 'Precio no disponible';
    }
    
    const price = typeof event.price === 'string' 
      ? parseFloat(event.price) 
      : event.price;
    
    if (isNaN(price)) {
      return event.price;
    }
    
    return `${price} €`;
  };
  
  // Obtener color de icono
  const getIconColor = (type: string): ColorValue => {
    switch (type) {
      case 'info':
        return getColorValue(theme.colors.info.main);
      case 'success':
        return getColorValue(theme.colors.success.main);
      case 'warning':
        return getColorValue(theme.colors.warning.main);
      default:
        return getColorValue(theme.colors.text.secondary);
    }
  };

  // Renderizar tarjeta de evento
  return (
    <TouchableOpacity
      style={[
        styles.container,
        compact ? styles.compactContainer : null,
        style
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={compact ? styles.compactContentLayout : styles.imageContainer}>
        <Image 
          source={getEventImage()} 
          style={compact ? styles.compactImage : styles.image}
          resizeMode="cover"
        />
        
        {!compact && event.category && (
          <View style={[
            styles.categoryLabel,
            { backgroundColor: getColorValue(theme.colors.primary.main) }
          ]}>
            <Text style={styles.categoryText}>{event.category}</Text>
          </View>
        )}

        {showDistance && distance !== undefined && (
          <View style={[
            styles.distanceLabel,
            { backgroundColor: getColorValue(theme.colors.info.main) }
          ]}>
            <Ionicons 
              name="location" 
              size={12} 
              color={getColorValue(theme.colors.common.white)}
              style={styles.distanceIcon}
            />
            <Text style={styles.distanceText}>
              {distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} km`}
            </Text>
          </View>
        )}
      </View>
      
      <View style={compact ? styles.compactInfoContainer : styles.infoContainer}>
        <Text 
          style={[
            styles.title, 
            compact ? { fontSize: 14, marginBottom: 2 } : null,
            { color: getColorValue(theme.colors.text.primary) }
          ]}
          numberOfLines={compact ? 1 : 2}
        >
          {event.title}
        </Text>
        
        {showDetails && (
          <>
            <View style={styles.dateLocationContainer}>
              <View style={styles.iconTextContainer}>
                <Ionicons 
                  name="calendar-outline" 
                  size={14} 
                  color={getIconColor('info')}
                  style={styles.icon}
                />
                <Text 
                  style={[
                    styles.subtitle,
                    { color: getColorValue(theme.colors.text.secondary) }
                  ]}
                  numberOfLines={1}
                >
                  {formatDate(event.startDate || event.date)}
                </Text>
              </View>
              
              <View style={styles.iconTextContainer}>
                <Ionicons 
                  name="location-outline" 
                  size={14} 
                  color={getIconColor('info')}
                  style={styles.icon}
                />
                <Text 
                  style={[
                    styles.subtitle,
                    { color: getColorValue(theme.colors.text.secondary) }
                  ]}
                  numberOfLines={1}
                >
                  {getLocation()}
                </Text>
              </View>
              
              {event.price !== undefined && (
                <View style={styles.iconTextContainer}>
                  <Ionicons 
                    name="pricetag-outline" 
                    size={14} 
                    color={getIconColor('info')}
                    style={styles.icon}
                  />
                  <Text 
                    style={[
                      styles.subtitle,
                      { color: getColorValue(theme.colors.text.secondary) }
                    ]}
                  >
                    {formatPrice()}
                  </Text>
                </View>
              )}
              
              {event.attendeesCount !== undefined && (
                <View style={styles.iconTextContainer}>
                  <Ionicons 
                    name="people-outline" 
                    size={14} 
                    color={getIconColor('info')}
                    style={styles.icon}
                  />
                  <Text 
                    style={[
                      styles.subtitle,
                      { color: getColorValue(theme.colors.text.secondary) }
                    ]}
                  >
                    {event.attendeesCount} asistentes
                  </Text>
                </View>
              )}
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    overflow: 'hidden',
  },
  compactContainer: {
    flexDirection: 'row',
    height: 100,
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 160,
  },
  compactImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  infoContainer: {
    padding: 16,
  },
  compactInfoContainer: {
    flex: 1,
    padding: 12,
    paddingLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  categoryLabel: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 4,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  distanceLabel: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 4,
    borderRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceIcon: {
    marginRight: 4,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
  },
  dateLocationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
}); 