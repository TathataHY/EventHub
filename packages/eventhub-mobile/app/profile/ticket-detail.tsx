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
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../../src/context/ThemeContext';
import { Divider } from '../../src/components/common/Divider';

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

export default function TicketDetailScreen() {
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
      
      <Stack.Screen
        options={{
          title: 'Detalles de la Entrada',
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerShadowVisible: false,
          headerTintColor: theme.colors.text,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ paddingLeft: 8 }}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
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
            
            <Text style={[styles.qrInstructions, { color: theme.colors.secondaryText }]}>
              {ticket.status === 'valid' 
                ? 'Presenta este código QR en la entrada del evento para validar tu acceso'
                : ticket.status === 'used'
                  ? 'Esta entrada ya ha sido utilizada'
                  : 'Esta entrada ha expirado y ya no es válida'}
            </Text>
            
            <View style={styles.qrContainer}>
              <Image
                source={{ uri: ticket.qrCode }}
                style={[
                  styles.qrCode,
                  ticket.status !== 'valid' && styles.invalidQrCode
                ]}
                resizeMode="contain"
              />
              
              {ticket.status !== 'valid' && (
                <View style={styles.invalidOverlay}>
                  <Ionicons 
                    name={ticket.status === 'used' ? 'checkmark-circle' : 'close-circle'} 
                    size={64} 
                    color={getStatusColor(ticket.status)} 
                  />
                </View>
              )}
            </View>
            
            {ticket.status === 'used' && ticket.entryTime && (
              <Text style={[styles.entryTimeText, { color: theme.colors.secondaryText }]}>
                Acceso registrado: {new Date(ticket.entryTime).toLocaleString('es-ES')}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={viewEvent}
          >
            <Ionicons name="calendar" size={20} color="#FFFFFF" />
            <Text style={styles.actionText}>Ver Evento</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.secondary }]}
            onPress={shareTicket}
          >
            <Ionicons name="share-social" size={20} color="#FFFFFF" />
            <Text style={styles.actionText}>Compartir</Text>
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
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  eventImageContainer: {
    position: 'relative',
    height: 200,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  statusContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  eventInfo: {
    padding: 16,
  },
  eventName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 16,
  },
  ticketInfo: {
    padding: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  ticketCode: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  codeLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  codeValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  qrInstructions: {
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  qrContainer: {
    position: 'relative',
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  qrCode: {
    width: 250,
    height: 250,
  },
  invalidQrCode: {
    opacity: 0.5,
  },
  invalidOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryTimeText: {
    marginTop: 8,
    fontSize: 14,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 24,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginHorizontal: 8,
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
}); 