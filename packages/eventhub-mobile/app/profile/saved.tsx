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

import { useTheme } from '../../src/context/ThemeContext';
import { Divider } from '../../src/components/common/Divider';
import { bookmarkService } from '../../src/services/bookmark.service';
import { eventService } from '../../src/services/event.service';
import { authService } from '../../src/services/auth.service';

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

export default function SavedEventsScreen() {
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
  const renderContent = () => {
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
          Eventos Guardados
        </Text>
        
        <View style={styles.rightPlaceholder} />
      </View>
      
      <Divider />
      
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
  },
  eventCard: {
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  eventContent: {
    flex: 1,
    flexDirection: 'row',
  },
  eventImage: {
    width: 100,
    height: 100,
  },
  eventDetails: {
    flex: 1,
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  eventInfoText: {
    fontSize: 12,
    marginLeft: 4,
  },
  categoryTag: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#000000',
  },
  removeButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
  },
}); 