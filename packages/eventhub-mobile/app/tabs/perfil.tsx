import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
  Alert,
  RefreshControl
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { authService } from '../../src/services/auth.service';
import { eventService } from '../../src/services/event.service';
import { Event } from '../../src/services/event.service';

export default function PerfilScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('mis-eventos');
  const [eventos, setEventos] = useState<Event[]>([]);

  // Cargar datos del usuario y eventos
  const loadUserData = useCallback(async (refresh = false) => {
    try {
      if (refresh) {
        setIsRefreshing(true);
      } else if (!isRefreshing) {
        setIsLoading(true);
      }

      // Verificar si el usuario está autenticado
      const isAuth = await authService.isAuthenticated();
      if (!isAuth) {
        router.replace('/login');
        return;
      }

      // Cargar datos del usuario
      const userData = await authService.getCurrentUser();
      setUser(userData);

      // Cargar eventos según la pestaña activa
      let eventosData: Event[] = [];
      if (activeTab === 'mis-eventos') {
        eventosData = await eventService.getMyEvents();
      } else {
        eventosData = await eventService.getEventsAttending();
      }
      
      setEventos(eventosData);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      Alert.alert(
        'Error',
        'No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [router, activeTab, isRefreshing]);

  // Cargar datos al iniciar
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Manejar cambio de pestaña
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Manejar cierre de sesión
  const handleLogout = async () => {
    try {
      await authService.logout();
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      Alert.alert(
        'Error',
        'No se pudo cerrar sesión. Por favor, inténtalo de nuevo más tarde.'
      );
    }
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
          
          {activeTab === 'asistiendo' && (
            <View style={styles.attendingBadge}>
              <FontAwesome name="check-circle" size={12} color="white" />
              <Text style={styles.attendingText}>Asistiré</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a80f5" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <FontAwesome name="sign-out" size={20} color="#ff3b30" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: user?.profileImage || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'Usuario') }}
            style={styles.profileImage}
          />
        </View>
        
        <Text style={styles.userName}>{user?.name || 'Usuario'}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
        
        <TouchableOpacity 
          style={styles.editProfileButton}
          onPress={() => router.push('/editar-perfil')}
        >
          <Text style={styles.editProfileText}>Editar Perfil</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'mis-eventos' && styles.activeTabButton
          ]}
          onPress={() => handleTabChange('mis-eventos')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'mis-eventos' && styles.activeTabText
          ]}>
            Mis Eventos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.tabButton, 
            activeTab === 'asistiendo' && styles.activeTabButton
          ]}
          onPress={() => handleTabChange('asistiendo')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'asistiendo' && styles.activeTabText
          ]}>
            Asistiendo
          </Text>
        </TouchableOpacity>
      </View>
      
      {eventos.length > 0 ? (
        <FlatList
          data={eventos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderEventItem}
          contentContainerStyle={styles.eventsList}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadUserData(true)}
              colors={['#4a80f5']}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <FontAwesome 
            name={activeTab === 'mis-eventos' ? 'calendar-plus-o' : 'calendar-check-o'} 
            size={60} 
            color="#ccc" 
          />
          <Text style={styles.emptyText}>
            {activeTab === 'mis-eventos' 
              ? 'No has creado ningún evento todavía' 
              : 'No estás asistiendo a ningún evento'}
          </Text>
          {activeTab === 'mis-eventos' ? (
            <TouchableOpacity 
              style={styles.createEventButton}
              onPress={() => router.push('/crear-evento')}
            >
              <Text style={styles.createEventText}>Crear un evento</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.browseEventsButton}
              onPress={() => router.push('/tabs/eventos')}
            >
              <Text style={styles.browseEventsText}>Explorar eventos</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    padding: 10,
  },
  profileSection: {
    backgroundColor: 'white',
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#4a80f5',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  editProfileButton: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    color: '#666',
    fontWeight: 'bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#4a80f5',
  },
  tabButtonText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4a80f5',
    fontWeight: 'bold',
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
  browseEventsButton: {
    backgroundColor: '#4a80f5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  browseEventsText: {
    color: 'white',
    fontWeight: 'bold',
  },
}); 