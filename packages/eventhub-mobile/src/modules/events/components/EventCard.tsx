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
import { useTheme } from '../../../shared/hooks/useTheme';
import { Card } from '@shared/components/ui/Card';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Icon } from '../../../shared/components/ui/Icon';

// Constantes para tipos de eventos
const EVENT_TYPES = {
  IN_PERSON: 'presencial',
  ONLINE: 'online',
  HYBRID: 'hybrid'
};

// Tipo genérico para eventos de cualquier origen
export interface EventCardProps {
  event: {
    id: string | number;
    title: string;
    description?: string;
    imageUrl?: string;
    image?: string;
    location?: {
      name?: string;
      address?: string;
      city?: string;
    } | string;
    startDate?: string | Date;
    endDate?: string | Date;
    date?: string | Date;
    price?: number | string;
    category?: string;
    categories?: string[];
    attendeesCount?: number;
    organizerId?: string;
    organizer?: string | { id: string; name: string };
  };
  style?: ViewStyle;
  onPress?: (event: any) => void;
  showDetails?: boolean;
  compact?: boolean;
}

/**
 * Componente reutilizable para mostrar tarjetas de eventos
 */
export const EventCard = ({
  event,
  style,
  onPress,
  showDetails = true,
  compact = false
}: EventCardProps) => {
  const { theme, getColorValue } = useTheme();
  
  // Obtener imagen con fallback
  const getImageUrl = () => {
    if (event.imageUrl) return event.imageUrl;
    if (event.image) return event.image;
    return 'https://via.placeholder.com/300x150?text=EventHub';
  };
  
  // Obtener ubicación formateada
  const getLocation = () => {
    if (!event.location) return 'Ubicación no especificada';
    
    if (typeof event.location === 'string') {
      return event.location;
    }
    
    if (event.location.name) return event.location.name;
    if (event.location.city) return event.location.city;
    if (event.location.address) return event.location.address;
    
    return 'Ubicación no especificada';
  };
  
  // Obtener categoría principal
  const getCategory = () => {
    if (event.category) return event.category;
    
    if (event.categories && event.categories.length > 0) {
      return event.categories[0];
    }
    
    return null;
  };
  
  // Formatear fecha
  const getFormattedDate = () => {
    try {
      // Utilizar startDate o date si está disponible
      const startDate = event.startDate 
        ? new Date(event.startDate) 
        : event.date 
          ? new Date(event.date) 
          : null;
          
      if (!startDate) return 'Fecha no especificada';
      
      // Si hay endDate, comprobar si es el mismo día
      const endDate = event.endDate ? new Date(event.endDate) : startDate;
      
      // Si es el mismo día, mostrar solo fecha y horarios
      if (startDate.toDateString() === endDate.toDateString()) {
        return format(startDate, "d 'de' MMMM, yyyy", { locale: es });
      }
      
      // Si son días diferentes, mostrar ambas fechas
      return `${format(startDate, "d 'de' MMMM", { locale: es })} - ${format(endDate, "d 'de' MMMM, yyyy", { locale: es })}`;
    } catch (error) {
      return 'Fecha no disponible';
    }
  };
  
  const handlePress = () => {
    if (onPress) {
      onPress(event);
    }
  };
  
  // Diseño compacto
  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactContainer, style]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Image 
          source={{ uri: getImageUrl() }}
          style={styles.compactImage}
          resizeMode="cover"
        />
        <View style={styles.compactContent}>
          <Text 
            style={[styles.compactTitle, { color: getColorValue(theme.colors.text.primary) }]}
            numberOfLines={2}
          >
            {event.title}
          </Text>
          <Text 
            style={[styles.compactInfo, { color: getColorValue(theme.colors.text.secondary) }]}
            numberOfLines={1}
          >
            {getFormattedDate()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  // Diseño normal
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: getImageUrl() }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text 
          style={[styles.title, { color: getColorValue(theme.colors.text.primary) }]}
          numberOfLines={2}
        >
          {event.title}
        </Text>
        
        {showDetails && (
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Icon name="calendar-outline" size={16} color={getColorValue(theme.colors.text.secondary)} />
              <Text style={[styles.detailText, { color: getColorValue(theme.colors.text.secondary) }]}>
                {getFormattedDate()}
              </Text>
            </View>
            
            <View style={styles.detailRow}>
              <Icon name="location-outline" size={16} color={getColorValue(theme.colors.text.secondary)} />
              <Text 
                style={[styles.detailText, { color: getColorValue(theme.colors.text.secondary) }]}
                numberOfLines={1}
              >
                {getLocation()}
              </Text>
            </View>
            
            {getCategory() && (
              <View style={[
                styles.category, 
                { backgroundColor: getColorValue(theme.colors.primary.light) }
              ]}>
                <Text style={[
                  styles.categoryText, 
                  { color: getColorValue(theme.colors.primary.main) }
                ]}>
                  {getCategory()}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24; // Para mostrar 2 por fila con margen

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#e1e1e1',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  details: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  category: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  compactContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 12,
    height: 80,
  },
  compactImage: {
    width: 80,
    height: 80,
    backgroundColor: '#e1e1e1',
  },
  compactContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  compactTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  compactInfo: {
    fontSize: 12,
  },
}); 