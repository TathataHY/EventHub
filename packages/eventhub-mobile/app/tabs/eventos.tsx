import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  RefreshControl,
  TextInput
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { eventService } from '../../src/services/event.service';
import { authService } from '../../src/services/auth.service';

export default function EventosScreen() {
  const router = useRouter();
  const [eventos, setEventos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCategories, setShowCategories] = useState(false);

  // Categorías disponibles
  const categorias = [
    'Todos', 
    'Música', 
    'Deportes', 
    'Tecnología', 
    'Arte', 
    'Gastronomía', 
    'Educación', 
    'Negocios',
    'Social',
    'Otro'
  ];

  // Cargar eventos
  const loadEvents = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else if (!isRefreshing) {
        setIsLoading(true);
      }

      // Verificar autenticación
      const auth = await authService.isAuthenticated();
      setIsAuthenticated(auth);

      // Cargar eventos
      let eventosData;
      if (selectedCategory && selectedCategory !== 'Todos') {
        eventosData = await eventService.getEventsByCategory(selectedCategory);
      } else if (searchQuery.trim()) {
        eventosData = await eventService.searchEvents(searchQuery);
      } else {
        eventosData = await eventService.getAllEvents();
      }
      
      setEventos(eventosData);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchQuery, selectedCategory, isRefreshing]);

  // Cargar eventos al iniciar
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Manejar búsqueda
  const handleSearch = () => {
    loadEvents();
  };

  // Manejar selección de categoría
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategories(false);
    loadEvents();
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM", { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  // Renderizar item de evento
  const renderEventItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventCard}
      onPress={() => router.push(`/evento/${item.id}`)}
    >
      <Image 
        source={{ uri: item.imageUrl || 'https://img.freepik.com/free-photo/group-people-enjoying-party_23-2147652037.jpg' }}
        style={styles.eventImage}
      />
      
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
        
        <View style={styles.eventInfo}>
          <FontAwesome name="calendar" size={14} color="#666" style={styles.infoIcon} />
          <Text style={styles.eventDate}>{formatDate(item.startDate)}</Text>
        </View>
        
        <View style={styles.eventInfo}>
          <FontAwesome name="map-marker" size={14} color="#666" style={styles.infoIcon} />
          <Text style={styles.eventLocation} numberOfLines={1}>{item.location}</Text>
        </View>
        
        <View style={styles.eventFooter}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          
          {item.isAttending && (
            <View style={styles.attendingBadge}>
              <FontAwesome name="check-circle" size={12} color="white" />
              <Text style={styles.attendingText}>Asistiré</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Eventos</Text>
        {isAuthenticated && (
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => router.push('/crear-evento')}
          >
            <FontAwesome name="plus" size={16} color="white" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar eventos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleSearch}>
            <FontAwesome name="search" size={18} color="#666" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity 
          style={styles.categorySelector}
          onPress={() => setShowCategories(!showCategories)}
        >
          <Text style={styles.categoryButtonText}>
            {selectedCategory || 'Categoría'}
          </Text>
          <FontAwesome name="chevron-down" size={14} color="#666" />
        </TouchableOpacity>
      </View>
      
      {showCategories && (
        <View style={styles.categoriesDropdown}>
          <FlatList
            data={categorias}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.categoryItem,
                  selectedCategory === item && styles.selectedCategoryItem
                ]}
                onPress={() => handleCategorySelect(item)}
              >
                <Text style={[
                  styles.categoryItemText,
                  selectedCategory === item && styles.selectedCategoryItemText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      
      {isLoading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4a80f5" />
          <Text style={styles.loadingText}>Cargando eventos...</Text>
        </View>
      ) : eventos.length > 0 ? (
        <FlatList
          data={eventos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEventItem}
          contentContainerStyle={styles.eventsList}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadEvents(true)}
              colors={['#4a80f5']}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome name="calendar-o" size={60} color="#ccc" />
          <Text style={styles.emptyText}>No hay eventos disponibles</Text>
          {searchQuery || selectedCategory ? (
            <TouchableOpacity 
              style={styles.clearFilterButton}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('');
                loadEvents();
              }}
            >
              <Text style={styles.clearFilterText}>Limpiar filtros</Text>
            </TouchableOpacity>
          ) : isAuthenticated ? (
            <TouchableOpacity 
              style={styles.createEventButton}
              onPress={() => router.push('/crear-evento')}
            >
              <Text style={styles.createEventText}>Crear un evento</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.loginButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginText}>Iniciar sesión</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#4a80f5',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 40,
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    marginRight: 5,
  },
  categoriesDropdown: {
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    maxHeight: 200,
  },
  categoryItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  selectedCategoryItem: {
    backgroundColor: '#f0f7ff',
  },
  categoryItemText: {
    fontSize: 16,
    color: '#333',
  },
  selectedCategoryItemText: {
    color: '#4a80f5',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  eventsList: {
    padding: 15,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventContent: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  eventInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  infoIcon: {
    width: 20,
    marginRight: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#666',
  },
  eventLocation: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  categoryBadge: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
  },
  attendingBadge: {
    backgroundColor: '#4cd964',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendingText: {
    fontSize: 12,
    color: 'white',
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  clearFilterButton: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  clearFilterText: {
    color: '#666',
    fontWeight: 'bold',
  },
  createEventButton: {
    backgroundColor: '#4a80f5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  createEventText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loginButton: {
    backgroundColor: '#4a80f5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 