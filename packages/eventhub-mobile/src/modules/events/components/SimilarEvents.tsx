import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '@core/context/ThemeContext';
import { EventCard } from './EventCard';
import { Event } from '@modules/events/types';
import { recommendationService } from '@modules/events/services/recommendation.service';
import { authService } from '@modules/auth/services/auth.service';
import { eventService } from '@modules/events/services/event.service';

interface SimilarEventsProps {
  currentEventId: string;
  maxEvents?: number;
}

interface SimilarEvent extends Event {
  similarityScore?: number;
}

export const SimilarEvents: React.FC<SimilarEventsProps> = ({
  currentEventId,
  maxEvents = 3
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [similarEvents, setSimilarEvents] = useState<SimilarEvent[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);
  
  useEffect(() => {
    loadUserAndSimilarEvents();
  }, [currentEventId]);
  
  // Cargar usuario y eventos similares
  const loadUserAndSimilarEvents = async () => {
    try {
      setIsLoading(true);
      
      // Obtener usuario actual
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      
      // Obtener el evento actual
      const currentEvent = await eventService.getEventById(currentEventId);
      if (!currentEvent) {
        setSimilarEvents([]);
        return;
      }
      
      // Obtener todos los eventos para pasarlos al servicio
      const allEvents = await eventService.getAllEvents();
      
      // Cargar eventos similares con el nuevo método
      const userId = currentUser ? currentUser.id : 'guest';
      const events = await recommendationService.getSimilarEvents(
        userId,
        currentEvent,
        allEvents,
        maxEvents
      );
      
      setSimilarEvents(events as SimilarEvent[]);
    } catch (error) {
      console.error('Error al cargar eventos similares:', error);
      setSimilarEvents([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navegar a la pantalla de evento
  const navigateToEvent = (eventId: string) => {
    // Registrar interacción de vista
    if (user) {
      const event = similarEvents.find(e => e.id === eventId);
      if (event) {
        let categoryValue = '';
        
        // Handle different category formats
        if (typeof event.category === 'string') {
          categoryValue = event.category;
        } else if (event.category && typeof event.category === 'object') {
          // Using optional chaining and type assertion to avoid type errors
          const categoryObject = event.category as {name?: string};
          categoryValue = categoryObject.name || '';
        }

        // Obtener la ubicación del evento para pasarla como parámetro
        const eventLocation = event.location && typeof event.location === 'object' 
          ? event.location 
          : undefined;

        recommendationService.recordInteraction(
          user.id,
          eventId,
          categoryValue,
          'view',
          eventLocation
        ).catch(error => console.error('Error al registrar interacción:', error));
      }
    }
    
    // Navegar al evento
    router.push(`/events/${eventId}`);
  };
  
  // Si no hay eventos similares, no mostrar nada
  if (similarEvents.length === 0 && !isLoading) {
    return null;
  }
  
  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        Te podría interesar
      </Text>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary.main} />
        </View>
      ) : (
        <FlatList
          data={similarEvents}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsList}
          renderItem={({ item }) => (
            <View style={styles.eventCardContainer}>
              <EventCard 
                event={item} 
                onPress={() => navigateToEvent(item.id.toString())}
              />
              
              {/* Si hay puntuación de similitud, mostrar insignia */}
              {item.similarityScore && item.similarityScore > 0 && (
                <View 
                  style={[
                    styles.similarityBadge, 
                    { backgroundColor: theme.colors.background.card }
                  ]}
                >
                  {item.category === similarEvents[0].category && (
                    <View style={styles.reasonContainer}>
                      <Ionicons name="pricetag" size={12} color={theme.colors.primary.main} />
                      <Text style={[styles.reasonText, { color: theme.colors.text.primary }]}>
                        Misma categoría
                      </Text>
                    </View>
                  )}
                  
                  {item.organizerId === similarEvents[0].organizerId && (
                    <View style={styles.reasonContainer}>
                      <Ionicons name="person" size={12} color={theme.colors.primary.main} />
                      <Text style={[styles.reasonText, { color: theme.colors.text.primary }]}>
                        Mismo organizador
                      </Text>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventsList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  eventCardContainer: {
    width: width * 0.7,
    marginRight: 12,
    position: 'relative',
  },
  similarityBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  reasonText: {
    fontSize: 12,
    marginLeft: 4,
  }
}); 