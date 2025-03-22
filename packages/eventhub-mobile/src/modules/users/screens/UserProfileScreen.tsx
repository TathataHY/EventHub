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
import { PublicUserProfile } from '../types';
import { colors } from '@theme';
import { useNavigation } from '@react-navigation/native';

interface UserProfileScreenProps {
  userId: string;
}

export const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ userId }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState<PublicUserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar perfil de usuario
  const loadUserProfile = useCallback(async () => {
    try {
      setError(null);
      const profile = await userService.getUserProfile(userId);
      setUser(profile);
    } catch (err) {
      console.error('Error al cargar perfil de usuario:', err);
      setError('No se pudo cargar el perfil del usuario');
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
            <Ionicons name="ellipsis-vertical" size={24} color={colors.textDark} />
          </TouchableOpacity>
        )
      });
    }
  }, [user, navigation, handleReport, handleBlock]);

  // Mostrar indicador de carga
  if (loading && !user) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  // Mostrar mensaje de error
  if (error && !user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
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

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
        />
      }
    >
      {/* Header con avatar y nombre */}
      <View style={styles.profileHeader}>
        <View style={styles.userInfo}>
          <UserAvatar 
            photoURL={user.photoURL}
            size={100}
          />
          
          <View style={styles.nameContainer}>
            <Text style={styles.fullName}>{user.fullName}</Text>
            <Text style={styles.username}>@{user.username}</Text>
          </View>
        </View>
        
        <FollowButton 
          userId={user.id}
          isFollowing={user.isFollowing || false}
          onFollowPress={handleFollow}
          onUnfollowPress={handleUnfollow}
        />
      </View>
      
      {/* Estadísticas del usuario */}
      <UserStats
        followersCount={user.followersCount}
        followingCount={user.followingCount}
        eventsAttended={user.eventsAttended}
        eventsOrganized={user.eventsOrganized}
      />
      
      {/* Intereses del usuario */}
      <InterestsList interests={user.interests} />
      
      {/* Bio */}
      {user.bio && (
        <View style={styles.bioContainer}>
          <Text style={styles.bioLabel}>Acerca de</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>
      )}
      
      {/* Ubicación */}
      {user.location && (Object.values(user.location).some(val => val)) && (
        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Ubicación</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={colors.textLight} style={styles.locationIcon} />
            <Text style={styles.locationText}>
              {[user.location.city, user.location.state, user.location.country]
                .filter(Boolean)
                .join(', ')}
            </Text>
          </View>
        </View>
      )}
      
      {/* Espacio al final */}
      <View style={styles.footer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  headerButton: {
    padding: 8,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textDark,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  profileHeader: {
    padding: 20,
  },
  userInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  nameContainer: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  username: {
    fontSize: 16,
    color: colors.textLight,
    marginTop: 4,
  },
  bioContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  bioLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textDark,
  },
  locationContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  locationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    marginRight: 8,
  },
  locationText: {
    fontSize: 14,
    color: colors.textDark,
  },
  footer: {
    height: 32,
  },
});