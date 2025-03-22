import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { useTheme } from '@core/context/ThemeContext';
import { bookmarkService } from '@modules/events/services/bookmark.service';
import { eventService } from '@modules/events/services/event.service';
import { authService } from '@modules/auth/services/auth.service';

// Interfaz para los eventos
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  location: string;
  price: number;
  category: string;
  organizer: string;
}

export function SavedEventsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  
  // Cargar usuario actual y eventos guardados
  useEffect(() => {
    loadUserAndSavedEvents();
  }, []);

  // Cargar usuario y sus eventos guardados
  const loadUserAndSavedEvents = async () => {
    try {
      setIsLoading(true);
      
      // Obtener usuario actual
      const user = await authService.getCurrentUser();
      if (!user) {
        router.replace('/auth/login');
        return;
      }
      
      setCurrentUser(user);
      
      // Cargar eventos guardados
      await loadSavedEvents(user.id);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar eventos guardados
  const loadSavedEvents = async (userId: string) => {
    try {
      // Obtener IDs de eventos guardados
      const bookmarkedEventIds = await bookmarkService.getUserBookmarks(userId);
      
      if (bookmarkedEventIds.length === 0) {
        setSavedEvents([]);
        return;
      }
      
      // Obtener detalles de cada evento
      const events: Event[] = [];
      
      for (const eventId of bookmarkedEventIds) {
        try {
          const eventDetails = await eventService.getEventById(eventId);
          if (eventDetails) {
            events.push(eventDetails);
          }
        } catch (eventError) {
          console.error(`Error al obtener evento ${eventId}:`, eventError);
          // Continuar con el siguiente evento
        }
      }
      
      setSavedEvents(events);
    } catch (error) {
      console.error('Error al cargar eventos guardados:', error);
      setSavedEvents([]);
    }
  };

  // Manejar actualización (pull to refresh)
  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (currentUser) {
      await loadSavedEvents(currentUser.id);
    }
    setIsRefreshing(false);
  };

  // Eliminar un evento de favoritos
  const handleRemoveBookmark = async (eventId: string) => {
    if (!currentUser) return;
    
    try {
      await bookmarkService.removeBookmark(currentUser.id, eventId);
      
      // Actualizar lista de eventos guardados
      setSavedEvents(currentEvents => 
        currentEvents.filter(event => event.id !== eventId)
      );
    } catch (error) {
      console.error('Error al eliminar favorito:', error);
    }
  };

  // Navegar al detalle del evento
  const navigateToEventDetails = (eventId: string) => {
    router.push(`/events/evento/${eventId}`);
  };

  // Formatear fecha del evento
  const formatEventDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM, yyyy", { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  // Renderizar un elemento de evento
  const renderEventItem = ({ item }: { item: Event }) => (
    <View style={[styles.eventCard, { backgroundColor: theme.colors.card }]}>
      <TouchableOpacity
        style={styles.eventContent}
        onPress={() => navigateToEventDetails(item.id)}
      >
        <Image
          source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
          style={styles.eventImage}
          resizeMode="cover"
        />
        
        <View style={styles.eventDetails}>
          <Text 
            style={[styles.eventTitle, { color: theme.colors.text }]} 
            numberOfLines={2}
          >
            {item.title}
          </Text>
          
          <View style={styles.eventInfo}>
            <Ionicons name="calendar-outline" size={14} color={theme.colors.secondaryText} />
            <Text style={[styles.eventInfoText, { color: theme.colors.secondaryText }]}>
              {formatEventDate(item.date)}
            </Text>
          </View>
          
          <View style={styles.eventInfo}>
            <Ionicons name="location-outline" size={14} color={theme.colors.secondaryText} />
            <Text 
              style={[styles.eventInfoText, { color: theme.colors.secondaryText }]} 
              numberOfLines={1}
            >
              {item.location}
            </Text>
          </View>
          
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>
              {item.category}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[styles.removeButton, { borderColor: theme.colors.primary }]}
        onPress={() => handleRemoveBookmark(item.id)}
      >
        <Ionicons name="bookmark" size={20} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );

  // Renderizar contenido principal
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.secondaryText }]}>
          Cargando eventos guardados...
        </Text>
      </View>
    );
  }

  if (savedEvents.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="bookmark-outline" size={64} color={theme.colors.secondaryText} />
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          No tienes eventos guardados
        </Text>
        <Text style={[styles.emptySubText, { color: theme.colors.secondaryText }]}>
          Los eventos que guardes aparecerán aquí
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

  return (
    <FlatList
      data={savedEvents}
      renderItem={renderEventItem}
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
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContainer: {
    padding: 16,
  },
  separator: {
    height: 16,
  },
  eventCard: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventContent: {
    flexDirection: 'row',
    padding: 12,
  },
  eventImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#eee',
  },
  eventDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventInfoText: {
    fontSize: 12,
    marginLeft: 4,
  },
  categoryTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  categoryText: {
    fontSize: 10,
    color: '#666',
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
  },
}); 