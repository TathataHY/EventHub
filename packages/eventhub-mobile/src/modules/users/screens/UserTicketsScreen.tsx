import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { mockService } from '@core/services/mock.service';
import { appColors, appTypography, appSpacing, convertTypographyStyle } from '@theme/index';
import { Card } from '@shared/components/ui';
import { userService } from '../services/user.service';
import { ticketService } from '@modules/tickets/services/ticket.service';

// Definir la interfaz Ticket
interface Ticket {
  id: string;
  eventId: string;
  eventName: string;
  eventDate: string;
  eventImage?: string;
  userId: string;
  purchaseDate: string;
  status: string;
  qrCode: string;
  price: number;
  currency: string;
  ticketType: string;
  location: string;
  time: string;
}

/**
 * Pantalla que muestra los tickets del usuario
 */
export const UserTicketsScreen = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadUserTickets();
  }, []);

  const loadUserTickets = async () => {
    try {
      setLoading(true);
      // Obtener el perfil del usuario actual
      const currentUser = await userService.getCurrentUserProfile();
      // Obtener sus tickets
      const userTickets = await ticketService.getUserTickets(currentUser.id);
      // Añadir propiedades adicionales para cumplir con la interfaz Ticket
      const completeTickets = userTickets.map((ticket) => ({
        ...ticket,
        eventName: ticket.eventName || 'Evento sin nombre',
        eventDate: ticket.eventDate || new Date().toISOString(),
        ticketType: ticket.ticketType || 'General',
        location: ticket.location || 'Por definir',
        time: ticket.time || '00:00'
      }));
      setTickets(completeTickets);
    } catch (error) {
      console.error('Error al cargar tickets del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadUserTickets();
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'usado':
        return appColors.grey[500];
      case 'activo':
        return appColors.success.main;
      case 'cancelado':
        return appColors.error.main;
      case 'expirado':
        return appColors.warning.main;
      default:
        return appColors.grey[500];
    }
  };

  const handleTicketPress = (ticketId: string) => {
    router.push(`/profile/tickets/${ticketId}`);
  };

  const renderTicket = ({ item }: { item: Ticket }) => {
    return (
      <TouchableOpacity 
        style={styles.ticketContainer}
        onPress={() => handleTicketPress(item.id)}
      >
        <Card style={styles.ticket}>
          <View style={styles.ticketHeader}>
            <View style={styles.eventImageContainer}>
              {item.eventImage ? (
                <Image 
                  source={{ uri: item.eventImage }} 
                  style={styles.eventImage as any}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="calendar" size={24} color={appColors.grey[400]} />
                </View>
              )}
            </View>
            
            <View style={styles.ticketInfo}>
              <Text style={styles.eventName} numberOfLines={1}>{item.eventName}</Text>
              <Text style={styles.eventDate}>{formatDate(item.eventDate)}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.ticketFooter}>
            <View style={styles.ticketDetail}>
              <Ionicons name="location-outline" size={16} color={appColors.grey[600]} />
              <Text style={styles.detailText} numberOfLines={1}>{item.location}</Text>
            </View>
            
            <View style={styles.ticketDetail}>
              <Ionicons name="time-outline" size={16} color={appColors.grey[600]} />
              <Text style={styles.detailText}>{item.time}</Text>
            </View>
            
            <View style={styles.ticketDetail}>
              <Ionicons name="pricetag-outline" size={16} color={appColors.grey[600]} />
              <Text style={styles.detailText}>{item.ticketType}</Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={appColors.primary.main} />
        <Text style={styles.loaderText}>Cargando tickets...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Tickets</Text>
      
      {tickets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="ticket-outline" size={64} color={appColors.grey[300]} />
          <Text style={styles.emptyText}>No tienes tickets actualmente</Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => router.push('/events')}
          >
            <Text style={styles.exploreButtonText}>Explorar eventos</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={tickets}
          renderItem={renderTicket}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[appColors.primary.main]}
              tintColor={appColors.primary.main}
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
    backgroundColor: appColors.background,
    padding: appSpacing.md,
  },
  title: {
    ...convertTypographyStyle(appTypography.h4),
    color: appColors.text,
    marginBottom: appSpacing.md,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.background,
  },
  loaderText: {
    ...convertTypographyStyle(appTypography.body1),
    color: appColors.text,
    marginTop: appSpacing.md,
  },
  listContainer: {
    paddingBottom: appSpacing.xl,
  },
  ticketContainer: {
    marginBottom: appSpacing.md,
  },
  ticket: {
    padding: 0,
    overflow: 'hidden',
  },
  ticketHeader: {
    flexDirection: 'row',
    padding: appSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: appColors.grey[200],
  },
  eventImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: appSpacing.md,
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: appColors.grey[200],
    justifyContent: 'center',
    alignItems: 'center',
  },
  ticketInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  eventName: {
    ...convertTypographyStyle(appTypography.subtitle1),
    color: appColors.text,
    marginBottom: 2,
    fontWeight: "600" as const,
  },
  eventDate: {
    ...convertTypographyStyle(appTypography.body2),
    color: appColors.grey[600],
    marginBottom: 6,
    fontWeight: "normal" as const,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    ...appTypography.caption,
    color: appColors.common.white,
    fontWeight: "bold" as const,
  },
  ticketFooter: {
    padding: appSpacing.md,
    backgroundColor: appColors.grey[50],
  },
  ticketDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    ...appTypography.body2,
    color: appColors.grey[700],
    marginLeft: 8,
    fontWeight: "normal" as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...convertTypographyStyle(appTypography.body1),
    color: appColors.grey[500],
    marginTop: appSpacing.md,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: appColors.primary.main,
    paddingVertical: appSpacing.sm,
    paddingHorizontal: appSpacing.lg,
    borderRadius: 8,
  },
  exploreButtonText: {
    ...convertTypographyStyle(appTypography.button1),
    color: appColors.common.white,
    fontWeight: "600" as const,
  },
}); 