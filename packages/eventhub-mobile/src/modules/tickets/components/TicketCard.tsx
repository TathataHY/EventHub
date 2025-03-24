import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ColorValue } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card } from '@shared/components/ui/Card';
import { useTheme } from '@shared/hooks/useTheme';
import { getColorValue } from '@theme/theme.types';
import { Ticket, TicketStatus } from '../types';

export interface TicketCardProps {
  ticket: Ticket;
  onPress?: (ticketId: string) => void;
}

/**
 * Componente para mostrar un ticket en formato de tarjeta
 */
export const TicketCard: React.FC<TicketCardProps> = ({ ticket, onPress }) => {
  const { theme } = useTheme();
  
  // Formatear fecha
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'Fecha no disponible';
    
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return format(date, 'd MMM yyyy', { locale: es });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Determinar qué icono mostrar según el estado del ticket
  const getStatusIcon = (status: TicketStatus) => {
    if (status === 'valid') return 'checkmark-circle';
    if (status === 'used') return 'checkmark-circle-outline';
    if (status === 'expired') return 'time';
    return 'close-circle';
  };

  // Determinar qué color mostrar según el estado del ticket
  const getStatusColor = (status: TicketStatus): ColorValue => {
    const colors: Record<string, ColorValue> = {
      valid: getColorValue(theme.colors.success.main),
      used: getColorValue(theme.colors.secondary.main),
      expired: getColorValue(theme.colors.error.main),
      cancelled: getColorValue(theme.colors.error.main)
    };
    
    return colors[status] || getColorValue(theme.colors.grey[500]);
  };
  
  // Otra manera de hacer lo mismo
  const getTextColor = (status: TicketStatus): ColorValue => {
    if (status === 'valid') return getColorValue(theme.colors.success.main);
    if (status === 'used') return getColorValue(theme.colors.secondary.main);
    return getColorValue(theme.colors.error.main);
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress && onPress(ticket.id)}
        activeOpacity={0.8}
      >
        <View style={styles.header}>
          <View style={styles.eventInfo}>
            <Text style={[styles.eventName, { color: getColorValue(theme.colors.text.primary) }]}>
              {ticket.event?.title || 'Evento no disponible'}
            </Text>
            <Text style={[styles.date, { color: getColorValue(theme.colors.text.secondary) }]}>
              {ticket.event ? formatDate(ticket.event.startDate) : 'Fecha no disponible'}
            </Text>
          </View>
          
          <View style={[styles.status, { backgroundColor: `${String(getStatusColor(ticket.status))}20` }]}>
            <Ionicons 
              name={getStatusIcon(ticket.status)} 
              size={18} 
              color={getStatusColor(ticket.status)} 
            />
            <Text style={[styles.statusText, { color: getTextColor(ticket.status) }]}>
              {ticket.status === 'valid' ? 'Válido' : 
               ticket.status === 'used' ? 'Usado' : 
               ticket.status === 'expired' ? 'Expirado' : 'Cancelado'}
            </Text>
          </View>
        </View>
        
        <View style={styles.ticketDetails}>
          <View style={styles.infoRow}>
            <Ionicons 
              name="person-outline" 
              size={16} 
              color={getColorValue(theme.colors.text.secondary)} 
              style={styles.icon} 
            />
            <Text style={[styles.infoText, { color: getColorValue(theme.colors.text.secondary) }]}>
              {ticket.ticketHolder.name}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons 
              name="location-outline" 
              size={16}
              color={getColorValue(theme.colors.text.secondary)} 
              style={styles.icon} 
            />
            <Text style={[styles.infoText, { color: getColorValue(theme.colors.text.secondary) }]}
                  numberOfLines={1}>
              {ticket.event?.location || 'Ubicación no especificada'}
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons 
              name="ticket-outline" 
              size={16} 
              color={getColorValue(theme.colors.text.secondary)} 
              style={styles.icon} 
            />
            <Text style={[styles.infoText, { color: getColorValue(theme.colors.text.secondary) }]}>
              {ticket.ticketType} - {ticket.price ? `${ticket.price}€` : 'Gratuito'}
            </Text>
          </View>
        </View>
        
        {ticket.status === 'valid' && (
          <View style={styles.qrContainer}>
            <Image 
              source={{ uri: ticket.qrCode }} 
              style={styles.qrCode} 
              resizeMode="contain"
            />
          </View>
        )}
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  eventInfo: {
    flex: 1,
    marginRight: 12,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  ticketDetails: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  qrCode: {
    width: 160,
    height: 160,
  },
}); 