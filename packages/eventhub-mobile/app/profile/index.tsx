import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Divider } from '../../src/components/common/Divider';
import { LevelProgress } from '../../src/components/gamification/LevelProgress';
import { AchievementBadge } from '../../src/components/gamification/AchievementBadge';
import { achievementService } from '../../src/services/achievement.service';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('misEventos'); // 'misEventos', 'asistiendo', 'guardados'
  const [userGameProfile, setUserGameProfile] = useState(null);
  const [recentAchievements, setRecentAchievements] = useState([]);
  
  // Datos de ejemplo del usuario
  const userData = {
    id: '1',
    name: 'María García',
    username: '@mariagarcia',
    email: 'maria.garcia@ejemplo.com',
    bio: 'Organizadora de eventos culturales y amante de la música en vivo',
    location: 'Madrid, España',
    profileImage: 'https://randomuser.me/api/portraits/women/44.jpg',
    eventsCreated: 8,
    eventsAttending: 12,
    eventsSaved: 5,
    followers: 156,
    following: 89,
    joinDate: 'Junio 2022',
  };

  // Datos de ejemplo para eventos creados por el usuario
  const createdEvents = [
    {
      id: '1',
      title: 'Festival de Jazz en el Parque',
      date: '2024-06-15',
      location: 'Parque Retiro',
      attendees: 128,
      imageUrl: 'https://picsum.photos/300/200',
    },
    {
      id: '2',
      title: 'Charla sobre Fotografía',
      date: '2024-05-22',
      location: 'Centro Cultural',
      attendees: 45,
      imageUrl: 'https://picsum.photos/300/201',
    },
  ];

  // Datos de ejemplo para eventos a los que asiste el usuario
  const attendingEvents = [
    {
      id: '3',
      title: 'Conferencia de Diseño',
      date: '2024-05-30',
      location: 'Centro de Convenciones',
      organizer: 'Asociación de Diseñadores',
      imageUrl: 'https://picsum.photos/300/202',
    },
    {
      id: '4',
      title: 'Concierto de Rock',
      date: '2024-06-05',
      location: 'WiZink Center',
      organizer: 'Live Nation',
      imageUrl: 'https://picsum.photos/300/203',
    },
  ];

  // Datos de ejemplo para eventos guardados
  const savedEvents = [
    {
      id: '5',
      title: 'Workshop de Cocina',
      date: '2024-07-12',
      location: 'Escuela de Cocina',
      organizer: 'Chef González',
      imageUrl: 'https://picsum.photos/300/204',
    },
    {
      id: '6',
      title: 'Exposición de Arte Moderno',
      date: '2024-08-01',
      location: 'Museo Reina Sofía',
      organizer: 'Fundación Arte',
      imageUrl: 'https://picsum.photos/300/205',
    },
  ];

  useEffect(() => {
    // Cargar perfil de gamificación y logros recientes
    const loadGameProfile = async () => {
      try {
        // Simular ID de usuario actual
        const userId = userData.id;
        const gameProfile = await achievementService.getUserProfile(userId);
        setUserGameProfile(gameProfile);
        
        // Obtener los 3 logros más recientes desbloqueados
        if (gameProfile.enrichedAchievements) {
          const unlocked = gameProfile.enrichedAchievements
            .filter((a) => a.unlockedAt)
            .sort((a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime())
            .slice(0, 3);
          
          setRecentAchievements(unlocked);
        }
      } catch (error) {
        console.error('Error al cargar perfil de juego:', error);
      }
    };

    loadGameProfile();
  }, []);

  // Componente para renderizar un evento en la lista
  const EventCard = ({ event, isCreated = false }) => (
    <TouchableOpacity
      style={[styles.eventCard, { backgroundColor: theme.colors.card }]}
      onPress={() => router.push(`/events/evento/${event.id}`)}
    >
      <View style={styles.eventImageContainer}>
        <Ionicons name="image" size={30} color={theme.colors.secondaryText} />
      </View>
      <View style={styles.eventInfo}>
        <Text 
          style={[styles.eventTitle, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {event.title}
        </Text>
        <View style={styles.eventDetail}>
          <Ionicons name="calendar-outline" size={14} color={theme.colors.primary} />
          <Text style={[styles.eventDetailText, { color: theme.colors.secondaryText }]}>
            {event.date}
          </Text>
        </View>
        <View style={styles.eventDetail}>
          <Ionicons name="location-outline" size={14} color={theme.colors.primary} />
          <Text 
            style={[styles.eventDetailText, { color: theme.colors.secondaryText }]}
            numberOfLines={1}
          >
            {event.location}
          </Text>
        </View>
        {isCreated ? (
          <View style={styles.eventDetail}>
            <Ionicons name="people-outline" size={14} color={theme.colors.primary} />
            <Text style={[styles.eventDetailText, { color: theme.colors.secondaryText }]}>
              {event.attendees} asistentes
            </Text>
          </View>
        ) : (
          <View style={styles.eventDetail}>
            <Ionicons name="person-outline" size={14} color={theme.colors.primary} />
            <Text 
              style={[styles.eventDetailText, { color: theme.colors.secondaryText }]}
              numberOfLines={1}
            >
              Org: {event.organizer}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  // Función para renderizar la lista de eventos según la pestaña activa
  const renderEventsList = () => {
    let events = [];
    let isCreatedEvents = false;

    if (activeTab === 'misEventos') {
      events = createdEvents;
      isCreatedEvents = true;
    } else if (activeTab === 'asistiendo') {
      events = attendingEvents;
    } else if (activeTab === 'guardados') {
      events = savedEvents;
    }

    if (events.length === 0) {
      return (
        <View style={styles.emptyListContainer}>
          <Ionicons 
            name={
              activeTab === 'misEventos' 
                ? 'calendar' 
                : activeTab === 'asistiendo' 
                  ? 'people' 
                  : 'bookmark'
            } 
            size={50} 
            color={theme.colors.secondaryText} 
          />
          <Text style={[styles.emptyListText, { color: theme.colors.text }]}>
            {activeTab === 'misEventos' 
              ? 'No has creado eventos aún' 
              : activeTab === 'asistiendo' 
                ? 'No estás asistiendo a ningún evento' 
                : 'No has guardado ningún evento'}
          </Text>
          {activeTab === 'misEventos' && (
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => router.push('/add-event')}
            >
              <Text style={styles.createButtonText}>Crear evento</Text>
            </TouchableOpacity>
          )}
        </View>
      );
    }

    return (
      <View style={styles.eventsListContainer}>
        {events.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            isCreated={isCreatedEvents} 
          />
        ))}
      </View>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Encabezado del perfil */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <View style={[styles.profileImageWrapper, { backgroundColor: theme.colors.secondaryText }]}>
            <Ionicons name="person" size={50} color={theme.colors.card} />
          </View>
        </View>
        
        <Text style={[styles.profileName, { color: theme.colors.text }]}>
          {userData.name}
        </Text>
        <Text style={[styles.profileUsername, { color: theme.colors.secondaryText }]}>
          {userData.username}
        </Text>
        
        <View style={styles.profileBio}>
          <Text style={[styles.bioText, { color: theme.colors.text }]}>
            {userData.bio}
          </Text>
        </View>
        
        <View style={styles.profileStats}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {userData.eventsCreated}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
              Creados
            </Text>
          </View>
          <View style={[styles.statSeparator, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {userData.followers}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
              Seguidores
            </Text>
          </View>
          <View style={[styles.statSeparator, { backgroundColor: theme.colors.border }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: theme.colors.text }]}>
              {userData.following}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.secondaryText }]}>
              Siguiendo
            </Text>
          </View>
        </View>
        
        <View style={styles.profileDetailsContainer}>
          <View style={styles.profileDetailItem}>
            <Ionicons name="mail-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.profileDetailText, { color: theme.colors.text }]}>
              {userData.email}
            </Text>
          </View>
          <View style={styles.profileDetailItem}>
            <Ionicons name="location-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.profileDetailText, { color: theme.colors.text }]}>
              {userData.location}
            </Text>
          </View>
          <View style={styles.profileDetailItem}>
            <Ionicons name="calendar-outline" size={16} color={theme.colors.primary} />
            <Text style={[styles.profileDetailText, { color: theme.colors.text }]}>
              Miembro desde {userData.joinDate}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.editProfileButton,
            { borderColor: theme.colors.primary }
          ]}
          onPress={() => router.push('/profile/edit')}
        >
          <Ionicons name="create-outline" size={18} color={theme.colors.primary} />
          <Text style={[styles.editProfileButtonText, { color: theme.colors.primary }]}>
            Editar perfil
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Sección de nivel y logros */}
      {userGameProfile && (
        <View style={[styles.gamificationSection, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Nivel y Logros
            </Text>
            <TouchableOpacity onPress={() => router.push('/profile/achievements')}>
              <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>
                Ver todos
              </Text>
            </TouchableOpacity>
          </View>
          
          <LevelProgress 
            userProfile={userGameProfile} 
            compact={true}
          />
          
          {recentAchievements.length > 0 ? (
            <View style={styles.achievementsContainer}>
              <Text style={[styles.achievementsTitle, { color: theme.colors.secondaryText }]}>
                Logros recientes:
              </Text>
              
              <View style={styles.achievementsList}>
                {recentAchievements.map((achievement) => (
                  <AchievementBadge 
                    key={achievement.id}
                    achievement={achievement}
                    size="small"
                    showProgress={false}
                  />
                ))}
                
                <TouchableOpacity 
                  style={[styles.viewAllButton, { borderColor: theme.colors.border }]}
                  onPress={() => router.push('/profile/achievements')}
                >
                  <Ionicons name="trophy-outline" size={24} color={theme.colors.primary} />
                  <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
                    Ver todos
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity 
              style={[styles.noAchievementsContainer, { borderColor: theme.colors.border }]}
              onPress={() => router.push('/profile/achievements')}
            >
              <Ionicons name="trophy-outline" size={36} color={theme.colors.secondaryText} />
              <Text style={[styles.noAchievementsText, { color: theme.colors.secondaryText }]}>
                Aún no has desbloqueado logros
              </Text>
              <Text style={[styles.exploreText, { color: theme.colors.primary }]}>
                Explorar logros disponibles
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      
      <Divider />
      
      {/* Pestañas de navegación */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'misEventos' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('misEventos')}
        >
          <Text 
            style={[
              styles.tabButtonText, 
              { color: activeTab === 'misEventos' ? theme.colors.primary : theme.colors.secondaryText }
            ]}
          >
            Mis eventos
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'asistiendo' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('asistiendo')}
        >
          <Text 
            style={[
              styles.tabButtonText, 
              { color: activeTab === 'asistiendo' ? theme.colors.primary : theme.colors.secondaryText }
            ]}
          >
            Asistiendo
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'guardados' && { borderBottomColor: theme.colors.primary, borderBottomWidth: 2 }
          ]}
          onPress={() => setActiveTab('guardados')}
        >
          <Text 
            style={[
              styles.tabButtonText, 
              { color: activeTab === 'guardados' ? theme.colors.primary : theme.colors.secondaryText }
            ]}
          >
            Guardados
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Lista de eventos según la pestaña seleccionada */}
      {renderEventsList()}
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
  },
  profileImageContainer: {
    marginBottom: 16,
  },
  profileImageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileUsername: {
    fontSize: 16,
    marginBottom: 12,
  },
  profileBio: {
    width: '100%',
    marginBottom: 20,
  },
  bioText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  statSeparator: {
    width: 1,
    height: '100%',
  },
  profileDetailsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  profileDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileDetailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  editProfileButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  eventsListContainer: {
    padding: 20,
  },
  eventCard: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  eventDetailText: {
    fontSize: 12,
    marginLeft: 4,
  },
  emptyListContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyListText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  createButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  gamificationSection: {
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    fontSize: 14,
  },
  achievementsContainer: {
    marginTop: 16,
  },
  achievementsTitle: {
    fontSize: 14,
    marginBottom: 12,
  },
  achievementsList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  viewAllText: {
    fontSize: 10,
    marginTop: 4,
  },
  noAchievementsContainer: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  noAchievementsText: {
    fontSize: 14,
    marginTop: 12,
    marginBottom: 4,
  },
  exploreText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 