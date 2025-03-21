import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../src/context/ThemeContext';
import { Divider } from '../../../src/components/common/Divider';
import { TicketCard } from '../../../src/components/tickets/TicketCard';
import { ticketService, Ticket, TicketStatus } from '../../../src/services/ticket.service';
import { eventService } from '../../../src/services/event.service';
import { authService } from '../../../src/services/auth.service';

/**
 * Tipo de filtro para los tickets
 */
type TicketFilter = 'all' | 'upcoming' | 'past';

export default function TicketsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [activeFilter, setActiveFilter] = useState<TicketFilter>('all');
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  
  // Información de eventos para mostrar nombre e imagen
  const [eventDetails, setEventDetails] = useState<Record<string, { 
    title: string; 
    imageUrl: string; 
  }>>({});
  
  // Cargar usuario actual y sus tickets
  useEffect(() => {
    loadUserAndTickets();
  }, []);
  
  // Filtrar tickets cuando cambie el filtro o los tickets
  useEffect(() => {
    filterTickets(activeFilter);
  }, [tickets, activeFilter]);
  
  // Cargar usuario y sus tickets
  const loadUserAndTickets = async () => {
    try {
      setIsLoading(true);
      
      // Obtener usuario actual
      const user = await authService.getCurrentUser();
      if (!user) {
        router.replace('/auth/login');
        return;
      }
      
      setCurrentUser(user);
      
      // Cargar tickets
      await loadTickets(user.id);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Cargar los tickets del usuario
  const loadTickets = async (userId: string) => {
    try {
      // Añadir tickets de ejemplo para desarrollo
      await ticketService.addSampleTickets(userId);
      
      // Obtener tickets del usuario
      const userTickets = await ticketService.getUserTickets(userId);
      setTickets(userTickets);
      
      // Obtener detalles de los eventos asociados a los tickets
      const eventsData: Record<string, { title: string; imageUrl: string }> = {};
      
      for (const ticket of userTickets) {
        if (!eventsData[ticket.eventId]) {
          try {
            const eventData = await eventService.getEventById(ticket.eventId);
            if (eventData) {
              eventsData[ticket.eventId] = {
                title: eventData.title,
                imageUrl: eventData.imageUrl
              };
            }
          } catch (eventError) {
            console.error(`Error al obtener evento ${ticket.eventId}:`, eventError);
          }
        }
      }
      
      setEventDetails(eventsData);
    } catch (error) {
      console.error('Error al cargar tickets:', error);
    }
  };
  
  // Filtrar tickets según el criterio seleccionado
  const filterTickets = (filter: TicketFilter) => {
    if (!tickets.length) {
      setFilteredTickets([]);
      return;
    }
    
    let filtered: Ticket[];
    
    switch (filter) {
      case 'upcoming':
        // Tickets válidos (próximos eventos)
        filtered = tickets.filter(ticket => ticket.status === TicketStatus.VALID);
        break;
      case 'past':
        // Tickets usados o expirados (eventos pasados)
        filtered = tickets.filter(ticket => 
          ticket.status === TicketStatus.USED || 
          ticket.status === TicketStatus.EXPIRED ||
          ticket.status === TicketStatus.CANCELLED
        );
        break;
      case 'all':
      default:
        // Todos los tickets
        filtered = [...tickets];
        break;
    }
    
    // Ordenar por fecha de compra (más recientes primero)
    filtered.sort((a, b) => 
      new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
    );
    
    setFilteredTickets(filtered);
  };
  
  // Manejar actualización (pull to refresh)
  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (currentUser) {
      await loadTickets(currentUser.id);
    }
    setIsRefreshing(false);
  };
  
  // Navegar al detalle del ticket
  const navigateToTicketDetail = (ticketId: string) => {
    router.push(`/profile/tickets/${ticketId}`);
  };
  
  // Renderizar chip de filtro
  const renderFilterChip = (filter: TicketFilter, label: string) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        activeFilter === filter && { 
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary
        }
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text style={[
        styles.filterChipText,
        activeFilter === filter ? { color: '#FFFFFF' } : { color: theme.colors.text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  // Renderizar contenido principal
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.secondaryText }]}>
            Cargando tickets...
          </Text>
        </View>
      );
    }
    
    if (tickets.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="ticket-outline" size={64} color={theme.colors.secondaryText} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            No tienes tickets
          </Text>
          <Text style={[styles.emptySubText, { color: theme.colors.secondaryText }]}>
            Los tickets de eventos aparecerán aquí cuando te registres en un evento
          </Text>
          <TouchableOpacity
            style={[styles.browseButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push('/events')}
          >
            <Text style={styles.browseButtonText}>Explorar eventos</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    if (filteredTickets.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Ionicons name="search-outline" size={64} color={theme.colors.secondaryText} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            No hay tickets que coincidan con el filtro
          </Text>
          <TouchableOpacity
            style={[styles.browseButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => setActiveFilter('all')}
          >
            <Text style={styles.browseButtonText}>Ver todos los tickets</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <FlatList
        data={filteredTickets}
        renderItem={({ item }) => (
          <TicketCard
            ticket={item}
            eventName={eventDetails[item.eventId]?.title || 'Evento'}
            eventImage={eventDetails[item.eventId]?.imageUrl}
            onPress={navigateToTicketDetail}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
    );
  };
  
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
          Mis Tickets
        </Text>
        
        <View style={styles.rightPlaceholder} />
      </View>
      
      <Divider />
      
      {/* Filtros */}
      {!isLoading && tickets.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {renderFilterChip('all', 'Todos')}
          {renderFilterChip('upcoming', 'Próximos')}
          {renderFilterChip('past', 'Historial')}
        </ScrollView>
      )}
      
      {/* Contenido principal */}
      {renderContent()}
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
  filtersContainer: {
    padding: 12,
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
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
  browseButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  separator: {
    height: 12,
  }
}); 