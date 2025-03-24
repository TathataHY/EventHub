import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UserAvatar, UserStats, InterestsList, FollowButton } from '../components';
import { userService } from '../services';
import { PublicUserProfile, UserProfile } from '../types';
import { colors } from '@theme/base/colors';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '@shared/hooks/useTheme';
import { getColorValue } from '@theme/theme.types';
import { ProfileHeader } from '@modules/users/components/ProfileHeader';
import { EventList } from '@modules/events/components/EventList';

// Tipo para los parámetros de la ruta
type UserProfileRouteParams = {
  userId: string;
};

export const UserProfileScreen: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, UserProfileRouteParams>, string>>();
  const { userId } = route.params || {};
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [user, setUser] = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar perfil de usuario
  const loadUserProfile = useCallback(async () => {
    try {
      setError(null);
      const profile = await userService.getUserProfile(userId);
      // Convertir el perfil recibido a PublicUserProfile usando un objeto temporal
      const publicProfile: PublicUserProfile = {
        id: profile.id,
        username: profile.username || '',
        fullName: profile.fullName || profile.name || '',
        photoURL: profile.photoURL || profile.profilePicture,
        bio: profile.bio,
        location: profile.location,
        interests: profile.interests || [],
        followersCount: typeof profile.followers === 'object' && profile.followers ? profile.followers.length : 0,
        followingCount: typeof profile.following === 'object' && profile.following ? profile.following.length : 0,
        eventsAttended: profile.stats?.eventsAttended || 0,
        eventsOrganized: profile.stats?.eventsCreated || 0,
        createdAt: profile.createdAt
      };
      setUser(publicProfile);
    } catch (err) {
      console.error('Error al cargar perfil:', err);
      setError('No se pudo cargar el perfil de usuario');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [userId]);

  // Cargar perfil al montar
  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  // Manejar refresco
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadUserProfile();
  }, [loadUserProfile]);

  // Seguir al usuario
  const handleFollow = useCallback(async (targetUserId: string) => {
    try {
      const success = await userService.followUser(targetUserId);
      return { success };
    } catch (err) {
      console.error('Error al seguir usuario:', err);
      return { success: false, error: 'Error al seguir al usuario' };
    }
  }, []);

  // Dejar de seguir al usuario
  const handleUnfollow = useCallback(async (targetUserId: string) => {
    try {
      const success = await userService.unfollowUser(targetUserId);
      return { success };
    } catch (err) {
      console.error('Error al dejar de seguir usuario:', err);
      return { success: false, error: 'Error al dejar de seguir al usuario' };
    }
  }, []);

  // Reportar usuario
  const handleReport = useCallback(() => {
    Alert.alert(
      'Reportar usuario',
      '¿Por qué quieres reportar a este usuario?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Contenido inapropiado',
          onPress: () => reportUser('Contenido inapropiado')
        },
        {
          text: 'Comportamiento ofensivo',
          onPress: () => reportUser('Comportamiento ofensivo')
        },
        {
          text: 'Spam',
          onPress: () => reportUser('Spam')
        },
        {
          text: 'Otro',
          onPress: () => reportUser('Otro motivo')
        }
      ]
    );
  }, []);

  // Enviar reporte
  const reportUser = async (reason: string) => {
    try {
      const success = await userService.reportUser(userId, reason);
      
      if (success) {
        Alert.alert(
          'Reporte enviado',
          'Gracias por ayudarnos a mantener la comunidad segura. Revisaremos tu reporte pronto.'
        );
      } else {
        Alert.alert('Error', 'No se pudo enviar el reporte. Inténtalo de nuevo más tarde.');
      }
    } catch (err) {
      console.error('Error al reportar usuario:', err);
      Alert.alert('Error', 'Ocurrió un error al enviar el reporte.');
    }
  };

  // Bloquear usuario
  const handleBlock = useCallback(() => {
    Alert.alert(
      'Bloquear usuario',
      '¿Estás seguro de que quieres bloquear a este usuario? No podrás ver su contenido ni recibir mensajes de ellos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Bloquear',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await userService.blockUser(userId);
              
              if (success) {
                Alert.alert(
                  'Usuario bloqueado',
                  'Has bloqueado a este usuario correctamente.'
                );
                // Navegar hacia atrás después de bloquear
                navigation.goBack();
              } else {
                Alert.alert('Error', 'No se pudo bloquear al usuario.');
              }
            } catch (err) {
              console.error('Error al bloquear usuario:', err);
              Alert.alert('Error', 'Ocurrió un error al bloquear al usuario.');
            }
          }
        }
      ]
    );
  }, [userId, navigation]);

  // Configurar encabezado con opciones
  useEffect(() => {
    if (user) {
      navigation.setOptions({
        title: user.username,
        headerRight: () => (
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => {
              Alert.alert(
                'Opciones',
                'Selecciona una opción',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { text: 'Reportar usuario', onPress: handleReport },
                  { text: 'Bloquear usuario', onPress: handleBlock, style: 'destructive' }
                ]
              );
            }}
          >
            <Ionicons name="ellipsis-vertical" size={24} color={getColorValue(theme.colors.text.primary)} />
          </TouchableOpacity>
        )
      });
    }
  }, [user, navigation, handleReport, handleBlock, theme]);

  // Mostrar indicador de carga
  if (loading && !user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={getColorValue(theme.colors.primary.main)} />
      </View>
    );
  }

  // Mostrar mensaje de error
  if (error && !user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.errorText, { color: getColorValue(theme.colors.error.main) }]}>
          {error}
        </Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadUserProfile}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Si no hay usuario, no deberíamos llegar aquí
  if (!user) {
    return null;
  }

  // Extraer la ubicación formateada
  const getFormattedLocation = () => {
    if (!user.location) return '';
    
    if (typeof user.location === 'string') {
      return user.location;
    }
    
    // Si es un objeto de ubicación
    const parts = [];
    if (user.location.city) parts.push(user.location.city);
    if (user.location.state) parts.push(user.location.state);
    if (user.location.country) parts.push(user.location.country);
    
    return parts.join(', ');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <ProfileHeader
          user={user}
          name={user.fullName || ''}
          username={user.username || ''}
          bio={user.bio}
          location={getFormattedLocation()}
        />
        
        <View style={styles.actionContainer}>
          <FollowButton userId={user.id} isFollowing={user.isFollowing} />
        </View>
        
        <UserStats
          eventsCreated={user.eventsOrganized}
          eventsAttended={user.eventsAttended}
          followersCount={user.followersCount}
          followingCount={user.followingCount}
        />
        
        {user.interests && user.interests.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: getColorValue(theme.colors.text.primary) }]}>
              Intereses
            </Text>
            <InterestsList 
              interests={
                // Asegurar que interests es un array de strings
                Array.isArray(user.interests) 
                  ? user.interests.map(i => typeof i === 'string' ? i : String(i))
                  : []
              } 
            />
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: getColorValue(theme.colors.text.primary) }]}>
            Eventos creados
          </Text>
          <EventList 
            events={[]} // Aquí deberías cargar los eventos del usuario
            loading={false}
            emptyMessage="Este usuario aún no ha creado eventos"
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.text,
  },
  errorText: {
    fontSize: 16,
    color: colors.error.main,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary.main,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.common.white,
    fontWeight: '500',
  },
  actionContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});