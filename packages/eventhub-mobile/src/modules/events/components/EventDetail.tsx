import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Share,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Event, EventTicketInfo, EventLocation, EventStatus } from '@modules/events/types';
import { useTheme } from '../../../shared/hooks/useTheme';

interface EventDetailProps {
  event: Event;
  isLoading?: boolean;
  isAttending?: boolean;
  onAttendPress?: () => void;
  onSharePress?: () => void;
  onOrganizerPress?: () => void;
}

export const EventDetail: React.FC<EventDetailProps> = ({
  event,
  isLoading = false,
  isAttending = false,
  onAttendPress,
  onSharePress,
  onOrganizerPress
}) => {
  const { theme } = useTheme();
  
  // Manejar compartir evento
  const handleShare = async () => {
    try {
      if (onSharePress) {
        onSharePress();
      }
      
      await Share.share({
        title: event.title,
        message: `¡Mira este evento: ${event.title}! ${event.shortDescription || event.description.substring(0, 100)}...`
      });
    } catch (error) {
      console.error('Error compartiendo evento:', error);
    }
  };

  // Obtener ubicación formateada
  const getFormattedLocation = () => {
    if (typeof event.location === 'string') {
      return event.location;
    } else if (event.location) {
      const loc = event.location as EventLocation;
      return [
        loc.address,
        loc.city,
        loc.state,
        loc.country
      ].filter(Boolean).join(', ');
    }
    return 'Ubicación no disponible';
  };

  // Formatear fecha y hora
  const getFormattedDateTime = () => {
    try {
      const startDate = new Date(event.startDate);
      const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      } as Intl.DateTimeFormatOptions;
      
      let dateTimeString = startDate.toLocaleDateString('es-ES', options);
      
      if (event.startTime) {
        dateTimeString += ` a las ${event.startTime}`;
      }
      
      if (event.endDate) {
        const endDate = new Date(event.endDate);
        if (endDate.getDate() !== startDate.getDate()) {
          dateTimeString += ` hasta el ${endDate.toLocaleDateString('es-ES', options)}`;
        }
      }
      
      return dateTimeString;
    } catch (error) {
      return event.startDate;
    }
  };

  // Obtener información de precio formateada
  const getFormattedPrice = () => {
    const ticketInfo = event.ticketInfo as EventTicketInfo;
    
    if (!ticketInfo) {
      return 'Precio no disponible';
    }
    
    if (ticketInfo.isFree) {
      return 'Entrada gratuita';
    }
    
    if (ticketInfo.price) {
      return `${ticketInfo.price} ${ticketInfo.currency || 'EUR'}`;
    }
    
    return 'Precio no disponible';
  };

  // Verificar si el evento está activo (no cancelado ni completado)
  const isEventActive = () => {
    if (!event.status) return true;
    return event.status !== EventStatus.CANCELLED && 
           event.status !== EventStatus.COMPLETED;
  };

  // Verificar si el evento está lleno
  const isEventFull = () => {
    if (!event.metrics?.maxCapacity) return false;
    return (event.metrics.attendees >= event.metrics.maxCapacity);
  };

  // Renderizar el badge de estado del evento
  const renderStatusBadge = () => {
    if (!event.status) return null;
    
    let badgeColor = theme.colors.success.main;
    let badgeText = 'Publicado';
    
    switch (event.status) {
      case EventStatus.DRAFT:
        badgeColor = theme.colors.warning.main;
        badgeText = 'Borrador';
        break;
      case EventStatus.CANCELLED:
        badgeColor = theme.colors.error.main;
        badgeText = 'Cancelado';
        break;
      case EventStatus.COMPLETED:
        badgeColor = theme.colors.text.disabled;
        badgeText = 'Finalizado';
        break;
      case EventStatus.POSTPONED:
        badgeColor = theme.colors.warning.main;
        badgeText = 'Pospuesto';
        break;
    }
    
    return (
      <View style={[styles.statusBadge, { backgroundColor: badgeColor }]}>
        <Text style={styles.statusText}>{badgeText}</Text>
      </View>
    );
  };

  // Si está cargando, mostrar indicador
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.default }]}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>Cargando evento...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      {/* Imagen del evento */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.imageUrl || 'https://via.placeholder.com/400x200?text=Evento' }}
          style={styles.image}
          resizeMode="cover"
        />
        {renderStatusBadge()}
      </View>
      
      {/* Encabezado del evento */}
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>{event.title}</Text>
        <Text style={[styles.date, { color: theme.colors.text.secondary }]}>{getFormattedDateTime()}</Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color={theme.colors.primary.main} />
          <Text style={[styles.location, { color: theme.colors.text.secondary }]}>{getFormattedLocation()}</Text>
        </View>
        
        <Text style={[styles.price, { color: theme.colors.text.primary }]}>{getFormattedPrice()}</Text>
      </View>
      
      {/* Acciones */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[
            styles.attendButton, 
            { backgroundColor: theme.colors.primary.main },
            isAttending ? { backgroundColor: theme.colors.success.main } : null,
            !isEventActive() || isEventFull() ? { backgroundColor: theme.colors.text.disabled } : null
          ]}
          onPress={onAttendPress}
          disabled={!isEventActive() || isEventFull()}
        >
          <Ionicons 
            name={isAttending ? 'checkmark-circle' : 'calendar'} 
            size={20} 
            color="white" 
          />
          <Text style={styles.buttonText}>
            {isAttending ? 'Asistiendo' : 'Asistir'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.shareButton, { backgroundColor: theme.colors.secondary.main }]}
          onPress={handleShare}
        >
          <Ionicons name="share-social" size={20} color="white" />
          <Text style={styles.buttonText}>Compartir</Text>
        </TouchableOpacity>
      </View>
      
      {/* Descripción */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Descripción</Text>
        <Text style={[styles.description, { color: theme.colors.text.secondary }]}>{event.description}</Text>
      </View>
      
      {/* Organizador */}
      <TouchableOpacity 
        style={[styles.organizerContainer, { backgroundColor: theme.colors.background.card }]}
        onPress={onOrganizerPress}
      >
        <View style={styles.organizerImageContainer}>
          {event.organizerLogo ? (
            <Image 
              source={{ uri: event.organizerLogo }} 
              style={styles.organizerImage} 
            />
          ) : (
            <View style={[styles.organizerImagePlaceholder, { backgroundColor: theme.colors.background.paper }]}>
              <Ionicons name="person" size={24} color={theme.colors.text.secondary} />
            </View>
          )}
        </View>
        
        <View style={styles.organizerInfo}>
          <Text style={[styles.organizerLabel, { color: theme.colors.text.secondary }]}>Organizado por</Text>
          <Text style={[styles.organizerName, { color: theme.colors.text.primary }]}>{event.organizerName}</Text>
        </View>
        
        <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
      </TouchableOpacity>
      
      {/* Detalles adicionales */}
      {event.websiteUrl && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Sitio web</Text>
          <TouchableOpacity onPress={() => Linking.openURL(event.websiteUrl!)}>
            <Text style={[styles.link, { color: theme.colors.primary.main }]}>{event.websiteUrl}</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* Etiquetas */}
      {event.tags && event.tags.length > 0 && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>Etiquetas</Text>
          <View style={styles.tagsContainer}>
            {event.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: theme.colors.primary.light }]}>
                <Text style={[styles.tagText, { color: theme.colors.primary.main }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {/* Métricas */}
      {event.metrics && (
        <View style={[styles.metricsContainer, { backgroundColor: theme.colors.background.card }]}>
          <View style={styles.metricItem}>
            <Ionicons name="eye-outline" size={20} color={theme.colors.primary.main} />
            <Text style={[styles.metricValue, { color: theme.colors.text.primary }]}>{event.metrics.views}</Text>
            <Text style={[styles.metricLabel, { color: theme.colors.text.secondary }]}>Vistas</Text>
          </View>
          
          <View style={styles.metricItem}>
            <Ionicons name="people-outline" size={20} color={theme.colors.primary.main} />
            <Text style={[styles.metricValue, { color: theme.colors.text.primary }]}>
              {event.metrics.attendees} {event.metrics.maxCapacity ? `/ ${event.metrics.maxCapacity}` : ''}
            </Text>
            <Text style={[styles.metricLabel, { color: theme.colors.text.secondary }]}>Asistentes</Text>
          </View>
          
          {event.metrics.shares > 0 && (
            <View style={styles.metricItem}>
              <Ionicons name="share-social-outline" size={20} color={theme.colors.primary.main} />
              <Text style={[styles.metricValue, { color: theme.colors.text.primary }]}>{event.metrics.shares}</Text>
              <Text style={[styles.metricLabel, { color: theme.colors.text.secondary }]}>Compartidos</Text>
            </View>
          )}
          
          {event.metrics.favorites > 0 && (
            <View style={styles.metricItem}>
              <Ionicons name="heart-outline" size={20} color={theme.colors.primary.main} />
              <Text style={[styles.metricValue, { color: theme.colors.text.primary }]}>{event.metrics.favorites}</Text>
              <Text style={[styles.metricLabel, { color: theme.colors.text.secondary }]}>Favoritos</Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    marginLeft: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 0,
  },
  attendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  attendingButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    opacity: 0.6,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionContainer: {
    padding: 16,
    paddingTop: 0,
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
  },
  organizerImageContainer: {
    marginRight: 12,
  },
  organizerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  organizerImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  organizerInfo: {
    flex: 1,
  },
  organizerLabel: {
    fontSize: 12,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  link: {
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 24,
    borderRadius: 8,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  metricLabel: {
    fontSize: 12,
  },
}); 