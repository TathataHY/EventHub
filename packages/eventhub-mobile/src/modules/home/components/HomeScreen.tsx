import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../shared/hooks/useTheme';

// Componentes
import { NearbyEventsSection } from '@modules/home/components/NearbyEventsSection';
import { RecommendedEventsSection } from '@modules/home/components/RecommendedEventsSection';

// Servicios
import { eventService } from '@modules/events/services/event.service';
import { authService } from '@modules/auth/services/auth.service';

// Tipos
import { Event } from '@modules/events/types';
import { User } from '@modules/users/types';

const HomeScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<any[]>([]);
  const [recommendedEvents, setRecommendedEvents] = useState<any[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Categorías predefinidas
  const categories = [
    { id: '1', name: 'Música', icon: 'musical-notes' },
    { id: '2', name: 'Deportes', icon: 'football' },
    { id: '3', name: 'Arte', icon: 'color-palette' },
    { id: '4', name: 'Tecnología', icon: 'code-slash' },
    { id: '5', name: 'Gastronomía', icon: 'restaurant' },
    { id: '6', name: 'Educación', icon: 'school' }
  ];

  // Función para cargar datos
  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Cargar eventos destacados
      const featured = await eventService.getFeaturedEvents();
      setFeaturedEvents(featured);
      
      // Cargar eventos cercanos
      const nearby = await eventService.getNearbyEvents();
      setNearbyEvents(nearby);
      
      // Cargar usuario actual
      const user = await authService.getCurrentUser();
      setUser(user);
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  // Función para refrescar datos
  const onRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  // Renderizar pantalla de carga
  if (isLoading && !isRefreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>
          Cargando eventos...
        </Text>
      </View>
    );
  }

  // Renderizar evento destacado
  const handleFeaturedEventPress = (event: any) => {
    // @ts-ignore: Ignorar errores de tipo en la navegación
    navigation.navigate('EventDetail', { event });
  };

  // Navegar a evento cercano
  const handleNearbyEventPress = (event: any) => {
    // @ts-ignore: Ignorar errores de tipo en la navegación
    navigation.navigate('EventDetail', { event });
  };

  // Renderizar categorías
  const renderCategories = () => {
    return (
      <View style={styles.categoriesContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Categorías
          </Text>
          <TouchableOpacity>
            <Text style={[styles.viewAll, { color: theme.colors.primary.main }]}>
              Ver todas
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: theme.colors.background.default }]}
              onPress={() => console.log(`Categoría seleccionada: ${category.name}`)}
            >
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary.main]}
            tintColor={theme.colors.primary.main}
          />
        }
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.text.primary }]}>
              Hola, {user?.name?.split(' ')[0] || 'Usuario'}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
              ¿Qué evento te interesa hoy?
            </Text>
          </View>
          
          {/* Botones de notificaciones y perfil */}
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[
                styles.profileButton,
                { backgroundColor: theme.colors.background.default }
              ]}
              // @ts-ignore: Ignorar errores de tipo en la navegación
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-circle-outline" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.background.default }
              ]}
              onPress={() => navigation.navigate('CreateEvent')}
            >
              <Ionicons name="add-circle-outline" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: theme.colors.background.default }
              ]}
              onPress={() => navigation.navigate('search')}
            >
              <Ionicons name="search" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Barra de búsqueda */}
        <TouchableOpacity 
          style={[styles.searchBar, { backgroundColor: theme.colors.background.default }]}
          onPress={() => navigation.navigate('Events')}
        >
          <Ionicons name="search" size={18} color={theme.colors.text.secondary} />
          <Text style={[styles.searchText, { color: theme.colors.text.secondary }]}>
            Buscar eventos...
          </Text>
        </TouchableOpacity>

        {/* Eventos destacados */}
        <RecommendedEventsSection 
          events={featuredEvents} 
          onEventPress={handleFeaturedEventPress}
        />

        {/* Eventos cercanos */}
        <NearbyEventsSection 
          events={nearbyEvents} 
          onEventPress={handleNearbyEventPress}
        />

        {/* Renderizar categorías */}
        {renderCategories()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  searchText: {
    marginLeft: 8,
  },
  categoriesContainer: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 16,
  },
  categoriesScroll: {
    paddingHorizontal: 8,
  },
  categoryCard: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen; 