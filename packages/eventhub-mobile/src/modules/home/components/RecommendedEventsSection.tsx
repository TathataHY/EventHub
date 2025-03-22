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

import { useTheme } from '../../context/ThemeContext';
import { EventCard } from '../event/EventCard';
import { recommendationService } from '../../services/recommendation.service';
import { authService } from '../../services/auth.service';

interface RecommendedEventsSectionProps {
  maxEvents?: number;
}

export const RecommendedEventsSection: React.FC<RecommendedEventsSectionProps> = ({
  maxEvents = 5
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [recommendedEvents, setRecommendedEvents] = useState<any[]>([]);
  const [user, setUser] = useState<{ id: string } | null>(null);
  
  useEffect(() => {
    loadUserAndRecommendations();
  }, []);
  
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
        const popularEvents = await recommendationService.getRecommendedEvents(
          'guest',
          maxEvents
        );
        setRecommendedEvents(popularEvents);
      }
    } catch (error) {
      console.error('Error al cargar recomendaciones:', error);
      setRecommendedEvents([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navegar a la pantalla de evento
  const navigateToEvent = (eventId: string) => {
    // Registrar interacción de vista
    if (user) {
      const event = recommendedEvents.find(e => e.id === eventId);
      if (event) {
        recommendationService.recordInteraction(
          user.id,
          eventId,
          event.category,
          'view'
        ).catch(error => console.error('Error al registrar interacción:', error));
      }
    }
    
    // Navegar al evento
    router.push(`/events/evento/${eventId}`);
  };
  
  // Recargar recomendaciones
  const refreshRecommendations = () => {
    loadUserAndRecommendations();
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Para ti
        </Text>
        <TouchableOpacity onPress={refreshRecommendations}>
          <Ionicons 
            name="refresh" 
            size={20} 
            color={theme.colors.primary} 
            style={styles.refreshIcon}
          />
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.subtitle, { color: theme.colors.secondaryText }]}>
        Recomendaciones basadas en tus intereses
      </Text>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.colors.primary} />
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
              onPress={() => navigateToEvent(item.id)}
            >
              <EventCard event={item} />
              
              {item.recommendationScore && (
                <View style={[styles.matchBadge, { backgroundColor: theme.colors.primary }]}>
                  <Text style={styles.matchText}>
                    {Math.min(99, Math.floor(item.recommendationScore * 2))}% match
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={32} color={theme.colors.secondaryText} />
          <Text style={[styles.emptyText, { color: theme.colors.secondaryText }]}>
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