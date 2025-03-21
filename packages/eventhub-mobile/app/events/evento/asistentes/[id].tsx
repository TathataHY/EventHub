import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  Image,
  ActivityIndicator 
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../../../../src/context/ThemeContext';
import { Divider } from '../../../../src/components/common/Divider';

// Interfaz para asistentes
interface Attendee {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  isFollowing: boolean;
  isOrganizer?: boolean;
}

export default function AttendeeListScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [eventName, setEventName] = useState('');
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [filteredAttendees, setFilteredAttendees] = useState<Attendee[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Cargar datos del evento y asistentes (simulado)
  useEffect(() => {
    // En una aplicación real, aquí se cargarían los datos desde un API
    setTimeout(() => {
      setEventName('Festival de Jazz 2023');
      
      // Datos de prueba para los asistentes
      const mockAttendees: Attendee[] = [
        {
          id: '1',
          name: 'Carlos Rodríguez',
          username: '@crodriguez',
          avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
          isFollowing: true,
          isOrganizer: true
        },
        {
          id: '2',
          name: 'Laura Martínez',
          username: '@lmartinez',
          avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
          isFollowing: false
        },
        {
          id: '3',
          name: 'Javier López',
          username: '@jlopez',
          avatarUrl: 'https://randomuser.me/api/portraits/men/62.jpg',
          isFollowing: true
        },
        {
          id: '4',
          name: 'Ana García',
          username: '@agarcia',
          avatarUrl: 'https://randomuser.me/api/portraits/women/28.jpg',
          isFollowing: false
        },
        {
          id: '5',
          name: 'Miguel Fernández',
          username: '@mfernandez',
          avatarUrl: 'https://randomuser.me/api/portraits/men/18.jpg',
          isFollowing: false
        },
        {
          id: '6',
          name: 'Carmen Sánchez',
          username: '@csanchez',
          avatarUrl: 'https://randomuser.me/api/portraits/women/57.jpg',
          isFollowing: true
        },
        {
          id: '7',
          name: 'David Pérez',
          username: '@dperez',
          avatarUrl: 'https://randomuser.me/api/portraits/men/29.jpg',
          isFollowing: false
        },
        {
          id: '8',
          name: 'Marta Romero',
          username: '@mromero',
          avatarUrl: 'https://randomuser.me/api/portraits/women/63.jpg',
          isFollowing: true
        }
      ];
      
      setAttendees(mockAttendees);
      setFilteredAttendees(mockAttendees);
      setLoading(false);
    }, 1500);
  }, [id]);
  
  // Filtrar asistentes por búsqueda
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAttendees(attendees);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = attendees.filter(
        attendee => 
          attendee.name.toLowerCase().includes(query) || 
          attendee.username.toLowerCase().includes(query)
      );
      setFilteredAttendees(filtered);
    }
  }, [searchQuery, attendees]);
  
  // Toggle para seguir/dejar de seguir a un asistente
  const toggleFollowing = (id: string) => {
    const updatedAttendees = attendees.map(attendee => 
      attendee.id === id 
        ? { ...attendee, isFollowing: !attendee.isFollowing } 
        : attendee
    );
    
    setAttendees(updatedAttendees);
    
    // Actualizar también la lista filtrada
    const updatedFiltered = filteredAttendees.map(attendee => 
      attendee.id === id 
        ? { ...attendee, isFollowing: !attendee.isFollowing } 
        : attendee
    );
    
    setFilteredAttendees(updatedFiltered);
  };
  
  // Ver perfil de un asistente
  const viewProfile = (id: string) => {
    router.push(`/profile/${id}`);
  };
  
  // Renderizar item de asistente
  const renderAttendeeItem = ({ item }: { item: Attendee }) => (
    <TouchableOpacity
      style={[styles.attendeeItem, { backgroundColor: theme.colors.card }]}
      onPress={() => viewProfile(item.id)}
    >
      <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
      
      <View style={styles.attendeeInfo}>
        <View style={styles.nameContainer}>
          <Text style={[styles.attendeeName, { color: theme.colors.text }]}>
            {item.name}
          </Text>
          
          {item.isOrganizer && (
            <View style={[styles.organizerBadge, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.organizerText}>Organizador</Text>
            </View>
          )}
        </View>
        
        <Text style={[styles.attendeeUsername, { color: theme.colors.secondaryText }]}>
          {item.username}
        </Text>
      </View>
      
      {!item.isOrganizer && (
        <TouchableOpacity
          style={[
            styles.followButton,
            item.isFollowing 
              ? { borderColor: theme.colors.primary } 
              : { backgroundColor: theme.colors.primary }
          ]}
          onPress={() => toggleFollowing(item.id)}
        >
          {item.isFollowing ? (
            <Text style={[styles.followingText, { color: theme.colors.primary }]}>
              Siguiendo
            </Text>
          ) : (
            <Text style={styles.followText}>
              Seguir
            </Text>
          )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
  
  // Renderizar separador entre items
  const renderSeparator = () => (
    <Divider style={{ marginHorizontal: 16 }} />
  );
  
  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.secondaryText }]}>
          Cargando asistentes...
        </Text>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <Stack.Screen
        options={{
          title: 'Asistentes',
          headerStyle: {
            backgroundColor: theme.colors.card,
          },
          headerShadowVisible: false,
          headerTintColor: theme.colors.text,
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={{ paddingLeft: 8 }}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <Text style={[styles.eventName, { color: theme.colors.text }]}>
          {eventName}
        </Text>
        
        <Text style={[styles.attendeeCount, { color: theme.colors.secondaryText }]}>
          {attendees.length} {attendees.length === 1 ? 'asistente' : 'asistentes'}
        </Text>
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.card }]}>
        <Ionicons name="search" size={20} color={theme.colors.secondaryText} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Buscar asistentes..."
          placeholderTextColor={theme.colors.secondaryText}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={theme.colors.secondaryText} />
          </TouchableOpacity>
        )}
      </View>
      
      {filteredAttendees.length > 0 ? (
        <FlatList
          data={filteredAttendees}
          renderItem={renderAttendeeItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={renderSeparator}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="people-outline" 
            size={64} 
            color={theme.colors.secondaryText} 
          />
          <Text style={[styles.emptyText, { color: theme.colors.secondaryText }]}>
            No se encontraron asistentes
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  header: {
    padding: 16,
  },
  eventName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  attendeeCount: {
    fontSize: 14,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    paddingVertical: 8,
  },
  list: {
    paddingTop: 8,
  },
  attendeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  attendeeInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  attendeeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  organizerBadge: {
    marginLeft: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  organizerText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  attendeeUsername: {
    fontSize: 14,
  },
  followButton: {
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  followText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  followingText: {
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: 'center',
  },
}); 