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

import { useTheme } from '../../../theme/ThemeContext';
import { Divider } from '../../../shared/components/ui/Divider';

// Tipos de datos para entradas de eventos
interface Ticket {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
  eventImage: string;
  ticketCode: string;
  qrCode: string;
  status: 'valid' | 'used' | 'expired';
  entryTime?: string;
}

export function TicketDetailScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);

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
            setTicket(parsedTicket);
          } else {
            // Si no es la misma entrada, simular una carga (en producción se haría una petición a la API)
            setTimeout(() => {
              setTicket({
                id: id as string,
                eventId: '101',
                eventName: 'Festival de Jazz 2023',
                eventDate: new Date(Date.now() + 86400000 * 5).toISOString(),
                eventLocation: 'Auditorio Nacional, Madrid',
                eventImage: 'https://source.unsplash.com/random/800x600/?jazz',
                ticketCode: 'JAZZ-2023-00123',
                qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=JAZZ-2023-00123',
                status: 'valid'
              });
            }, 1000);
          }
        } else {
          // Si no hay datos guardados, simular una carga
          setTimeout(() => {
            setTicket({
              id: id as string,
              eventId: '101',
              eventName: 'Festival de Jazz 2023',
              eventDate: new Date(Date.now() + 86400000 * 5).toISOString(),
              eventLocation: 'Auditorio Nacional, Madrid',
              eventImage: 'https://source.unsplash.com/random/800x600/?jazz',
              ticketCode: 'JAZZ-2023-00123',
              qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=JAZZ-2023-00123',
              status: 'valid'
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
      case 'valid': return theme.colors.success;
      case 'used': return theme.colors.secondary;
      case 'expired': return theme.colors.error;
      default: return theme.colors.secondaryText;
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
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.secondaryText }]}>
          Cargando datos de la entrada...
        </Text>
      </View>
    );
  }

  const isPastEvent = new Date(ticket.eventDate) < new Date();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View style={styles.eventImageContainer}>
            <Image
              source={{ uri: ticket.eventImage }}
              style={styles.eventImage}
              resizeMode="cover"
            />
            <View 
              style={[styles.statusContainer, { backgroundColor: getStatusColor(ticket.status) }]}
            >
              <Text style={styles.statusText}>
                {getStatusText(ticket.status)}
              </Text>
            </View>
          </View>
          
          <View style={styles.eventInfo}>
            <Text style={[styles.eventName, { color: theme.colors.text }]}>
              {ticket.eventName}
            </Text>
            
            <View style={styles.infoRow}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.secondaryText} />
              <Text style={[styles.infoText, { color: theme.colors.secondaryText }]}>
                {formatDate(ticket.eventDate)}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color={theme.colors.secondaryText} />
              <Text style={[styles.infoText, { color: theme.colors.secondaryText }]}>
                {formatTime(ticket.eventDate)}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={20} color={theme.colors.secondaryText} />
              <Text style={[styles.infoText, { color: theme.colors.secondaryText }]}>
                {ticket.eventLocation}
              </Text>
            </View>
          </View>
          
          <Divider style={{ marginVertical: 16 }} />
          
          <View style={styles.ticketInfo}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Información del Ticket
            </Text>
            
            <View style={styles.ticketCode}>
              <Text style={[styles.codeLabel, { color: theme.colors.secondaryText }]}>
                Código de Entrada:
              </Text>
              <Text style={[styles.codeValue, { color: theme.colors.text }]}>
                {ticket.ticketCode}
              </Text>
            </View>
            
            <View style={styles.qrContainer}>
              <Image
                source={{ uri: ticket.qrCode }}
                style={styles.qrImage}
                resizeMode="contain"
              />
              <Text style={[styles.qrInstructions, { color: theme.colors.secondaryText }]}>
                Presenta este código QR en la entrada del evento
              </Text>
            </View>
            
            {ticket.status === 'used' && ticket.entryTime && (
              <View style={[styles.entryTimeBox, { backgroundColor: theme.colors.cardAlt }]}>
                <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                <Text style={[styles.entryTimeText, { color: theme.colors.text }]}>
                  Entrada escaneada el {formatDate(ticket.entryTime)} a las {formatTime(ticket.entryTime)}
                </Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[
              styles.actionButton, 
              { backgroundColor: theme.colors.primary },
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
            style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
            onPress={shareTicket}
          >
            <Ionicons name="share-social" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>
              Compartir
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.helpSection}>
          <Text style={[styles.helpTitle, { color: theme.colors.text }]}>
            ¿Necesitas ayuda?
          </Text>
          <Text style={[styles.helpText, { color: theme.colors.secondaryText }]}>
            Si tienes problemas con tu entrada o necesitas información adicional, por favor contacta con el organizador del evento o nuestro servicio de atención al cliente.
          </Text>
          <TouchableOpacity style={styles.helpButton}>
            <Text style={[styles.helpButtonText, { color: theme.colors.primary }]}>
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
}); 