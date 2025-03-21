import React, { useState, useEffect } from 'react';
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
import { useRouter, Stack } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Ionicons } from '@expo/vector-icons';
import { mockService } from '../../src/services/mock.service';

export default function TicketsScreen() {
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar tickets
  const cargarTickets = async () => {
    try {
      setLoading(true);
      const userTickets = await mockService.getUserTickets();
      setTickets(userTickets);
    } catch (error) {
      console.error('Error al cargar tickets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarTickets();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    cargarTickets();
  };

  const formatearFecha = (fechaString) => {
    try {
      const fecha = new Date(fechaString);
      return format(fecha, "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch (error) {
      return fechaString;
    }
  };

  const renderTicket = ({ item }) => {
    const event = item.event;
    return (
      <TouchableOpacity
        style={styles.ticketContainer}
        onPress={() => router.push(`/events/${event.id}`)}
      >
        <View style={styles.ticketHeader}>
          <View>
            <Text style={styles.eventName}>{event.title}</Text>
            <Text style={styles.eventDate}>{formatearFecha(event.date)}</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {item.status === 'confirmed' ? 'Confirmado' : 'Pendiente'}
            </Text>
          </View>
        </View>
        
        <View style={styles.ticketContent}>
          <Image
            source={{ uri: event.image }}
            style={styles.eventImage}
            resizeMode="cover"
          />
          <View style={styles.ticketDetails}>
            <View style={styles.infoRow}>
              <Ionicons name="location" size={16} color="#0066CC" />
              <Text style={styles.infoText}>{event.location.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="time" size={16} color="#0066CC" />
              <Text style={styles.infoText}>
                {event.date.split('T')[1]?.split(':').slice(0, 2).join(':') || '18:00'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="barcode" size={16} color="#0066CC" />
              <Text style={styles.infoText}>Ticket #{item.code}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.ticketFooter}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="qr-code" size={14} color="#333" />
            <Text style={styles.actionButtonText}>Ver QR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-social" size={14} color="#333" />
            <Text style={styles.actionButtonText}>Compartir</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Cargando tickets...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: "Mis Tickets",
          headerBackTitle: "Perfil",
        }}
      />
      <View style={styles.container}>
        {tickets.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="ticket-outline" size={60} color="#CCCCCC" />
            <Text style={styles.emptyTitle}>No tienes tickets</Text>
            <Text style={styles.emptySubtitle}>
              Los tickets para eventos comprados aparecerán aquí
            </Text>
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
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={["#0066CC"]}
                tintColor="#0066CC"
              />
            }
          />
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  ticketContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: '#e6f7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  ticketContent: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  ticketDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 6,
  },
  ticketFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    marginLeft: 4,
  },
}); 