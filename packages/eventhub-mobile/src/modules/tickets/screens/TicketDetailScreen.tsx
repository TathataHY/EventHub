import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator, 
  Image,
  Share,
  Alert
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QRCode } from '@shared/components/scanner/QRCode';

import { useTheme } from '@core/context/ThemeContext';
import { Divider } from '@shared/components/ui';
import { Ticket, TicketStatus } from '@modules/tickets/types';

// Datos extendidos del ticket para la pantalla de detalle
interface ExtendedTicket extends Ticket {
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventImage: string;
  ticketCode: string;
  entryTime?: string;
}

// Datos temporales para mostrar mientras se carga desde la API
const mockTicket: ExtendedTicket = {
  id: 'ticket123',
  eventId: 'event456',
  userId: 'user1',
  ticketNumber: 'EH-2023-A12345',
  ticketType: 'vip',
  price: 100,
  status: 'valid',
  purchaseDate: '2023-07-15T10:30:00Z',
  qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=EH-2023-A12345',
  isTransferable: true,
  validationCount: 0,
  ticketHolder: {
    name: 'Juan Pérez',
    email: 'juan@example.com'
  },
  eventName: 'Festival de Música Urbana',
  eventDate: '2023-12-15T20:00:00Z',
  eventLocation: 'Palacio de Deportes, Madrid',
  eventImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
  ticketCode: 'EH-2023-A12345',
};

export function TicketDetailScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<ExtendedTicket | null>(null);

  // Cargar datos de entrada
  useEffect(() => {
    const loadTicketData = async () => {
      try {
        // Obtener datos de la entrada desde el almacenamiento
        const ticketData = await AsyncStorage.getItem('selectedTicket');
        
        if (ticketData) {
          const parsedTicket = JSON.parse(ticketData);
          
          // Verificar que sea la entrada correcta
          if (parsedTicket.id === id) {
            setTicket(parsedTicket as ExtendedTicket);
          } else {
            // Si no es la misma entrada, simular una carga (en producción se haría una petición a la API)
            setTimeout(() => {
              setTicket({
                id: id as string,
                eventId: '101',
                userId: 'user1',
                ticketNumber: 'JAZZ-2023-00123',
                ticketType: 'premium',
                price: 75,
                status: 'valid',
                purchaseDate: new Date().toISOString(),
                qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=JAZZ-2023-00123',
                isTransferable: true,
                validationCount: 0,
                ticketHolder: {
                  name: 'Usuario EventHub',
                  email: 'usuario@eventhub.com'
                },
                eventName: 'Festival de Jazz 2023',
                eventDate: new Date(Date.now() + 86400000 * 5).toISOString(),
                eventLocation: 'Auditorio Nacional, Madrid',
                eventImage: 'https://source.unsplash.com/random/800x600/?jazz',
                ticketCode: 'JAZZ-2023-00123'
              });
            }, 1000);
          }
        } else {
          // Si no hay datos guardados, simular una carga
          setTimeout(() => {
            setTicket({
              id: id as string,
              eventId: '101',
              userId: 'user1',
              ticketNumber: 'JAZZ-2023-00123',
              ticketType: 'premium',
              price: 75,
              status: 'valid',
              purchaseDate: new Date().toISOString(),
              qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=JAZZ-2023-00123',
              isTransferable: true,
              validationCount: 0,
              ticketHolder: {
                name: 'Usuario EventHub',
                email: 'usuario@eventhub.com'
              },
              eventName: 'Festival de Jazz 2023',
              eventDate: new Date(Date.now() + 86400000 * 5).toISOString(),
              eventLocation: 'Auditorio Nacional, Madrid',
              eventImage: 'https://source.unsplash.com/random/800x600/?jazz',
              ticketCode: 'JAZZ-2023-00123'
            });
          }, 1000);
        }
      } catch (error) {
        console.error('Error cargando datos de entrada:', error);
        Alert.alert('Error', 'No se pudo cargar la información de la entrada');
      } finally {
        setLoading(false);
      }
    };

    loadTicketData();
  }, [id]);

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Formatear hora
  const formatTime = (dateString: string): string => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleTimeString('es-ES', options);
  };

  // Obtener color según estado de la entrada
  const getStatusColor = (status: Ticket['status']): string => {
    switch (status) {
      case 'valid': return theme.colors.success.main;
      case 'used': return theme.colors.secondary.main;
      case 'expired': return theme.colors.error.main;
      default: return theme.colors.secondary.main;
    }
  };

  // Obtener texto según estado de la entrada
  const getStatusText = (status: Ticket['status']): string => {
    switch (status) {
      case 'valid': return 'Entrada válida';
      case 'used': return 'Entrada utilizada';
      case 'expired': return 'Entrada expirada';
      default: return 'Estado desconocido';
    }
  };

  // Compartir entrada
  const shareTicket = async () => {
    if (!ticket) return;
    
    try {
      await Share.share({
        message: `¡Iré a ${ticket.eventName}! El evento es el ${formatDate(ticket.eventDate)} a las ${formatTime(ticket.eventDate)} en ${ticket.eventLocation}. Mi código de entrada es: ${ticket.ticketCode}`,
        title: `Entrada para ${ticket.eventName}`
      });
    } catch (error) {
      console.error('Error compartiendo entrada:', error);
    }
  };

  // Ver evento
  const viewEvent = () => {
    if (ticket) {
      router.push(`/events/evento/${ticket.eventId}`);
    }
  };

  if (loading || !ticket) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background.default }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>
          Cargando detalles del boleto...
        </Text>
      </View>
    );
  }

  const isPastEvent = new Date(ticket.eventDate) < new Date();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: theme.colors.background.paper }]}>
          {ticket.eventImage ? (
            <Image
              source={{ uri: ticket.eventImage }}
              style={styles.eventImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.eventImagePlaceholder} />
          )}
          
          <View style={styles.eventInfo}>
            <Text style={[styles.eventName, { color: theme.colors.text.primary }]}>
              {ticket.eventName}
            </Text>
            
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.text.primary} />
              <Text style={[styles.infoText, { color: theme.colors.text.primary }]}>
                {formatDate(ticket.eventDate)}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color={theme.colors.text.primary} />
              <Text style={[styles.infoText, { color: theme.colors.text.primary }]}>
                {formatTime(ticket.eventDate)}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={theme.colors.text.primary} />
              <Text style={[styles.infoText, { color: theme.colors.text.primary }]}>
                {ticket.eventLocation}
              </Text>
            </View>
          </View>
          
          <Divider style={{ marginVertical: 16 }} />
          
          <View style={styles.qrSection}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Tu Boleto Digital
            </Text>
            
            <View style={styles.qrContainer}>
              <Text style={[styles.codeLabel, { color: theme.colors.text.primary }]}>
                CÓDIGO DE ENTRADA
              </Text>
              <Text style={[styles.codeValue, { color: theme.colors.text.primary }]}>
                {ticket.ticketNumber}
              </Text>
              
              <QRCode
                value={ticket.ticketCode || ticket.id}
                size={200}
                color={theme.colors.text.primary}
                backgroundColor={theme.colors.background.default}
              />
              <Text style={[styles.qrInstructions, { color: theme.colors.text.primary }]}>
                Muestra este código al personal del evento para ingresar
              </Text>
              
              <View style={[styles.entryTimeBox, { backgroundColor: theme.colors.background.default }]}>
                <Ionicons name="time-outline" size={18} color={theme.colors.success.main} />
                <Text style={[styles.entryTimeText, { color: theme.colors.text.primary }]}>
                  Entrada válida desde: {formatTime(ticket.eventDate)}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.attendeeSection}>
            <View style={styles.attendeeHeader}>
              <Ionicons name="person-outline" size={20} color={theme.colors.primary.main} />
              <Text style={[styles.attendeeTitle, { color: theme.colors.primary.main }]}>
                Datos del asistente
              </Text>
            </View>
            
            <View style={styles.attendeeInfo}>
              <Text style={[styles.attendeeLabel, { color: theme.colors.text.secondary }]}>Nombre:</Text>
              <Text style={[styles.attendeeValue, { color: theme.colors.text.primary }]}>
                {ticket.ticketHolder.name}
              </Text>
            </View>
            
            <View style={styles.attendeeInfo}>
              <Text style={[styles.attendeeLabel, { color: theme.colors.text.secondary }]}>Email:</Text>
              <Text style={[styles.attendeeValue, { color: theme.colors.text.primary }]}>
                {ticket.ticketHolder.email}
              </Text>
            </View>
            
            {ticket.ticketHolder.phone && (
              <View style={styles.attendeeInfo}>
                <Text style={[styles.attendeeLabel, { color: theme.colors.text.secondary }]}>Teléfono:</Text>
                <Text style={[styles.attendeeValue, { color: theme.colors.text.primary }]}>
                  {ticket.ticketHolder.phone}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              { backgroundColor: theme.colors.primary.main },
              isPastEvent && { opacity: 0.6 }
            ]}
            onPress={viewEvent}
            disabled={isPastEvent}
          >
            <Ionicons name="calendar" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>
              Ver Evento
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, { backgroundColor: theme.colors.secondary.main }]}
            onPress={shareTicket}
          >
            <Ionicons name="share-social" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>
              Compartir
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.helpSection}>
          <Text style={[styles.helpTitle, { color: theme.colors.text.primary }]}>
            ¿Necesitas ayuda?
          </Text>
          <Text style={[styles.helpText, { color: theme.colors.text.primary }]}>
            Si tienes algún problema con tu boleto, contacta al organizador o al soporte técnico.
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={[styles.helpButtonText, { color: theme.colors.primary.main }]}>
              Contactar Soporte
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImageContainer: {
    position: 'relative',
  },
  eventImage: {
    height: 200,
    width: '100%',
  },
  statusContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  eventInfo: {
    padding: 16,
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
  },
  ticketInfo: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ticketCode: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  codeLabel: {
    fontSize: 14,
  },
  codeValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  qrImage: {
    width: 200,
    height: 200,
    marginBottom: 12,
  },
  qrInstructions: {
    fontSize: 14,
    textAlign: 'center',
  },
  entryTimeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  entryTimeText: {
    marginLeft: 8,
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  helpSection: {
    marginTop: 16,
    marginBottom: 24,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  helpButton: {
    padding: 8,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  eventImagePlaceholder: {
    height: 200,
    width: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrSection: {
    padding: 16,
  },
  attendeeSection: {
    padding: 16,
  },
  attendeeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  attendeeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  attendeeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  attendeeLabel: {
    fontSize: 14,
  },
  attendeeValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 