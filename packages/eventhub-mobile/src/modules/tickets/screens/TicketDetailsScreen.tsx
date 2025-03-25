import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Share,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { useTheme } from '@core/context/ThemeContext';
import { QRCode } from '@shared/components/scanner/QRCode';
import { Divider } from '@shared/components/ui';
import { ticketService } from '../services';
import { eventService } from '@modules/events/services/event.service';
import { Ticket, TicketEventData } from '../types';

const QR_SIZE = 200;

/**
 * Pantalla para visualizar los detalles de un ticket
 */
export const TicketDetailsScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    loadTicket();
  }, [id]);
  
  const loadTicket = async () => {
    try {
      setLoading(true);
      
      if (!id) {
        setError('Identificador de ticket no válido');
        return;
      }
      
      // Cargar datos del ticket
      const ticketData = await ticketService.getTicketById(id);
      
      if (!ticketData) {
        setError('El ticket no existe o no tienes permisos para verlo');
        return;
      }
      
      // Si es necesario, cargar datos adicionales del evento
      if (ticketData.eventId && (!ticketData.event || Object.keys(ticketData.event).length === 0)) {
        try {
          const eventData = await eventService.getEventById(ticketData.eventId);
          if (eventData) {
            // Actualizar datos del evento en el ticket
            ticketData.event = {
              id: eventData.id,
              title: eventData.title,
              description: eventData.description || 'Sin descripción',
              startDate: eventData.startDate,
              endDate: eventData.endDate,
              location: typeof eventData.location === 'string' 
                ? eventData.location 
                : eventData.location?.name || '',
              image: eventData.imageUrl || eventData.image,
              organizer: {
                id: eventData.organizer?.id || 'unknown',
                name: eventData.organizer?.name || 'Organizador desconocido'
              }
            };
          }
        } catch (eventError) {
          console.error('Error al cargar datos del evento:', eventError);
          // No interrumpir el flujo si falla la carga del evento
        }
      }
      
      setTicket(ticketData);
      setError(null);
    } catch (err) {
      console.error('Error al cargar el ticket:', err);
      setError('No se pudo cargar la información del ticket');
    } finally {
      setLoading(false);
    }
  };
  
  const handleShareTicket = async () => {
    if (!ticket || !ticket.event) return;
    
    try {
      await Share.share({
        message: `Mi entrada para ${ticket.event.title} - ${
          format(new Date(ticket.event.startDate), "d 'de' MMMM 'a las' HH:mm", { locale: es })
        }. Ticket #${ticket.ticketNumber}`,
        title: `Ticket para ${ticket.event.title}`
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "EEEE d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };
  
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "HH:mm", { locale: es });
    } catch (error) {
      return '';
    }
  };
  
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };
  
  const openLocation = () => {
    if (!ticket || !ticket.event) return;
    
    const location = encodeURIComponent(ticket.event.location);
    const url = `https://maps.google.com/?q=${location}`;
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'No se puede abrir la ubicación');
        }
      })
      .catch(error => {
        console.error('Error al abrir ubicación:', error);
      });
  };
  
  const openEventDetails = () => {
    if (!ticket || !ticket.event) return;
    router.push(`/events/${ticket.eventId}`);
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid':
        return 'Válido';
      case 'used':
        return 'Utilizado';
      case 'expired':
        return 'Expirado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconocido';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return theme.colors.success.main;
      case 'used':
        return theme.colors.warning.main;
      case 'expired':
        return theme.colors.error.main;
      case 'cancelled':
        return theme.colors.error.main;
      default:
        return theme.colors.primary.main;
    }
  };
  
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }
  
  if (error || !ticket) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
        <Text style={[styles.errorText, { color: theme.colors.error.main }]}>
          {error || 'No se encontró el ticket'}
        </Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: theme.colors.primary.main }]}
          onPress={() => router.back()}
        >
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background.default }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.ticketContainer}>
        <View style={styles.ticketHeader}>
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            {ticket.event?.title || 'Evento'}
          </Text>
          
          <TouchableOpacity onPress={handleShareTicket} style={styles.shareButton}>
            <Ionicons 
              name="share-social-outline" 
              size={24} 
              color={theme.colors.primary.main} 
            />
          </TouchableOpacity>
        </View>
        
        {ticket.event?.image && (
          <Image 
            source={{ uri: ticket.event.image }} 
            style={styles.eventImage}
            resizeMode="cover"
          />
        )}
        
        <View style={styles.qrContainer}>
          <QRCode 
            value={ticket.qrCode} 
            size={QR_SIZE}
            color={theme.colors.text.primary}
            backgroundColor={theme.colors.background.default}
          />
          <Text style={[styles.ticketId, { color: theme.colors.text.secondary }]}>
            #{ticket.ticketNumber}
          </Text>
        </View>
        
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons 
              name="calendar-outline" 
              size={20} 
              color={theme.colors.primary.main}
            />
            <Text style={[styles.infoText, { color: theme.colors.text.primary }]}>
              {ticket.event?.startDate 
                ? formatDate(ticket.event.startDate) 
                : 'Fecha no disponible'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons 
              name="location-outline" 
              size={20} 
              color={theme.colors.primary.main}
            />
            <Text style={[styles.infoText, { color: theme.colors.text.primary }]}>
              {ticket.event?.location || 'Ubicación no especificada'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons 
              name="ticket-outline" 
              size={20} 
              color={theme.colors.primary.main}
            />
            <Text style={[styles.infoText, { color: theme.colors.text.primary }]}>
              {ticket.ticketType || 'Entrada General'}
            </Text>
          </View>
          
          {ticket.seat && (
            <View style={styles.infoRow}>
              <Ionicons 
                name="grid-outline" 
                size={20} 
                color={theme.colors.primary.main}
              />
              <Text style={[styles.infoText, { color: theme.colors.text.primary }]}>
                Asiento: {ticket.seat}
              </Text>
            </View>
          )}
          
          <View style={styles.infoRow}>
            <Ionicons 
              name="pricetag-outline" 
              size={20} 
              color={theme.colors.primary.main}
            />
            <Text style={[styles.infoText, { color: theme.colors.text.primary }]}>
              {ticket.price === 0 
                ? 'Entrada gratuita' 
                : `${ticket.price} ${ticket.currency || '€'}`}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons 
              name="time-outline" 
              size={20} 
              color={theme.colors.primary.main}
            />
            <Text style={[styles.infoText, { color: theme.colors.text.primary }]}>
              Comprado el {formatDate(ticket.purchaseDate)}
            </Text>
          </View>
        </View>
        
        <View style={[
          styles.statusBadge,
          {
            backgroundColor: getStatusColor(ticket.status),
          }
        ]}>
          <Text style={styles.statusText}>
            {getStatusText(ticket.status)}
          </Text>
        </View>
        
        <View style={styles.holderSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Datos del titular
          </Text>
          
          <View style={styles.holderInfo}>
            <View style={styles.infoRow}>
              <Ionicons 
                name="person-outline" 
                size={20} 
                color={theme.colors.primary.main}
              />
              <Text style={[styles.infoText, { color: theme.colors.text.primary }]}>
                {ticket.ticketHolder?.name || 'No especificado'}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons 
                name="mail-outline" 
                size={20} 
                color={theme.colors.primary.main}
              />
              <Text style={[styles.infoText, { color: theme.colors.text.primary }]}>
                {ticket.ticketHolder?.email || 'No especificado'}
              </Text>
            </View>
            
            {ticket.ticketHolder?.phone && (
              <View style={styles.infoRow}>
                <Ionicons 
                  name="call-outline" 
                  size={20} 
                  color={theme.colors.primary.main}
                />
                <Text style={[styles.infoText, { color: theme.colors.text.primary }]}>
                  {ticket.ticketHolder.phone}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  ticketContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  shareButton: {
    padding: 8,
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  ticketId: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  infoSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  holderSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  holderInfo: {
    marginTop: 8,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
}); 