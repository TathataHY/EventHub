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

import { useTheme } from '../../../core/theme';
import { QRCode } from '../../../shared/components/scanner';
import { Divider } from '../../../shared/components';
import { ticketService } from '../services';
import { eventService } from '../../../modules/events/services';

type Ticket = {
  id: string;
  eventId: string;
  userId: string;
  ticketNumber: string;
  ticketType: string;
  seat?: string;
  price: number;
  status: 'valid' | 'used' | 'expired' | 'cancelled';
  purchaseDate: string;
  qrCode: string;
  ticketHolder: {
    name: string;
    email: string;
    phone?: string;
  };
  event?: {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    location: string;
    image?: string;
    organizer: {
      id: string;
      name: string;
    };
  };
};

/**
 * Pantalla para visualizar los detalles de un ticket
 */
export const TicketDetailsScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  
  // Cargar datos del ticket
  useEffect(() => {
    if (params.id) {
      loadTicketDetails(params.id);
    }
  }, [params.id]);
  
  // Cargar detalles del ticket y del evento asociado
  const loadTicketDetails = async (ticketId: string) => {
    try {
      setIsLoading(true);
      
      // Obtener ticket por ID
      const ticketData = await ticketService.getTicketById(ticketId);
      
      if (!ticketData) {
        Alert.alert('Error', 'Ticket no encontrado');
        router.back();
        return;
      }
      
      // Obtener datos del evento asociado
      const eventData = await eventService.getEventById(ticketData.eventId);
      
      if (!eventData) {
        Alert.alert('Error', 'No se pudo obtener información del evento');
      } else {
        // Combinar datos del ticket y evento
        ticketData.event = {
          id: eventData.id,
          title: eventData.title,
          description: eventData.description,
          startDate: eventData.startDate,
          endDate: eventData.endDate,
          location: eventData.location,
          image: eventData.image,
          organizer: eventData.organizer
        };
      }
      
      setTicket(ticketData);
    } catch (error) {
      console.error('Error al cargar detalles del ticket:', error);
      Alert.alert('Error', 'No se pudo cargar la información del ticket');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM, yyyy", { locale: es });
    } catch (error) {
      return dateString;
    }
  };
  
  // Formatear hora
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "HH:mm", { locale: es });
    } catch (error) {
      return '';
    }
  };
  
  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };
  
  // Compartir detalles del ticket
  const shareTicket = async () => {
    if (!ticket || !ticket.event) return;
    
    try {
      const message = `
Mi entrada para ${ticket.event.title}
Fecha: ${formatDate(ticket.event.startDate)} - ${formatTime(ticket.event.startDate)}
Lugar: ${ticket.event.location}
Entrada: ${ticket.ticketType}${ticket.seat ? ` - Asiento: ${ticket.seat}` : ''}
Número de ticket: ${ticket.ticketNumber}
`;
      
      await Share.share({
        message,
        title: `Entrada para ${ticket.event.title}`
      });
    } catch (error) {
      console.error('Error al compartir ticket:', error);
      Alert.alert('Error', 'No se pudo compartir la entrada');
    }
  };
  
  // Abrir ubicación en la app de mapas
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
  
  // Abrir detalles del evento
  const openEventDetails = () => {
    if (!ticket || !ticket.event) return;
    router.push(`/events/${ticket.eventId}`);
  };
  
  // Convertir estado del ticket a texto en español
  const getStatusText = (status: string) => {
    switch (status) {
      case 'valid':
        return 'Válido';
      case 'used':
        return 'Usado';
      case 'expired':
        return 'Expirado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };
  
  // Obtener color según estado del ticket
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return colors.success;
      case 'used':
        return colors.secondaryText;
      case 'expired':
      case 'cancelled':
        return colors.error;
      default:
        return colors.text;
    }
  };
  
  // Renderizar información de evento
  const renderEventInfo = () => {
    if (!ticket || !ticket.event) return null;
    
    return (
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        {/* Imagen del evento */}
        {ticket.event.image ? (
          <Image
            source={{ uri: ticket.event.image }}
            style={styles.eventImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.eventImagePlaceholder, { backgroundColor: colors.border }]}>
            <Ionicons name="calendar-outline" size={48} color={colors.secondaryText} />
          </View>
        )}
        
        {/* Información del evento */}
        <View style={styles.eventDetails}>
          <Text style={[styles.eventTitle, { color: colors.text }]}>
            {ticket.event.title}
          </Text>
          
          <View style={styles.eventDetail}>
            <Ionicons name="calendar-outline" size={16} color={colors.primary} />
            <Text style={[styles.eventDetailText, { color: colors.text }]}>
              {formatDate(ticket.event.startDate)}
            </Text>
          </View>
          
          <View style={styles.eventDetail}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={[styles.eventDetailText, { color: colors.text }]}>
              {formatTime(ticket.event.startDate)}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.eventDetail}
            onPress={openLocation}
          >
            <Ionicons name="location-outline" size={16} color={colors.primary} />
            <Text 
              style={[
                styles.eventDetailText, 
                { color: colors.text },
                styles.locationText
              ]}
              numberOfLines={2}
            >
              {ticket.event.location}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.eventDetail}>
            <Ionicons name="person-outline" size={16} color={colors.primary} />
            <Text style={[styles.eventDetailText, { color: colors.text }]}>
              {ticket.event.organizer.name}
            </Text>
          </View>
        </View>
        
        {/* Botón ver evento */}
        <TouchableOpacity
          style={[styles.viewEventButton, { borderColor: colors.primary }]}
          onPress={openEventDetails}
        >
          <Text style={[styles.viewEventButtonText, { color: colors.primary }]}>
            Ver detalles del evento
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // Renderizar información del ticket
  const renderTicketInfo = () => {
    if (!ticket) return null;
    
    return (
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.ticketHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Información del ticket
          </Text>
          
          <View 
            style={[
              styles.statusBadge, 
              { backgroundColor: getStatusColor(ticket.status) + '20' }
            ]}
          >
            <Text 
              style={[
                styles.statusText, 
                { color: getStatusColor(ticket.status) }
              ]}
            >
              {getStatusText(ticket.status)}
            </Text>
          </View>
        </View>
        
        <View style={styles.ticketDetailsContainer}>
          <View style={styles.ticketDetailRow}>
            <Text style={[styles.ticketDetailLabel, { color: colors.secondaryText }]}>
              Nombre
            </Text>
            <Text style={[styles.ticketDetailValue, { color: colors.text }]}>
              {ticket.ticketHolder.name}
            </Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.ticketDetailRow}>
            <Text style={[styles.ticketDetailLabel, { color: colors.secondaryText }]}>
              Email
            </Text>
            <Text style={[styles.ticketDetailValue, { color: colors.text }]}>
              {ticket.ticketHolder.email}
            </Text>
          </View>
          
          {ticket.ticketHolder.phone && (
            <>
              <Divider style={styles.divider} />
              
              <View style={styles.ticketDetailRow}>
                <Text style={[styles.ticketDetailLabel, { color: colors.secondaryText }]}>
                  Teléfono
                </Text>
                <Text style={[styles.ticketDetailValue, { color: colors.text }]}>
                  {ticket.ticketHolder.phone}
                </Text>
              </View>
            </>
          )}
          
          <Divider style={styles.divider} />
          
          <View style={styles.ticketDetailRow}>
            <Text style={[styles.ticketDetailLabel, { color: colors.secondaryText }]}>
              Tipo de entrada
            </Text>
            <Text style={[styles.ticketDetailValue, { color: colors.text }]}>
              {ticket.ticketType}
            </Text>
          </View>
          
          {ticket.seat && (
            <>
              <Divider style={styles.divider} />
              
              <View style={styles.ticketDetailRow}>
                <Text style={[styles.ticketDetailLabel, { color: colors.secondaryText }]}>
                  Asiento
                </Text>
                <Text style={[styles.ticketDetailValue, { color: colors.text }]}>
                  {ticket.seat}
                </Text>
              </View>
            </>
          )}
          
          <Divider style={styles.divider} />
          
          <View style={styles.ticketDetailRow}>
            <Text style={[styles.ticketDetailLabel, { color: colors.secondaryText }]}>
              Precio
            </Text>
            <Text style={[styles.ticketDetailValue, { color: colors.text }]}>
              {formatPrice(ticket.price)}
            </Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.ticketDetailRow}>
            <Text style={[styles.ticketDetailLabel, { color: colors.secondaryText }]}>
              Fecha de compra
            </Text>
            <Text style={[styles.ticketDetailValue, { color: colors.text }]}>
              {formatDate(ticket.purchaseDate)}
            </Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.ticketDetailRow}>
            <Text style={[styles.ticketDetailLabel, { color: colors.secondaryText }]}>
              Número de ticket
            </Text>
            <Text style={[styles.ticketDetailValue, { color: colors.text }]}>
              {ticket.ticketNumber}
            </Text>
          </View>
        </View>
        
        {/* Botón para mostrar QR */}
        {ticket.status === 'valid' && (
          <TouchableOpacity
            style={[styles.qrButton, { backgroundColor: colors.primary }]}
            onPress={() => setShowQRCode(true)}
          >
            <Ionicons name="qr-code-outline" size={20} color="#FFFFFF" />
            <Text style={styles.qrButtonText}>
              Mostrar código QR
            </Text>
          </TouchableOpacity>
        )}
        
        {/* Botón para compartir */}
        <TouchableOpacity
          style={[styles.shareButton, { borderColor: colors.border }]}
          onPress={shareTicket}
        >
          <Ionicons name="share-social-outline" size={20} color={colors.text} />
          <Text style={[styles.shareButtonText, { color: colors.text }]}>
            Compartir detalles
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // Modal de código QR
  const renderQRModal = () => {
    if (!ticket) return null;
    
    return (
      <View 
        style={[
          styles.qrModalContainer, 
          { display: showQRCode ? 'flex' : 'none' }
        ]}
      >
        <View style={[styles.qrModal, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowQRCode(false)}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.qrTitle, { color: colors.text }]}>
            Tu entrada
          </Text>
          
          <Text style={[styles.qrSubtitle, { color: colors.secondaryText }]}>
            Muestra este código para validar tu entrada
          </Text>
          
          <View style={styles.qrCodeContainer}>
            <QRCode value={ticket.qrCode} size={200} />
          </View>
          
          <View style={styles.ticketInfoContainer}>
            <Text style={[styles.ticketName, { color: colors.text }]}>
              {ticket.event?.title}
            </Text>
            
            <Text style={[styles.ticketDate, { color: colors.secondaryText }]}>
              {ticket.event ? formatDate(ticket.event.startDate) : ''}
            </Text>
            
            <Text style={[styles.ticketType, { color: colors.primary }]}>
              {ticket.ticketType}{ticket.seat ? ` - Asiento ${ticket.seat}` : ''}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
            Cargando ticket...
          </Text>
        </View>
      ) : ticket ? (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {renderEventInfo()}
            {renderTicketInfo()}
          </ScrollView>
          
          {renderQRModal()}
        </>
      ) : (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.text }]}>
            No se pudo cargar el ticket
          </Text>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.primary }]}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>
              Volver
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  section: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    height: 160,
    width: '100%',
  },
  eventImagePlaceholder: {
    height: 160,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDetails: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventDetailText: {
    marginLeft: 8,
    fontSize: 14,
  },
  locationText: {
    textDecorationLine: 'underline',
    flex: 1,
  },
  viewEventButton: {
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  viewEventButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 0,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ticketDetailsContainer: {
    padding: 16,
  },
  ticketDetailRow: {
    paddingVertical: 10,
  },
  ticketDetailLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  ticketDetailValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    marginVertical: 0,
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  qrButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  shareButtonText: {
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  qrModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  qrModal: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
  },
  qrTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  qrSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  qrCodeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 16,
  },
  ticketInfoContainer: {
    alignItems: 'center',
  },
  ticketName: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  ticketDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  ticketType: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 