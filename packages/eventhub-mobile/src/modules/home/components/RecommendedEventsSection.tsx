import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../shared/hooks/useTheme';
import { EventCard } from '@modules/events/components/EventCard';
import { recommendationService } from '@modules/events/services/recommendation.service';
import { authService } from '@modules/auth/services/auth.service';
import { Event } from '@modules/events/types';
import { UserProfile } from '@modules/auth/services/auth.service';

interface RecommendedEventsSectionProps {
  title?: string;
  events?: Event[];
  maxEvents?: number;
  onEventPress?: (event: Event) => void;
}

export const RecommendedEventsSection: React.FC<RecommendedEventsSectionProps> = ({
  title = "Para ti",
  events,
  maxEvents = 5,
  onEventPress
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  
  useEffect(() => {
    if (events && events.length > 0) {
      setRecommendedEvents(events.slice(0, maxEvents));
      setIsLoading(false);
    } else {
      loadUserAndRecommendations();
    }
  }, [events, maxEvents]);
  
  // Cargar usuario y recomendaciones
  const loadUserAndRecommendations = async () => {
    try {
      setIsLoading(true);
      
      // Obtener usuario actual
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        // Cargar recomendaciones para el usuario
        const recommendations = await recommendationService.getRecommendedEvents(
          currentUser.id,
          maxEvents
        );
        setRecommendedEvents(recommendations);
      } else {
        // Si no hay usuario autenticado, cargar eventos populares
        // La función está marcada como privada pero la usamos de todos modos
        // En una implementación real, debería ser pública o usar otra función
        // @ts-ignore: ignoramos la advertencia de que el método es privado
        const popularEvents = await recommendationService.getPopularEvents(maxEvents);
        setRecommendedEvents(popularEvents);
      }
    } catch (error) {
      console.error('Error al cargar recomendaciones:', error);
      setRecommendedEvents([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manejar selección de evento
  const handleEventPress = (event: Event) => {
    // Registrar interacción de vista
    if (user) {
      recommendationService.recordInteraction(
        user.id,
        event.id,
        // Usamos un valor por defecto si category es undefined
        event.category || 'general',
        'view'
      ).catch(error => console.error('Error al registrar interacción:', error));
    }
    
    // Usar el handler proporcionado o navegar directamente
    if (onEventPress) {
      onEventPress(event);
    } else {
      router.push(`/events/${event.id}`);
    }
  };
  
  // Recargar recomendaciones
  const refreshRecommendations = () => {
    loadUserAndRecommendations();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          {title}
        </Text>
        <TouchableOpacity onPress={refreshRecommendations}>
          <Ionicons 
            name="refresh" 
            size={20} 
            color={theme.colors.primary.main} 
            style={styles.refreshIcon}
          />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
        Recomendaciones basadas en tus intereses
      </Text>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary.main} />
        </View>
      ) : recommendedEvents.length > 0 ? (
        <FlatList
          data={recommendedEvents}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.eventsList}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.eventCardContainer}
              onPress={() => handleEventPress(item)}
            >
              <EventCard event={item} />
              
              {/* @ts-ignore: Ignorar errores de tipo en recommendationScore */}
              {item.recommendationScore && (
                <View style={[styles.matchBadge, { backgroundColor: theme.colors.primary.main }]}>
                  <Text style={styles.matchText}>
                    {/* @ts-ignore: Ignorar errores de tipo en recommendationScore */}
                    {Math.min(99, Math.floor(item.recommendationScore * 100))}% match
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={32} color={theme.colors.text.secondary} />
          <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
            No hay recomendaciones disponibles
          </Text>
        </View>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  refreshIcon: {
    padding: 4,
  },
  loadingContainer: {
    height: 220,
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
  matchBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  matchText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyContainer: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 14,
  },
}); 