import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  useWindowDimensions,
  RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Card, TabView, Button } from '../../../shared/components';
import { useUser } from '../hooks/useUser';
import { UserProfile, ProfileUpdateData } from '../types';
import { Event } from '../../events/types';
import { EventCard } from '../../events/components/EventCard';
import { typography, spacing, getColorValue, convertTypographyStyle } from '@theme/index';
import { colors } from '@theme/base/colors';

/**
 * Interfaz extendida para obtener las propiedades adicionales desde ProfileUpdateData
 */
interface ExtendedUserProfile extends UserProfile {
  website?: string;
  avatar?: string;
  coverImage?: string;
  joinDate?: string;
}

/**
 * Pantalla principal de perfil de usuario
 */
export function ProfileScreen() {
  const navigation = useNavigation();
  const { currentUser, getUserEvents, getUserAttendingEvents, loading, error } = useUser();
  const layout = useWindowDimensions();
  
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [createdEvents, setCreatedEvents] = useState<Event[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  
  // Tratar currentUser como ExtendedUserProfile para usar propiedades adicionales
  const extendedUser = currentUser as ExtendedUserProfile;
  
  // Cargar eventos creados y a los que asiste el usuario
  useEffect(() => {
    if (currentUser?.id) {
      loadUserEvents();
    }
  }, [currentUser]);
  
  // Función para cargar eventos del usuario
  const loadUserEvents = async () => {
    if (!currentUser?.id) return;
    
    setLoadingEvents(true);
    try {
      // Cargar eventos creados
      const eventsCreated = await getUserEvents(currentUser.id);
      setCreatedEvents(eventsCreated.organized || []);
      
      // Cargar eventos a los que asiste
      const eventsAttending = await getUserAttendingEvents(currentUser.id);
      setAttendingEvents(eventsAttending.attending || []);
    } catch (err) {
      console.error('Error loading user events:', err);
    } finally {
      setLoadingEvents(false);
    }
  };
  
  // Manejar refresco de la pantalla
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUserEvents();
    setRefreshing(false);
  };
  
  // Navegar a la pantalla de edición de perfil
  const handleEditProfile = () => {
    navigation.navigate('ProfileEdit' as never);
  };
  
  // Mostrar indicador de carga mientras se cargan los datos del usuario
  if (loading && !currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={getColorValue(colors.primary)} />
      </View>
    );
  }
  
  // Mostrar mensaje de error si no se pudieron cargar los datos
  if (error && !currentUser) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={48} color={getColorValue(colors.error)} />
        <Text style={styles.errorText}>No se pudo cargar el perfil</Text>
        <Button 
          title="Reintentar" 
          onPress={handleRefresh}
          containerStyle={styles.retryButton}
        />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Cabecera del perfil */}
        <Card style={styles.profileCard}>
          {/* Imagen de portada */}
          <View style={styles.coverContainer}>
            {extendedUser?.coverImage ? (
              <Image
                source={{ uri: extendedUser.coverImage }}
                style={styles.coverImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.coverPlaceholder} />
            )}
          </View>
          
          {/* Avatar y detalles */}
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              {extendedUser?.avatar ? (
                <Image
                  source={{ uri: extendedUser.avatar }}
                  style={styles.avatar}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color={getColorValue(colors.grey[300])} />
                </View>
              )}
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.name}>{currentUser?.name}</Text>
              <Text style={styles.username}>@{currentUser?.username}</Text>
              
              {currentUser?.bio && (
                <Text style={styles.bio}>{currentUser.bio}</Text>
              )}
              
              <View style={styles.locationContainer}>
                {currentUser?.location && (
                  <View style={styles.infoItem}>
                    <Ionicons name="location-outline" size={16} color={getColorValue(colors.grey[500])} />
                    <Text style={styles.infoText}>
                      {typeof currentUser.location === 'string' 
                        ? currentUser.location 
                        : currentUser.location.city || 'Ubicación no especificada'}
                    </Text>
                  </View>
                )}
                
                {extendedUser?.website && (
                  <View style={styles.infoItem}>
                    <Ionicons name="globe-outline" size={16} color={getColorValue(colors.grey[500])} />
                    <Text 
                      style={[styles.infoText, styles.websiteText]}
                      numberOfLines={1}
                    >
                      {extendedUser.website}
                    </Text>
                  </View>
                )}
                
                {extendedUser?.joinDate && (
                  <View style={styles.infoItem}>
                    <Ionicons name="calendar-outline" size={16} color={getColorValue(colors.grey[500])} />
                    <Text style={styles.infoText}>
                      Miembro desde {new Date(extendedUser.joinDate).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
          
          {/* Botón de editar perfil */}
          <View style={styles.editButtonContainer}>
            <Button
              title="Editar perfil"
              onPress={handleEditProfile}
              type="outline"
              containerStyle={styles.editButton}
              icon={<Ionicons name="create-outline" size={18} color={getColorValue(colors.primary)} />}
            />
          </View>
          
          {/* Estadísticas */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser?.eventsCreated || 0}</Text>
              <Text style={styles.statLabel}>Creados</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{currentUser?.eventsAttended || 0}</Text>
              <Text style={styles.statLabel}>Asistidos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{typeof currentUser?.followers === 'number' 
                ? currentUser.followers 
                : (currentUser?.followers ? currentUser.followers.length : 0)}</Text>
              <Text style={styles.statLabel}>Seguidores</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{typeof currentUser?.following === 'number' 
                ? currentUser.following 
                : (currentUser?.following ? currentUser.following.length : 0)}</Text>
              <Text style={styles.statLabel}>Siguiendo</Text>
            </View>
          </View>
        </Card>
        
        {/* Pestañas para ver eventos */}
        <Card style={styles.tabsCard}>
          <TabView
            initialTab={selectedTab}
            onChange={setSelectedTab}
            tabs={[
              'Eventos creados',
              'Eventos asistidos'
            ]}
          />
          
          <View style={styles.tabContent}>
            {loadingEvents ? (
              <View style={styles.loadingEventsContainer}>
                <ActivityIndicator size="small" color={getColorValue(colors.primary)} />
                <Text style={styles.loadingEventsText}>Cargando eventos...</Text>
              </View>
            ) : (
              selectedTab === 0 ? (
                createdEvents.length > 0 ? (
                  <View style={styles.eventsContainer}>
                    {createdEvents.map((event) => (
                      <EventCard key={event.id} event={event} style={styles.eventCard} />
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Ionicons name="calendar-outline" size={48} color={getColorValue(colors.grey[300])} />
                    <Text style={styles.emptyStateText}>No has creado ningún evento aún</Text>
                    <Button
                      title="Crear evento"
                      onPress={() => navigation.navigate('CreateEvent' as never)}
                      containerStyle={styles.createEventButton}
                    />
                  </View>
                )
              ) : (
                attendingEvents.length > 0 ? (
                  <View style={styles.eventsContainer}>
                    {attendingEvents.map((event) => (
                      <EventCard key={event.id} event={event} style={styles.eventCard} />
                    ))}
                  </View>
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Ionicons name="calendar-outline" size={48} color={getColorValue(colors.grey[300])} />
                    <Text style={styles.emptyStateText}>No estás asistiendo a ningún evento</Text>
                    <Button
                      title="Explorar eventos"
                      onPress={() => navigation.navigate('Events' as never)}
                      containerStyle={styles.createEventButton}
                    />
                  </View>
                )
              )
            )}
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: getColorValue(colors.background),
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: convertTypographyStyle({
    ...typography.h6,
    color: getColorValue(colors.error),
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  }),
  retryButton: {
    width: 200,
  },
  profileCard: {
    padding: 0,
    marginBottom: 16,
    overflow: 'hidden',
  },
  coverContainer: {
    width: '100%',
    height: 140,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: getColorValue(colors.grey[200]),
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 16,
  },
  avatarContainer: {
    marginTop: -50,
    marginRight: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: getColorValue(colors.common.white),
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: getColorValue(colors.grey[100]),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: getColorValue(colors.common.white),
  },
  profileInfo: {
    flex: 1,
  },
  name: convertTypographyStyle({
    ...typography.h6,
    color: getColorValue(colors.text),
    marginBottom: 4,
  }),
  username: convertTypographyStyle({
    ...typography.subtitle2,
    color: getColorValue(colors.grey[500]),
    marginBottom: 12,
  }),
  bio: convertTypographyStyle({
    ...typography.body2,
    color: getColorValue(colors.text),
    marginBottom: 12,
  }),
  locationContainer: {
    marginTop: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: convertTypographyStyle({
    ...typography.body2,
    color: getColorValue(colors.grey[600]),
    marginLeft: 6,
  }),
  websiteText: {
    color: getColorValue(colors.primary.main),
  },
  editButtonContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  editButton: {
    alignSelf: 'flex-start',
  },
  statsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: getColorValue(colors.grey[200]),
    paddingVertical: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: convertTypographyStyle({
    ...typography.h6,
    color: getColorValue(colors.text),
  }),
  statLabel: convertTypographyStyle({
    ...typography.caption,
    color: getColorValue(colors.grey[500]),
  }),
  statDivider: {
    width: 1,
    backgroundColor: getColorValue(colors.grey[200]),
    height: '70%',
    alignSelf: 'center',
  },
  tabsCard: {
    padding: 0,
    overflow: 'hidden',
  },
  tabContent: {
    minHeight: 200,
    padding: 16,
  },
  loadingEventsContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loadingEventsText: convertTypographyStyle({
    ...typography.body2,
    color: getColorValue(colors.grey[500]),
    marginTop: 12,
  }),
  eventsContainer: {
    marginTop: 8,
  },
  eventCard: {
    marginBottom: 16,
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: convertTypographyStyle({
    ...typography.body1,
    color: getColorValue(colors.grey[600]),
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  }),
  createEventButton: {
    width: 200,
  },
}); 