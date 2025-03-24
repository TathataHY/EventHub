import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { NearbyEventsSection } from './NearbyEventsSection';
import { RecommendedEventsSection } from './RecommendedEventsSection';
import { CategoriesSection } from './CategoriesSection';
import { WelcomeHeader } from './WelcomeHeader';
import { SearchInput } from '@shared/components/ui/SearchInput';
import { useRouter } from 'expo-router';
import { useUser } from '@modules/users/hooks/useUser';
import { useLocation } from '@modules/map/hooks/useLocation';
import { useTheme } from '@shared/hooks/useTheme';
import { getColorValue } from '@theme/theme.types';
import { ServiceEvent, eventService } from '@modules/events/services/event.service';
import { UserProfile } from '@modules/users/types';
import { Event } from '@modules/events/types';

// Interfaz para categorías
interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}

/**
 * Pantalla principal de la aplicación
 */
export function HomeScreen() {
  const router = useRouter();
  const { currentUser } = useUser();
  const { location } = useLocation();
  const { theme } = useTheme();
  
  // Estados para los eventos y categorías
  const [featuredEvents, setFeaturedEvents] = useState<ServiceEvent[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<ServiceEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cargar datos al montar el componente
  useEffect(() => {
    loadEvents();
    loadCategories();
  }, []);
  
  // Cargar eventos destacados y cercanos
  const loadEvents = async () => {
    try {
      // Cargar eventos destacados
      const events = await eventService.getFeaturedEvents();
      setFeaturedEvents(events);
      
      // Cargar eventos cercanos si hay ubicación
      if (location) {
        const nearby = await eventService.getNearbyEvents(
          location.coords.latitude,
          location.coords.longitude,
          10 // Radio en kilómetros
        );
        setNearbyEvents(nearby);
      }
    } catch (err: any) {
      console.error('Error loading events:', err);
    }
  };
  
  // Cargar categorías disponibles
  const loadCategories = async () => {
    try {
      // Como no existe category.service, simulamos una carga de categorías
      // En un caso real, aquí se llamaría al servicio correspondiente
      const dummyCategories: Category[] = [
        { id: '1', name: 'Música', icon: 'musical-notes-outline', color: '#FF5722' },
        { id: '2', name: 'Deportes', icon: 'football-outline', color: '#4CAF50' },
        { id: '3', name: 'Arte', icon: 'color-palette-outline', color: '#9C27B0' },
        { id: '4', name: 'Tecnología', icon: 'hardware-chip-outline', color: '#2196F3' },
        { id: '5', name: 'Gastronomía', icon: 'restaurant-outline', color: '#FFC107' }
      ];
      setCategories(dummyCategories);
    } catch (err: any) {
      console.error('Error al cargar categorías:', err);
    }
  };
  
  // Manejar refresco de pantalla
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadEvents(), loadCategories()]);
    setRefreshing(false);
  };
  
  // Manejar cambio en el input de búsqueda
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };
  
  // Manejar submit de búsqueda
  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/events/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  // Manejar press en un evento destacado
  const handleFeaturedEventPress = (event: Event) => {
    router.push(`/events/${event.id}`);
  };
  
  // Manejar press en un evento cercano
  const handleNearbyEventPress = (event: Event) => {
    router.push(`/events/${event.id}`);
  };
  
  // Manejar press en una categoría
  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    router.push(`/events/category/${categoryId}?name=${encodeURIComponent(categoryName)}`);
  };
  
  // Convertir ServiceEvent a Event para RecommendedEventsSection
  const convertToEvent = (event: ServiceEvent): Event => {
    return {
      id: String(event.id),
      title: event.title,
      description: event.description || '',
      imageUrl: event.imageUrl || event.image,
      startDate: event.startDate,
      endDate: event.endDate || '',
      location: event.location,
      price: event.price || 0,
      category: event.category || '',
      organizerId: String(event.organizerId)
    };
  };
  
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[getColorValue(theme.colors.primary.main)]}
          />
        }
      >
        {/* Header de bienvenida */}
        <WelcomeHeader 
          userName={currentUser?.name || currentUser?.fullName || 'Usuario'}
          userAvatar={currentUser?.photoURL || currentUser?.profileImage}
        />
        
        {/* Búsqueda */}
        <SearchInput
          placeholder="Buscar eventos, artistas, locales..."
          value={searchQuery}
          onChangeText={handleSearchChange}
          onSubmitEditing={handleSearchSubmit}
          containerStyle={styles.searchContainer}
        />
        
        {/* Categorías */}
        <CategoriesSection
          categories={categories}
          onCategoryPress={handleCategoryPress}
        />
        
        {/* Eventos destacados */}
        <RecommendedEventsSection
          title="Eventos destacados"
          events={featuredEvents.map(event => convertToEvent(event))}
          onEventPress={handleFeaturedEventPress}
        />
        
        {/* Eventos cercanos */}
        {nearbyEvents.length > 0 && (
          <NearbyEventsSection
            title="Eventos cerca de ti"
            events={nearbyEvents}
            onEventPress={handleNearbyEventPress}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
}); 