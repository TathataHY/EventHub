import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { useTheme } from '../../context/ThemeContext';
import { Ticket, TicketStatus } from '../../services/ticket.service';

interface TicketCardProps {
  ticket: Ticket;
  eventName: string;
  eventImage?: string;
  onPress: (ticketId: string) => void;
}

/**
 * Componente para mostrar un ticket en formato de tarjeta
 */
export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  eventName,
  eventImage,
  onPress
}) => {
  const { theme } = useTheme();
  
  // Formatear fecha a formato legible
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM, yyyy", { locale: es });
    } catch (error) {
      return dateString;
    }
  };
  
  // Determinar icono y color según el estado del ticket
  const getStatusInfo = () => {
    switch (ticket.status) {
      case TicketStatus.VALID:
        return {
          icon: 'checkmark-circle',
          color: theme.colors.success,
          text: 'Válido'
        };
      case TicketStatus.USED:
        return {
          icon: 'time',
          color: theme.colors.warning,
          text: 'Utilizado'
        };
      case TicketStatus.EXPIRED:
        return {
          icon: 'close-circle',
          color: theme.colors.error,
          text: 'Expirado'
        };
      case TicketStatus.CANCELLED:
        return {
          icon: 'ban',
          color: theme.colors.error,
          text: 'Cancelado'
        };
      default:
        return {
          icon: 'help-circle',
          color: theme.colors.secondaryText,
          text: 'Desconocido'
        };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.colors.card }]}
      onPress={() => onPress(ticket.id)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Imagen del evento */}
        <Image
          source={{ uri: eventImage || 'https://via.placeholder.com/150' }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Detalles del ticket */}
        <View style={styles.details}>
          <Text 
            style={[styles.eventName, { color: theme.colors.text }]} 
            numberOfLines={1}
          >
            {eventName}
          </Text>
          
          <View style={styles.infoRow}>
            <Ionicons name="pricetag-outline" size={14} color={theme.colors.secondaryText} />
            <Text style={[styles.infoText, { color: theme.colors.secondaryText }]}>
              {ticket.ticketType} - {ticket.price.toFixed(2)} €
            </Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color={theme.colors.secondaryText} />
            <Text style={[styles.infoText, { color: theme.colors.secondaryText }]}>
              {formatDate(ticket.purchaseDate)}
            </Text>
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
            <Ionicons name={statusInfo.icon} size={14} color={statusInfo.color} />
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.text}
            </Text>
          </View>
        </View>
        
        {/* Flecha derecha */}
        <View style={styles.chevron}>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.secondaryText} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  details: {
    flex: 1,
    padding: 12,
  },
  eventName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    marginLeft: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  chevron: {
    paddingRight: 12,
  }
}); 