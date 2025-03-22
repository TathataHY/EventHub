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
import { useTheme } from '@core/context/ThemeContext';

// Componentes
import { NearbyEventsSection } from '@modules/home/components/NearbyEventsSection';
import { RecommendedEventsSection } from '@modules/home/components/RecommendedEventsSection';

// Servicios
import { eventService } from '@modules/events/services/event.service';
import { authService } from '@modules/auth/services/auth.service';

// Tipos
import { Event } from '@modules/events/types';
import { Category } from '@modules/events/types';
import { User } from '@modules/users/types';

const HomeScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [nearbyEvents, setNearbyEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Función para cargar datos
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Cargar eventos destacados
      const featured = await eventService.getFeaturedEvents();
      setFeaturedEvents(featured);
      
      // Cargar eventos cercanos
      const nearby = await eventService.getNearbyEvents();
      setNearbyEvents(nearby);
      
      // Cargar categorías
      const cats = await eventService.getCategories();
      setCategories(cats);
      
      // Cargar usuario actual
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  // Función para refrescar datos
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  // Renderizar pantalla de carga
  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>
          Cargando eventos...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
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
              Hola, {currentUser?.name?.split(' ')[0] || 'Usuario'}
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
              ¿Qué evento te interesa hoy?
            </Text>
          </View>
          
          {/* Botones de notificaciones y perfil */}
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: theme.colors.background.paper }]}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-outline" size={22} color={theme.colors.primary.main} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.iconButton, { backgroundColor: theme.colors.background.paper }]}
              onPress={() => {/* Navegar a notificaciones */}}
            >
              <Ionicons name="notifications-outline" size={22} color={theme.colors.primary.main} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Barra de búsqueda */}
        <TouchableOpacity 
          style={[styles.searchBar, { backgroundColor: theme.colors.background.paper }]}
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
          onEventPress={(event) => navigation.navigate('EventDetail', { event })}
        />

        {/* Eventos cercanos */}
        <NearbyEventsSection 
          events={nearbyEvents} 
          onEventPress={(event) => navigation.navigate('EventDetail', { event })}
        />
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
  iconButton: {
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
});

export default HomeScreen; 