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
import { Event, EventTicketInfo, EventLocation, EventStatus } from '../types';
import { colors } from '@theme';

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
    
    let badgeColor = colors.success;
    let badgeText = 'Publicado';
    
    switch (event.status) {
      case EventStatus.DRAFT:
        badgeColor = colors.warning;
        badgeText = 'Borrador';
        break;
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
      <View style={[styles.statusBadge, { backgroundColor: badgeColor }]}>
        <Text style={styles.statusText}>{badgeText}</Text>
      </View>
    );
  };

  // Si está cargando, mostrar indicador
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando evento...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
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
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.date}>{getFormattedDateTime()}</Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <Text style={styles.location}>{getFormattedLocation()}</Text>
        </View>
        
        <Text style={styles.price}>{getFormattedPrice()}</Text>
      </View>
      
      {/* Acciones */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={[
            styles.attendButton, 
            isAttending ? styles.attendingButton : null,
            !isEventActive() || isEventFull() ? styles.disabledButton : null
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
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Ionicons name="share-social" size={20} color="white" />
          <Text style={styles.buttonText}>Compartir</Text>
        </TouchableOpacity>
      </View>
      
      {/* Descripción */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{event.description}</Text>
      </View>
      
      {/* Organizador */}
      <TouchableOpacity 
        style={styles.organizerContainer}
        onPress={onOrganizerPress}
      >
        <View style={styles.organizerImageContainer}>
          {event.organizerLogo ? (
            <Image 
              source={{ uri: event.organizerLogo }} 
              style={styles.organizerImage} 
            />
          ) : (
            <View style={styles.organizerImagePlaceholder}>
              <Ionicons name="person" size={24} color={colors.textLight} />
            </View>
          )}
        </View>
        
        <View style={styles.organizerInfo}>
          <Text style={styles.organizerTitle}>Organizado por:</Text>
          <Text style={styles.organizerName}>{event.organizerName}</Text>
        </View>
        
        <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
      </TouchableOpacity>
      
      {/* Sitio web y enlaces */}
      {event.websiteUrl && (
        <TouchableOpacity 
          style={styles.linkContainer}
          onPress={() => Linking.openURL(event.websiteUrl || '')}
        >
          <Ionicons name="globe" size={20} color={colors.primary} />
          <Text style={styles.linkText}>Visitar sitio web</Text>
        </TouchableOpacity>
      )}
      
      {/* Etiquetas */}
      {event.tags && event.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          <Text style={styles.sectionTitle}>Etiquetas:</Text>
          <View style={styles.tagsList}>
            {event.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {/* Espacio al final */}
      <View style={styles.footer} />
    </ScrollView>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    color: colors.textDark,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
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
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: colors.textDark,
    marginLeft: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  attendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  attendingButton: {
    backgroundColor: colors.success,
  },
  disabledButton: {
    backgroundColor: colors.gray,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  sectionContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: colors.textDark,
    lineHeight: 24,
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginTop: 8,
  },
  organizerImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 16,
  },
  organizerImage: {
    width: '100%',
    height: '100%',
  },
  organizerImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  organizerInfo: {
    flex: 1,
  },
  organizerTitle: {
    fontSize: 14,
    color: colors.textLight,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    marginTop: 8,
  },
  linkText: {
    fontSize: 16,
    color: colors.primary,
    marginLeft: 8,
  },
  tagsContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginTop: 8,
  },
  tagsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: colors.textDark,
  },
  footer: {
    height: 32,
  },
}); 