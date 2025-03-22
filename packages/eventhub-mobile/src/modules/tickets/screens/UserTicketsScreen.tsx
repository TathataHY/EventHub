import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { useTheme } from '../../../core/theme';
import { ticketService } from '../services';
import { authService } from '../../../core/services';
import { Divider } from '../../../shared/components';

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
  event: {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    location: string;
    image?: string;
  };
};

/**
 * Pantalla para mostrar los tickets del usuario actual
 */
export const UserTicketsScreen = () => {
  const { colors } = useTheme();
  const router = useRouter();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  
  // Cargar tickets del usuario
  useEffect(() => {
    loadUserTickets();
  }, []);
  
  // Cargar tickets del usuario
  const loadUserTickets = async () => {
    try {
      setIsLoading(true);
      
      // Verificar si el usuario está autenticado
      const user = await authService.getCurrentUser();
      if (!user) {
        router.replace('/auth/login');
        return;
      }
      
      // Obtener tickets del usuario
      const userTickets = await ticketService.getUserTickets(user.id);
      setTickets(userTickets);
    } catch (error) {
      console.error('Error al cargar tickets:', error);
      Alert.alert('Error', 'No se pudieron cargar tus tickets');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Refrescar la lista de tickets
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadUserTickets();
  };
  
  // Filtrar tickets según el filtro seleccionado
  const getFilteredTickets = () => {
    const now = new Date();
    
    switch (filter) {
      case 'upcoming':
        return tickets.filter(ticket => 
          new Date(ticket.event.startDate) > now && 
          ticket.status !== 'cancelled'
        );
      case 'past':
        return tickets.filter(ticket => 
          new Date(ticket.event.endDate) < now || 
          ticket.status === 'used'
        );
      default:
        return tickets;
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
  
  // Abrir detalles del ticket
  const openTicketDetails = (ticketId: string) => {
    router.push(`/tickets/${ticketId}`);
  };
  
  // Renderizar un ticket
  const renderTicket = ({ item }: { item: Ticket }) => (
    <TouchableOpacity
      style={[styles.ticketItem, { backgroundColor: colors.card }]}
      onPress={() => openTicketDetails(item.id)}
    >
      {/* Imagen del evento */}
      <View style={styles.ticketImageContainer}>
        {item.event.image ? (
          <Image
            source={{ uri: item.event.image }}
            style={styles.ticketImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.placeholderImage, { backgroundColor: colors.border }]}>
            <Ionicons name="calendar-outline" size={32} color={colors.secondaryText} />
          </View>
        )}
      </View>
      
      {/* Detalles del ticket */}
      <View style={styles.ticketDetails}>
        {/* Título y estado */}
        <View style={styles.titleRow}>
          <Text
            style={[styles.eventTitle, { color: colors.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.event.title}
          </Text>
          
          {/* Indicador de estado */}
          <View style={styles.statusContainer}>
            {item.status === 'valid' && (
              <View style={[styles.statusBadge, { backgroundColor: colors.success + '20' }]}>
                <Text style={[styles.statusText, { color: colors.success }]}>Válido</Text>
              </View>
            )}
            
            {item.status === 'used' && (
              <View style={[styles.statusBadge, { backgroundColor: colors.secondaryText + '20' }]}>
                <Text style={[styles.statusText, { color: colors.secondaryText }]}>Usado</Text>
              </View>
            )}
            
            {item.status === 'expired' && (
              <View style={[styles.statusBadge, { backgroundColor: colors.error + '20' }]}>
                <Text style={[styles.statusText, { color: colors.error }]}>Expirado</Text>
              </View>
            )}
            
            {item.status === 'cancelled' && (
              <View style={[styles.statusBadge, { backgroundColor: colors.error + '20' }]}>
                <Text style={[styles.statusText, { color: colors.error }]}>Cancelado</Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Fecha y hora */}
        <View style={styles.detailRow}>
          <Ionicons name="calendar-outline" size={16} color={colors.secondaryText} />
          <Text style={[styles.detailText, { color: colors.secondaryText }]}>
            {formatDate(item.event.startDate)} · {formatTime(item.event.startDate)}
          </Text>
        </View>
        
        {/* Ubicación */}
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color={colors.secondaryText} />
          <Text 
            style={[styles.detailText, { color: colors.secondaryText }]}
            numberOfLines={1}
          >
            {item.event.location}
          </Text>
        </View>
        
        {/* Tipo de ticket */}
        <View style={styles.detailRow}>
          <Ionicons name="pricetag-outline" size={16} color={colors.secondaryText} />
          <Text style={[styles.detailText, { color: colors.secondaryText }]}>
            {item.ticketType}{item.seat ? ` · Asiento: ${item.seat}` : ''}
          </Text>
        </View>
      </View>
      
      {/* Icono de flecha */}
      <View style={styles.arrowContainer}>
        <Ionicons name="chevron-forward" size={20} color={colors.secondaryText} />
      </View>
    </TouchableOpacity>
  );
  
  // Renderizar separador entre tickets
  const renderSeparator = () => (
    <View style={styles.separator} />
  );
  
  // Renderizar mensaje cuando no hay tickets
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="ticket-outline" size={64} color={colors.secondaryText} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No tienes tickets {filter === 'upcoming' ? 'próximos' : filter === 'past' ? 'pasados' : ''}
      </Text>
      <Text style={[styles.emptySubtitle, { color: colors.secondaryText }]}>
        {filter === 'upcoming' 
          ? 'Compra tickets para próximos eventos' 
          : filter === 'past' 
            ? 'Tus tickets de eventos pasados aparecerán aquí' 
            : 'Compra tickets para eventos y aparecerán aquí'}
      </Text>
      
      <TouchableOpacity
        style={[styles.browseButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/')}
      >
        <Text style={styles.browseButtonText}>
          Explorar eventos
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Filtros */}
      <View style={[styles.filterContainer, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'upcoming' && { 
              backgroundColor: colors.primary + '20',
              borderColor: colors.primary
            }
          ]}
          onPress={() => setFilter('upcoming')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'upcoming' ? colors.primary : colors.text }
            ]}
          >
            Próximos
          </Text>
        </TouchableOpacity>
        
        <Divider orientation="vertical" style={styles.filterDivider} />
        
        <TouchableOpacity
          style={[
            styles.filterButton, 
            filter === 'past' && { 
              backgroundColor: colors.primary + '20',
              borderColor: colors.primary
            }
          ]}
          onPress={() => setFilter('past')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'past' ? colors.primary : colors.text }
            ]}
          >
            Pasados
          </Text>
        </TouchableOpacity>
        
        <Divider orientation="vertical" style={styles.filterDivider} />
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'all' && { 
              backgroundColor: colors.primary + '20',
              borderColor: colors.primary
            }
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'all' ? colors.primary : colors.text }
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Lista de tickets */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.secondaryText }]}>
            Cargando tickets...
          </Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredTickets()}
          renderItem={renderTicket}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={renderSeparator}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyList}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 12,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  filterDivider: {
    marginHorizontal: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  ticketItem: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketImageContainer: {
    width: 100,
    height: 120,
  },
  ticketImage: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketDetails: {
    flex: 1,
    padding: 12,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusContainer: {
    flexShrink: 0,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 6,
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingRight: 12,
  },
  separator: {
    height: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  browseButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
}); 