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
import { useTheme, getColorValue, getIconColor } from '../../../core/theme';

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
        message: `¡Mira este evento: ${event.title}! ${event.description.substring(0, 100)}...`
      });
    } catch (error) {
      console.error('Error compartiendo evento:', error);
    }
  };

  // Obtener ubicación formateada
  const getFormattedLocation = (): string => {
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
  const getFormattedDateTime = (): string => {
    try {
      const startDate = new Date(event.startDate);
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      
      let dateTimeString = startDate.toLocaleDateString('es-ES', options);
      
      return dateTimeString;
    } catch (error) {
      return event.startDate;
    }
  };

  // Obtener información de precio formateada
  const getFormattedPrice = (): string => {
    // @ts-ignore - ticketInfo puede no existir en Event pero lo manejamos adecuadamente
    const ticketInfo = event.ticketInfo;
    
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
  const isEventActive = (): boolean => {
    if (!event.status) return true;
    return event.status !== 'cancelled' && 
           event.status !== 'completed';
  };

  // Verificar si el evento está lleno
  const isEventFull = (): boolean => {
    // @ts-ignore - metrics puede no existir en Event pero lo manejamos adecuadamente
    if (!event.metrics?.maxCapacity) return false;
    // @ts-ignore
    return (event.metrics.registeredAttendees >= event.metrics.maxCapacity);
  };

  // Renderizar el badge de estado del evento
  const renderStatusBadge = () => {
    if (!event.status) return null;
    
    let badgeColor = getColorValue(theme.colors.success);
    let badgeText = 'Publicado';
    
    switch (event.status) {
      case 'draft':
        badgeColor = getColorValue(theme.colors.warning);
        badgeText = 'Borrador';
        break;
      case 'cancelled':
        badgeColor = getColorValue(theme.colors.error);
        badgeText = 'Cancelado';
        break;
      case 'completed':
        badgeColor = getColorValue(theme.colors.text.secondary);
        badgeText = 'Finalizado';
        break;
      case 'postponed':
        badgeColor = getColorValue(theme.colors.warning);
        badgeText = 'Pospuesto';
        break;
    }
    
    return (
      <View style={[styles.statusBadge, { backgroundColor: `${String(badgeColor)}20` }]}>
        <Text style={[styles.statusText, { color: badgeColor }]}>
          {badgeText}
        </Text>
      </View>
    );
  };
  
  // Abrir mapa
  const openMap = () => {
    let location: string;
    
    if (typeof event.location === 'string') {
      location = event.location;
    } else if (event.location) {
      const loc = event.location as EventLocation;
      location = [loc.address, loc.city, loc.state, loc.country].filter(Boolean).join(', ');
    } else {
      return; // No location to open
    }
    
    const url = `https://maps.google.com/?q=${encodeURIComponent(location)}`;
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        }
      })
      .catch(error => console.error('Error abriendo mapa:', error));
  };
  
  // Abrir sitio web del evento
  const openWebsite = () => {
    if (!event.websiteUrl) return;
    
    Linking.canOpenURL(event.websiteUrl)
      .then(supported => {
        if (supported) {
          return Linking.openURL(event.websiteUrl!);
        }
      })
      .catch(error => console.error('Error abriendo sitio web:', error));
  };
  
  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: getColorValue(theme.colors.background) }]}>
        <ActivityIndicator size="large" color={getColorValue(theme.colors.primary)} />
        <Text style={[styles.loadingText, { color: getColorValue(theme.colors.text.secondary) }]}>
          Cargando detalles del evento...
        </Text>
      </View>
    );
  }
  
  const imageSource = event.imageUrl || event.image;

  return (
    <ScrollView style={[styles.container, { backgroundColor: getColorValue(theme.colors.background) }]}>
      {/* Cabecera con imagen */}
      <View style={styles.headerContainer}>
        {imageSource ? (
          <Image 
            source={{ uri: imageSource }} 
            style={styles.headerImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.imagePlaceholder, { backgroundColor: `${String(getColorValue(theme.colors.primary))}20` }]}>
            <Ionicons name="calendar" size={64} color={getIconColor(theme.colors.primary)} />
          </View>
        )}
        
        {/* Badge de estado */}
        {renderStatusBadge()}
      </View>
      
      {/* Contenido principal */}
      <View style={styles.contentContainer}>
        {/* Título y organizador */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: getColorValue(theme.colors.text.primary) }]}>
            {event.title}
          </Text>
          
          {event.organizer && (
            <TouchableOpacity 
              style={styles.organizerContainer}
              onPress={onOrganizerPress}
            >
              <Text style={[styles.organizerLabel, { color: getColorValue(theme.colors.text.secondary) }]}>
                Organizado por
              </Text>
              <Text style={[styles.organizerName, { color: getColorValue(theme.colors.primary) }]}>
                {event.organizer.name}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Información principal */}
        <View style={styles.infoContainer}>
          {/* Fecha y hora */}
          <View style={styles.infoItem}>
            <Ionicons 
              name="calendar-outline" 
              size={22} 
              color={getIconColor(theme.colors.primary)} 
              style={styles.infoIcon} 
            />
            <Text style={[styles.infoText, { color: getColorValue(theme.colors.text.primary) }]}>
              {getFormattedDateTime()}
            </Text>
          </View>
          
          {/* Ubicación */}
          <TouchableOpacity style={styles.infoItem} onPress={openMap}>
            <Ionicons 
              name="location-outline" 
              size={22} 
              color={getIconColor(theme.colors.primary)} 
              style={styles.infoIcon} 
            />
            <Text style={[styles.infoText, { color: getColorValue(theme.colors.text.primary) }]}>
              {getFormattedLocation()}
            </Text>
          </TouchableOpacity>
          
          {/* Precio */}
          <View style={styles.infoItem}>
            <Ionicons 
              name="pricetag-outline" 
              size={22} 
              color={getIconColor(theme.colors.primary)} 
              style={styles.infoIcon} 
            />
            <Text style={[styles.infoText, { color: getColorValue(theme.colors.text.primary) }]}>
              {getFormattedPrice()}
            </Text>
          </View>
          
          {/* Sitio web (si está disponible) */}
          {event.websiteUrl && (
            <TouchableOpacity style={styles.infoItem} onPress={openWebsite}>
              <Ionicons 
                name="globe-outline" 
                size={22} 
                color={getIconColor(theme.colors.primary)} 
                style={styles.infoIcon} 
              />
              <Text style={[styles.infoText, { color: getColorValue(theme.colors.primary) }]}>
                Visitar sitio web
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Descripción */}
        <View style={styles.descriptionContainer}>
          <Text style={[styles.sectionTitle, { color: getColorValue(theme.colors.text.primary) }]}>
            Descripción
          </Text>
          <Text style={[styles.description, { color: getColorValue(theme.colors.text.secondary) }]}>
            {event.description}
          </Text>
        </View>
        
        {/* Acciones */}
        <View style={styles.actionsContainer}>
          {isEventActive() && !isEventFull() && (
            <TouchableOpacity
              style={[
                styles.attendButton,
                { 
                  backgroundColor: isAttending 
                    ? `${String(getColorValue(theme.colors.success))}20` 
                    : getColorValue(theme.colors.primary) 
                }
              ]}
              onPress={onAttendPress}
              disabled={isAttending}
            >
              <Ionicons 
                name={isAttending ? "checkmark-circle" : "add-circle-outline"} 
                size={20} 
                color={isAttending ? getIconColor(theme.colors.success) : "#fff"} 
                style={styles.actionIcon} 
              />
              <Text 
                style={[
                  styles.attendButtonText, 
                  { color: isAttending ? getColorValue(theme.colors.success) : "#fff" }
                ]}
              >
                {isAttending ? "Asistiré" : "Asistir"}
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.shareButton, { backgroundColor: `${String(getColorValue(theme.colors.secondary))}20` }]}
            onPress={handleShare}
          >
            <Ionicons 
              name="share-social-outline" 
              size={20} 
              color={getIconColor(theme.colors.secondary)} 
              style={styles.actionIcon} 
            />
            <Text style={[styles.shareButtonText, { color: getColorValue(theme.colors.secondary) }]}>
              Compartir
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  headerContainer: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  organizerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  organizerLabel: {
    fontSize: 12,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 16,
  },
  descriptionContainer: {
    marginBottom: 16,
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
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
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
  attendButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
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
  shareButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  actionIcon: {
    marginRight: 8,
  },
}); 