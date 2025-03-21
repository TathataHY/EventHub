import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
  Alert,
  FlatList
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { useTheme } from '../../src/context/ThemeContext';
import { Divider } from '../../src/components/common/Divider';
import { QRScanner } from '../../src/components/scanner/QRScanner';
import { ticketService, Ticket, TicketStatus } from '../../src/services/ticket.service';
import { eventService } from '../../src/services/event.service';
import { authService } from '../../src/services/auth.service';

export default function ValidateTicketsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [events, setEvents] = useState<{ id: string; title: string }[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [validatedTickets, setValidatedTickets] = useState<{
    ticket: Ticket;
    eventName: string;
    timestamp: string;
  }[]>([]);

  // Cargar eventos organizados por el usuario actual
  useEffect(() => {
    loadUserEvents();
  }, []);

  // Cargar eventos organizados por el usuario actual
  const loadUserEvents = async () => {
    try {
      setIsLoading(true);
      
      // Verificar si el usuario está autenticado
      const user = await authService.getCurrentUser();
      if (!user) {
        router.replace('/auth/login');
        return;
      }
      
      // Obtener eventos organizados por el usuario
      // En una app real, esto filtraría por eventos del organizador
      const userEvents = await eventService.getAllEvents();
      
      setEvents(userEvents.map(event => ({
        id: event.id,
        title: event.title
      })));
      
      if (userEvents.length > 0) {
        setSelectedEventId(userEvents[0].id);
      }
    } catch (error) {
      console.error('Error al cargar eventos:', error);
      Alert.alert('Error', 'No se pudieron cargar los eventos');
    } finally {
      setIsLoading(false);
    }
  };

  // Abrir el escáner de QR
  const openScanner = () => {
    if (!selectedEventId) {
      Alert.alert('Error', 'Selecciona un evento primero');
      return;
    }
    
    setIsScannerOpen(true);
  };

  // Cerrar el escáner de QR
  const closeScanner = () => {
    setIsScannerOpen(false);
  };

  // Manejar el escaneo de un código QR
  const handleScan = async (data: string) => {
    try {
      setIsValidating(true);
      
      // Intentar obtener el ticket por su código QR
      // (En una implementación real, este código tendría más validaciones)
      const tickets = await ticketService.getUserTickets('');
      const ticket = tickets.find(t => t.qrCode === data);
      
      if (!ticket) {
        Alert.alert('Error', 'Ticket no encontrado');
        setIsScannerOpen(false);
        return;
      }
      
      // Verificar que el ticket sea para el evento seleccionado
      if (ticket.eventId !== selectedEventId) {
        Alert.alert(
          'Ticket inválido', 
          'Este ticket no corresponde al evento seleccionado'
        );
        setIsScannerOpen(false);
        return;
      }
      
      // Verificar el estado del ticket
      if (ticket.status !== TicketStatus.VALID) {
        let message = '';
        switch (ticket.status) {
          case TicketStatus.USED:
            message = 'Este ticket ya ha sido utilizado';
            break;
          case TicketStatus.EXPIRED:
            message = 'Este ticket ha expirado';
            break;
          case TicketStatus.CANCELLED:
            message = 'Este ticket ha sido cancelado';
            break;
          default:
            message = 'Este ticket no es válido';
        }
        
        Alert.alert('Ticket no válido', message);
        setIsScannerOpen(false);
        return;
      }
      
      // Validar el ticket
      const updatedTicket = await ticketService.validateTicket(ticket.id);
      
      if (!updatedTicket) {
        Alert.alert('Error', 'No se pudo validar el ticket');
        setIsScannerOpen(false);
        return;
      }
      
      // Obtener nombre del evento
      const eventData = await eventService.getEventById(ticket.eventId);
      
      if (!eventData) {
        Alert.alert('Error', 'No se pudo obtener información del evento');
        setIsScannerOpen(false);
        return;
      }
      
      // Agregar ticket validado a la lista
      const validatedTicket = {
        ticket: updatedTicket,
        eventName: eventData.title,
        timestamp: new Date().toISOString()
      };
      
      setValidatedTickets(prev => [validatedTicket, ...prev]);
      
      // Mostrar confirmación
      Alert.alert(
        'Ticket validado',
        `Ticket para ${eventData.title} validado correctamente.`,
        [{ text: 'OK', onPress: () => setIsScannerOpen(false) }]
      );
    } catch (error) {
      console.error('Error al validar ticket:', error);
      Alert.alert('Error', 'Ocurrió un error al validar el ticket');
      setIsScannerOpen(false);
    } finally {
      setIsValidating(false);
    }
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM, HH:mm", { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  // Renderizar un ticket validado
  const renderValidatedTicket = ({ item }: { item: { ticket: Ticket; eventName: string; timestamp: string } }) => (
    <View style={[styles.ticketItem, { backgroundColor: theme.colors.card }]}>
      <View style={styles.ticketHeader}>
        <Text style={[styles.ticketTitle, { color: theme.colors.text }]}>
          {item.eventName}
        </Text>
        <Text style={[styles.ticketTime, { color: theme.colors.secondaryText }]}>
          {formatDate(item.timestamp)}
        </Text>
      </View>
      
      <View style={styles.ticketDetails}>
        <View style={styles.ticketDetail}>
          <Ionicons name="person-outline" size={16} color={theme.colors.secondaryText} />
          <Text style={[styles.ticketDetailText, { color: theme.colors.text }]}>
            {item.ticket.ticketHolder.name}
          </Text>
        </View>
        
        <View style={styles.ticketDetail}>
          <Ionicons name="pricetag-outline" size={16} color={theme.colors.secondaryText} />
          <Text style={[styles.ticketDetailText, { color: theme.colors.text }]}>
            {item.ticket.ticketType}
          </Text>
        </View>
        
        {item.ticket.seat && (
          <View style={styles.ticketDetail}>
            <Ionicons name="location-outline" size={16} color={theme.colors.secondaryText} />
            <Text style={[styles.ticketDetailText, { color: theme.colors.text }]}>
              Asiento: {item.ticket.seat}
            </Text>
          </View>
        )}
      </View>
      
      <View style={[styles.validatedBadge, { backgroundColor: theme.colors.success + '20' }]}>
        <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
        <Text style={[styles.validatedText, { color: theme.colors.success }]}>
          Validado
        </Text>
      </View>
    </View>
  );

  // Renderizar selector de eventos
  const renderEventSelector = () => (
    <View style={styles.eventSelectorContainer}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Selecciona un evento
      </Text>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.eventButtonsContainer}
      >
        {events.map(event => (
          <TouchableOpacity
            key={event.id}
            style={[
              styles.eventButton,
              selectedEventId === event.id 
                ? { backgroundColor: theme.colors.primary } 
                : { 
                    backgroundColor: 'transparent',
                    borderColor: theme.colors.border,
                    borderWidth: 1
                  }
            ]}
            onPress={() => setSelectedEventId(event.id)}
          >
            <Text
              style={[
                styles.eventButtonText,
                selectedEventId === event.id 
                  ? { color: '#FFFFFF' } 
                  : { color: theme.colors.text }
              ]}
            >
              {event.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Cabecera */}
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Validar Tickets
        </Text>
        
        <View style={styles.rightPlaceholder} />
      </View>
      
      <Divider />
      
      {/* Contenido principal */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.secondaryText }]}>
            Cargando eventos...
          </Text>
        </View>
      ) : (
        <>
          {/* Selector de eventos */}
          {events.length > 0 ? (
            <>
              {renderEventSelector()}
              
              {/* Botón para escanear */}
              <TouchableOpacity
                style={[styles.scanButton, { backgroundColor: theme.colors.primary }]}
                onPress={openScanner}
              >
                <Ionicons name="qr-code" size={24} color="#FFFFFF" />
                <Text style={styles.scanButtonText}>
                  Escanear Ticket
                </Text>
              </TouchableOpacity>
              
              {/* Lista de tickets validados */}
              <View style={styles.ticketsContainer}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Tickets validados
                </Text>
                
                {validatedTickets.length > 0 ? (
                  <FlatList
                    data={validatedTickets}
                    renderItem={renderValidatedTicket}
                    keyExtractor={(item, index) => `${item.ticket.id}-${index}`}
                    contentContainerStyle={styles.ticketsList}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                  />
                ) : (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="ticket-outline" size={48} color={theme.colors.secondaryText} />
                    <Text style={[styles.emptyText, { color: theme.colors.secondaryText }]}>
                      No hay tickets validados aún
                    </Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <View style={styles.centerContainer}>
              <Ionicons name="calendar-outline" size={64} color={theme.colors.secondaryText} />
              <Text style={[styles.emptyText, { color: theme.colors.text }]}>
                No tienes eventos disponibles
              </Text>
              <Text style={[styles.emptySubText, { color: theme.colors.secondaryText }]}>
                Crea un evento para poder validar tickets
              </Text>
              <TouchableOpacity
                style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => router.push('/events/crear')}
              >
                <Text style={styles.createButtonText}>Crear evento</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
      
      {/* Modal del escáner */}
      <Modal
        visible={isScannerOpen}
        onRequestClose={closeScanner}
        animationType="slide"
      >
        {isValidating ? (
          <View style={[styles.validatingContainer, { backgroundColor: theme.colors.background }]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.validatingText, { color: theme.colors.text }]}>
              Validando ticket...
            </Text>
          </View>
        ) : (
          <QRScanner onScan={handleScan} onClose={closeScanner} />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  rightPlaceholder: {
    width: 40,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  emptySubText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  createButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  eventSelectorContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  eventButtonsContainer: {
    flexDirection: 'row',
    paddingBottom: 8,
  },
  eventButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
  },
  eventButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  scanButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  ticketsContainer: {
    flex: 1,
    padding: 16,
    paddingTop: 24,
  },
  ticketsList: {
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  ticketItem: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  ticketTime: {
    fontSize: 12,
  },
  ticketDetails: {
    marginBottom: 12,
  },
  ticketDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ticketDetailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  validatedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  validatedText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  validatingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  validatingText: {
    marginTop: 16,
    fontSize: 16,
  },
}); 