import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Componentes compartidos
import { Input } from '@shared/components/ui/Input';
import { Button } from '@shared/components/ui/Button';
import { Card } from '@shared/components/ui/Card';
import { theme } from '@theme/index';

// Hooks y servicios
import { useUser } from '../hooks/useUser';
import { ProfileUpdateData, UserProfile } from '../types';
import { useTheme } from '@shared/hooks/useTheme';
import { getColorValue } from '@theme/theme.types';

// Definir la interfaz UserLocation localmente ya que no se exporta correctamente
interface UserLocation {
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

/**
 * Interfaz extendida para incluir propiedades de ProfileUpdateData
 */
interface ExtendedUserProfile extends UserProfile {
  website?: string;
  avatar?: string;
  coverImage?: string;
}

/**
 * Pantalla para editar el perfil del usuario
 */
export const ProfileEditScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { currentUser, updateProfile, loading, error } = useUser();
  
  // Extended user para propiedades adicionales de ProfileUpdateData
  const extendedUser = currentUser as ExtendedUserProfile;
  
  // Estados para los campos editables
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  
  // Cargar datos actuales del usuario
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || currentUser.fullName || '');
      setUsername(currentUser.username || '');
      setBio(currentUser.bio || '');
      
      // Convertir location según su tipo
      if (currentUser.location) {
        if (typeof currentUser.location === 'string') {
          setLocation(currentUser.location);
        } else {
          // Si es un objeto, mostrar la ciudad o una cadena vacía
          const locationObj = currentUser.location as UserLocation;
          setLocation(locationObj.city || '');
        }
      }
      
      setWebsite(extendedUser.website || '');
      setPhone(currentUser.phone || '');
      setAvatar(extendedUser.avatar || currentUser.profileImage || currentUser.photoURL || null);
    }
  }, [currentUser]);
  
  // Validar formulario cuando cambian los datos
  useEffect(() => {
    setIsFormValid(!!name);
  }, [name]);
  
  // Enviar actualización del perfil
  const handleSubmit = async () => {
    if (!isFormValid) return;
    
    const profileData: ProfileUpdateData = {
      name,
      username: username || undefined,
      bio: bio || undefined,
      location: location || undefined,
      website: website || undefined,
      phone: phone || undefined,
      avatar: avatar || undefined
    };
    
    try {
      await updateProfile(profileData);
      navigation.goBack();
    } catch (err) {
      console.error('Error updating profile:', err);
      Alert.alert('Error', 'No se pudo actualizar el perfil. Intenta nuevamente.');
    }
  };
  
  // Mostrar indicador de carga
  if (loading && !currentUser) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={getColorValue(theme.colors.primary.main)} />
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={getColorValue(theme.colors.text.primary)} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: getColorValue(theme.colors.text.primary) }]}>
            Editar perfil
          </Text>
          <View style={styles.backButton} />
        </View>
        
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                style={styles.avatar}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: getColorValue(theme.colors.grey[200]) }]}>
                <Ionicons name="person" size={50} color={getColorValue(theme.colors.grey[400])} />
              </View>
            )}
            <TouchableOpacity
              style={[styles.avatarEditButton, { backgroundColor: getColorValue(theme.colors.primary.main) }]}
              onPress={() => {/* Implementar selección de avatar */}}
            >
              <Ionicons name="camera" size={16} color={getColorValue(theme.colors.common.white)} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.formContainer}>
          <Input
            label="Nombre"
            value={name}
            onChangeText={setName}
            placeholder="Tu nombre completo"
            error={name.length === 0 ? 'El nombre es obligatorio' : ''}
            leftIcon={<Ionicons name="person-outline" size={20} color={getColorValue(theme.colors.text.secondary)} />}
          />
          
          <Input
            label="Nombre de usuario"
            value={username}
            onChangeText={setUsername}
            placeholder="@nombreusuario"
            error={username.includes(' ') ? 'El nombre de usuario no puede contener espacios' : ''}
            leftIcon={<Ionicons name="at-outline" size={20} color={getColorValue(theme.colors.text.secondary)} />}
          />
          
          <Input
            label="Biografía"
            value={bio}
            onChangeText={setBio}
            placeholder="Cuéntanos sobre ti..."
            multiline
            numberOfLines={4}
            maxLength={160}
            textAlignVertical="top"
            containerStyle={styles.bioField}
            leftIcon={<Ionicons name="document-text-outline" size={20} color={getColorValue(theme.colors.text.secondary)} />}
          />
          
          <Input
            label="Ubicación"
            value={location}
            onChangeText={setLocation}
            placeholder="Tu ciudad o ubicación"
            error={location.length === 0 ? 'La ubicación es obligatoria' : ''}
            leftIcon={<Ionicons name="location-outline" size={20} color={getColorValue(theme.colors.text.secondary)} />}
          />
          
          <Input
            label="Sitio web"
            value={website}
            onChangeText={setWebsite}
            placeholder="https://tu-sitio-web.com"
            error={website.length === 0 ? 'El sitio web es obligatorio' : ''}
            leftIcon={<Ionicons name="globe-outline" size={20} color={getColorValue(theme.colors.text.secondary)} />}
            keyboardType="url"
          />
          
          <Input
            label="Teléfono"
            value={phone}
            onChangeText={setPhone}
            placeholder="Tu número de teléfono"
            error={phone.length < 7 ? 'El teléfono debe tener al menos 7 dígitos' : ''}
            leftIcon={<Ionicons name="call-outline" size={20} color={getColorValue(theme.colors.text.secondary)} />}
            keyboardType="phone-pad"
          />
        </View>
        
        <View style={styles.buttonsContainer}>
          <Button
            title="Guardar cambios"
            onPress={handleSubmit}
            disabled={!isFormValid || loading}
            loading={loading}
            containerStyle={styles.submitButton}
          />
          
          <Button
            title="Cancelar"
            onPress={() => navigation.goBack()}
            type="outline"
            containerStyle={styles.cancelButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  bioField: {
    height: 120,
  },
  buttonsContainer: {
    marginTop: 16,
  },
  submitButton: {
    marginBottom: 12,
  },
  cancelButton: {},
}); 