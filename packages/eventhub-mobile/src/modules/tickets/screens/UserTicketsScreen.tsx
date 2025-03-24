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

// Importamos las utilidades del core
import { useTheme } from '@core/context/ThemeContext';
import { ticketService } from '../services';
import { useAuth } from '@modules/auth/hooks/useAuth';
import { Divider } from '../../../shared/components';
import { Ticket, TicketStatus } from '../types';

/**
 * Pantalla para mostrar los tickets del usuario actual
 */
export const UserTicketsScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { currentUser } = useAuth();
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('upcoming');
  const [error, setError] = useState<string | null>(null);
  
  // Cargar tickets del usuario
  useEffect(() => {
    loadUserTickets();
  }, [currentUser]);
  
  // Cargar tickets del usuario
  const loadUserTickets = async () => {
    try {
      setIsLoading(true);
      
      // Verificar si el usuario está autenticado
      if (!currentUser) {
        router.replace('/auth/login');
        return;
      }
      
      // Obtener tickets del usuario
      const userTickets = await ticketService.getUserTickets((currentUser as any).id);
      setTickets(userTickets);
    } catch (error: any) {
      console.error('Error loading user tickets:', error);
      setError(error.message || 'No se pudieron cargar los tickets');
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
          ticket.event?.startDate && new Date(ticket.event.startDate) > now && 
          ticket.status !== 'cancelled'
        );
      case 'past':
        return tickets.filter(ticket => 
          (ticket.event?.endDate && new Date(ticket.event.endDate) < now) || 
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
  
  // Obtener texto de estado
  const getStatusText = (status: TicketStatus): string => {
    switch (status) {
      case 'valid':
        return 'Válido';
      case 'used':
        return 'Utilizado';
      case 'cancelled':
        return 'Cancelado';
      case 'expired':
        return 'Expirado';
      default:
        return 'Desconocido';
    }
  };
  
  // Obtener color de estado
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'valid':
        return theme.colors.success.main;
      case 'pending':
        return theme.colors.warning.main;
      case 'used':
        return theme.colors.error.main;
      case 'expired':
        return theme.colors.error.main;
      default:
        return theme.colors.text.secondary;
    }
  };
  
  // Renderizar un ticket
  const renderTicket = ({ item }: { item: Ticket }) => (
    <TouchableOpacity
      style={[styles.ticketItem, {
        backgroundColor: theme.colors.background.paper,
        borderColor: theme.colors.grey[300]
      }]}
      onPress={() => openTicketDetails(item.id)}
    >
      {/* Imagen del evento */}
      <View style={styles.ticketImageContainer}>
        {item.event?.image ? (
          <Image
            source={{ uri: item.event.image }}
            style={styles.ticketImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[
            styles.ticketImagePlaceholder, 
            { backgroundColor: theme.colors.primary.light }
          ]}>
            <Ionicons name="ticket-outline" size={32} color={theme.colors.primary.main} />
          </View>
        )}
      </View>
      
      {/* Detalles del ticket */}
      <View style={styles.ticketDetails}>
        {/* Información del evento */}
        <Text style={[styles.eventTitle, { color: theme.colors.text.primary }]} numberOfLines={1}>
          {item.event?.title || 'Evento sin título'}
        </Text>
        
        <View style={styles.ticketMeta}>
          {/* Fecha */}
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color={theme.colors.primary.main} />
            <Text style={[styles.metaText, { color: theme.colors.text.secondary }]}>
              {item.event?.startDate ? formatDate(item.event.startDate) : 'Fecha no disponible'}
            </Text>
          </View>
          
          {/* Ubicación */}
          {item.event?.location && (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={14} color={theme.colors.primary.main} />
              <Text style={[styles.metaText, { color: theme.colors.text.secondary }]} numberOfLines={1}>
                {item.event.location}
              </Text>
            </View>
          )}
          
          {/* Tipo de ticket */}
          <View style={styles.metaItem}>
            <Ionicons name="pricetag-outline" size={14} color={theme.colors.primary.main} />
            <Text style={[styles.metaText, { color: theme.colors.text.secondary }]}>
              {item.ticketType}{item.seat ? ` · Asiento: ${item.seat}` : ''}
            </Text>
          </View>
        </View>
        
        {/* Estado del ticket */}
        <View style={[
          styles.statusBadge, 
          { backgroundColor: getStatusColor(item.status) + '20' }
        ]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
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
      <Ionicons name="ticket-outline" size={64} color={theme.colors.text.secondary} />
      <Text style={[styles.emptyTitle, { color: theme.colors.text.primary }]}>
        No tienes tickets {filter === 'upcoming' ? 'próximos' : filter === 'past' ? 'pasados' : ''}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.text.secondary }]}>
        {filter === 'upcoming' 
          ? 'Compra tickets para próximos eventos' 
          : filter === 'past' 
            ? 'Tus tickets de eventos pasados aparecerán aquí' 
            : 'Compra tickets para eventos y aparecerán aquí'}
      </Text>
      
      <TouchableOpacity
        style={[styles.browseButton, { backgroundColor: theme.colors.primary.main }]}
        onPress={() => router.push('/')}
      >
        <Text style={styles.browseButtonText}>
          Explorar eventos
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      {/* Filtros */}
      <View 
        style={[
          styles.filterContainer, 
          { 
            backgroundColor: theme.colors.background.paper,
            borderColor: theme.colors.grey[300]
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.filterButton,
            filter === 'upcoming' && { 
              backgroundColor: theme.colors.primary.light,
              borderColor: theme.colors.primary.main
            }
          ]}
          onPress={() => setFilter('upcoming')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'upcoming' ? theme.colors.primary.main : theme.colors.text.primary }
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
              backgroundColor: theme.colors.primary.light,
              borderColor: theme.colors.primary.main
            }
          ]}
          onPress={() => setFilter('past')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'past' ? theme.colors.primary.main : theme.colors.text.primary }
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
              backgroundColor: theme.colors.primary.light,
              borderColor: theme.colors.primary.main
            }
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterText,
              { color: filter === 'all' ? theme.colors.primary.main : theme.colors.text.primary }
            ]}
          >
            Todos
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Lista de tickets */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
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
              colors={[theme.colors.primary.main]}
              tintColor={theme.colors.primary.main}
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
  ticketImagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketDetails: {
    flex: 1,
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  ticketMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaText: {
    fontSize: 12,
    marginLeft: 6,
  },
  statusBadge: {
    flexShrink: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
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