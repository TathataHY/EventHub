import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  Platform
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { useTheme } from '../../../src/context/ThemeContext';
import { Divider } from '../../../src/components/common/Divider';
import { TicketQRCode } from '../../../src/components/tickets/QRCode';
import { ticketService, Ticket, TicketStatus } from '../../../src/services/ticket.service';
import { eventService } from '../../../src/services/event.service';

export default function TicketDetailScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [isLoading, setIsLoading] = useState(true);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [eventDetails, setEventDetails] = useState<{
    title: string;
    date: string;
    location: string;
    organizer: string;
  } | null>(null);
  
  // Cargar datos del ticket
  useEffect(() => {
    loadTicketDetails();
  }, [id]);
  
  // Cargar detalles del ticket y evento
  const loadTicketDetails = async () => {
    try {
      setIsLoading(true);
      
      if (!id) {
        router.back();
        return;
      }
      
      // Obtener detalles del ticket
      const ticketData = await ticketService.getTicketById(id as string);
      if (!ticketData) {
        Alert.alert(
          'Error',
          'No se encontró el ticket',
          [{ text: 'Volver', onPress: () => router.back() }]
        );
        return;
      }
      
      setTicket(ticketData);
      
      // Obtener detalles del evento asociado al ticket
      try {
        const event = await eventService.getEventById(ticketData.eventId);
        if (event) {
          setEventDetails({
            title: event.title,
            date: event.date,
            location: event.location,
            organizer: event.organizer
          });
        }
      } catch (eventError) {
        console.error('Error al obtener detalles del evento:', eventError);
      }
    } catch (error) {
      console.error('Error al cargar detalles del ticket:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los detalles del ticket',
        [{ text: 'Volver', onPress: () => router.back() }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Formatear fecha a formato legible
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM, yyyy HH:mm", { locale: es });
    } catch (error) {
      return dateString;
    }
  };
  
  // Compartir ticket
  const shareTicket = async () => {
    if (!ticket || !eventDetails) return;
    
    try {
      const message = Platform.select({
        ios: `¡Mira, voy a asistir a ${eventDetails.title}! ${eventDetails.date} en ${eventDetails.location}`,
        android: `¡Mira, voy a asistir a ${eventDetails.title}! ${eventDetails.date} en ${eventDetails.location}`,
        default: `¡Mira, voy a asistir a ${eventDetails.title}! ${eventDetails.date} en ${eventDetails.location}`
      });
      
      await Share.share({
        message,
        title: `Mi ticket para ${eventDetails.title}`
      });
    } catch (error) {
      console.error('Error al compartir ticket:', error);
    }
  };
  
  // Renderizar contenido cargando
  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.loadingText, { color: theme.colors.secondaryText }]}>
        Cargando ticket...
      </Text>
    </View>
  );
  
  // Renderizar acciones del ticket según su estado
  const renderTicketActions = () => {
    if (!ticket) return null;
    
    // Si el ticket no es válido, no mostramos acciones
    if (ticket.status !== TicketStatus.VALID) {
      return null;
    }
    
    return (
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
          onPress={shareTicket}
        >
          <Ionicons name="share-social" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Compartir ticket</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // Determinar si se debe ocultar la información sensible según el estado del ticket
  const shouldHideSensitiveInfo = () => {
    if (!ticket) return true;
    return ticket.status !== TicketStatus.VALID;
  };
  
  // Renderizar los detalles del titular del ticket
  const renderTicketHolderDetails = () => {
    if (!ticket) return null;
    
    return (
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Información del titular
        </Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={18} color={theme.colors.secondaryText} />
          <Text style={[styles.infoLabel, { color: theme.colors.secondaryText }]}>Nombre:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {ticket.ticketHolder.name}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={18} color={theme.colors.secondaryText} />
          <Text style={[styles.infoLabel, { color: theme.colors.secondaryText }]}>Email:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {ticket.ticketHolder.email}
          </Text>
        </View>
      </View>
    );
  };
  
  // Renderizar los detalles del ticket
  const renderTicketDetails = () => {
    if (!ticket || !eventDetails) return null;
    
    return (
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Información del ticket
        </Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="pricetag-outline" size={18} color={theme.colors.secondaryText} />
          <Text style={[styles.infoLabel, { color: theme.colors.secondaryText }]}>Tipo:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {ticket.ticketType}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="cash-outline" size={18} color={theme.colors.secondaryText} />
          <Text style={[styles.infoLabel, { color: theme.colors.secondaryText }]}>Precio:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {ticket.price.toFixed(2)} €
          </Text>
        </View>
        
        {ticket.seat && (
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={theme.colors.secondaryText} />
            <Text style={[styles.infoLabel, { color: theme.colors.secondaryText }]}>Asiento:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {ticket.seat}
            </Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color={theme.colors.secondaryText} />
          <Text style={[styles.infoLabel, { color: theme.colors.secondaryText }]}>Comprado:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {formatDate(ticket.purchaseDate)}
          </Text>
        </View>
        
        {ticket.validationDate && (
          <View style={styles.infoRow}>
            <Ionicons name="checkmark-circle-outline" size={18} color={theme.colors.secondaryText} />
            <Text style={[styles.infoLabel, { color: theme.colors.secondaryText }]}>Validado:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              {formatDate(ticket.validationDate)}
            </Text>
          </View>
        )}
      </View>
    );
  };
  
  // Renderizar los detalles del evento
  const renderEventDetails = () => {
    if (!eventDetails) return null;
    
    return (
      <View style={[styles.section, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Información del evento
        </Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={18} color={theme.colors.secondaryText} />
          <Text style={[styles.infoLabel, { color: theme.colors.secondaryText }]}>Fecha:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {formatDate(eventDetails.date)}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={18} color={theme.colors.secondaryText} />
          <Text style={[styles.infoLabel, { color: theme.colors.secondaryText }]}>Ubicación:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {eventDetails.location}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="person-outline" size={18} color={theme.colors.secondaryText} />
          <Text style={[styles.infoLabel, { color: theme.colors.secondaryText }]}>Organizador:</Text>
          <Text style={[styles.infoValue, { color: theme.colors.text }]}>
            {eventDetails.organizer}
          </Text>
        </View>
      </View>
    );
  };
  
  if (isLoading) {
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
            Detalles del Ticket
          </Text>
          
          <View style={styles.rightPlaceholder} />
        </View>
        
        <Divider />
        
        {renderLoading()}
      </View>
    );
  }
  
  if (!ticket || !eventDetails) {
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
            Detalles del Ticket
          </Text>
          
          <View style={styles.rightPlaceholder} />
        </View>
        
        <Divider />
        
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={64} color={theme.colors.error} />
          <Text style={[styles.errorText, { color: theme.colors.text }]}>
            No se pudo cargar el ticket
          </Text>
          <TouchableOpacity
            style={[styles.retryButton, { backgroundColor: theme.colors.primary }]}
            onPress={loadTicketDetails}
          >
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
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
        
        <Text style={[styles.headerTitle, { color: theme.colors.text }]} numberOfLines={1}>
          {eventDetails.title}
        </Text>
        
        <TouchableOpacity
          style={styles.shareButton}
          onPress={shareTicket}
        >
          <Ionicons name="share-outline" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      
      <Divider />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Código QR */}
        <View style={[styles.qrContainer, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.ticketTitle, { color: theme.colors.text }]}>
            {eventDetails.title}
          </Text>
          <Text style={[styles.ticketType, { color: theme.colors.primary }]}>
            {ticket.ticketType}
          </Text>
          
          <TicketQRCode 
            qrValue={ticket.qrCode}
            status={ticket.status}
            size={200}
            showStatus={true}
          />
          
          <Text style={[styles.qrHelp, { color: theme.colors.secondaryText }]}>
            Presenta este código QR en la entrada del evento
          </Text>
        </View>
        
        {/* Detalles del evento */}
        {renderEventDetails()}
        
        {/* Detalles del ticket */}
        {renderTicketDetails()}
        
        {/* Información del titular */}
        {renderTicketHolderDetails()}
        
        {/* Acciones del ticket */}
        {renderTicketActions()}
      </ScrollView>
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
    flex: 1,
    textAlign: 'center',
  },
  shareButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightPlaceholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
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
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  qrContainer: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ticketTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  ticketType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  qrHelp: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 12,
  },
  section: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    marginLeft: 8,
    marginRight: 4,
    width: 90,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  actionsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
}); 