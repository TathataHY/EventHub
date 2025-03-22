import React, { useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Text,
  Alert,
  RefreshControl
} from 'react-native';
import { UserAvatar, UserStats, InterestsList, ProfileInfo } from '../components';
import { useProfile } from '../hooks/useProfile';
import { UpdateProfileParams } from '../types';
import { colors } from '@theme';
import * as ImagePicker from 'expo-image-picker';

export const ProfileScreen: React.FC = () => {
  const { user, isLoading, error, loadProfile, updateProfile, uploadProfilePhoto } = useProfile();
  const [refreshing, setRefreshing] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);

  // Refrescar datos de perfil
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadProfile();
    setRefreshing(false);
  }, [loadProfile]);

  // Actualizar perfil
  const handleProfileUpdate = useCallback(async (data: UpdateProfileParams) => {
    return await updateProfile(data);
  }, [updateProfile]);

  // Seleccionar y subir foto de perfil
  const handleSelectPhoto = useCallback(async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permisos necesarios', 
          'Necesitamos permisos para acceder a tu galería'
        );
        return;
      }
      
      // Seleccionar imagen
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }
      
      const selectedImageUri = result.assets[0].uri;
      
      // Subir la imagen
      setPhotoUploading(true);
      const uploadResult = await uploadProfilePhoto(selectedImageUri);
      setPhotoUploading(false);
      
      if (!uploadResult.success) {
        Alert.alert('Error', uploadResult.error || 'Error al subir la foto');
      }
    } catch (err) {
      console.error('Error al seleccionar/subir foto:', err);
      setPhotoUploading(false);
      Alert.alert('Error', 'Ocurrió un error al procesar la imagen');
    }
  }, [uploadProfilePhoto]);

  // Mostrar indicador de carga
  if (isLoading && !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  // Mostrar mensaje de error
  if (error && !user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error}
        </Text>
        <Text style={styles.errorSubtext}>
          Desliza hacia abajo para intentar nuevamente
        </Text>
      </View>
    );
  }

  // Si no hay usuario, no debería ocurrir pero por si acaso
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
        <UserAvatar 
          photoURL={user.photoURL}
          size={100}
          showEditButton
          onEditPress={handleSelectPhoto}
        />
        
        <View style={styles.nameContainer}>
          <Text style={styles.fullName}>{user.fullName}</Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>
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
      
      {/* Información del perfil */}
      <ProfileInfo 
        user={user} 
        isEditable={true}
        onSave={handleProfileUpdate}
      />
      
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textDark,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f8f9fa',
  },
  errorText: {
    fontSize: 18,
    color: colors.danger,
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  nameContainer: {
    marginLeft: 16,
    flex: 1,
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
  footer: {
    height: 32,
  },
}); 