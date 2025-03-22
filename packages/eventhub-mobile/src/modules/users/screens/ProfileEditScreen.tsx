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
import { ProfileUpdateData } from '../types';

/**
 * Pantalla para editar el perfil del usuario
 */
export function ProfileEditScreen() {
  const navigation = useNavigation();
  const { currentUser, updateProfile, loading, error } = useUser();
  
  // Estados para los campos del formulario
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');
  
  // Estado para errores de validación
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    username?: string;
    email?: string;
    phone?: string;
  }>({});
  
  // Cargar datos del usuario cuando el componente se monte o cambie currentUser
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setUsername(currentUser.username || '');
      setEmail(currentUser.email || '');
      setBio(currentUser.bio || '');
      setLocation(currentUser.location || '');
      setWebsite(currentUser.website || '');
      setPhone(currentUser.phone || '');
    }
  }, [currentUser]);
  
  // Función para validar el formulario
  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      username?: string;
      email?: string;
      phone?: string;
    } = {};
    
    // Validar nombre
    if (!name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }
    
    // Validar nombre de usuario
    if (!username.trim()) {
      errors.username = 'El nombre de usuario es obligatorio';
    } else if (username.includes(' ')) {
      errors.username = 'El nombre de usuario no puede contener espacios';
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      errors.email = 'El email es obligatorio';
    } else if (!emailRegex.test(email)) {
      errors.email = 'El email no es válido';
    }
    
    // Validar teléfono (opcional)
    if (phone.trim()) {
      const phoneRegex = /^\+?[0-9\s]{7,15}$/;
      if (!phoneRegex.test(phone)) {
        errors.phone = 'El formato del teléfono no es válido';
      }
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Función para manejar guardar cambios
  const handleSaveChanges = async () => {
    if (!validateForm()) {
      return;
    }
    
    const profileData: ProfileUpdateData = {
      name,
      username,
      bio,
      location,
      website,
      phone
    };
    
    try {
      await updateProfile(profileData);
      Alert.alert(
        'Perfil actualizado',
        'Tu información de perfil ha sido actualizada correctamente',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      Alert.alert(
        'Error',
        'No se pudo actualizar el perfil. Por favor, inténtalo de nuevo más tarde.'
      );
    }
  };
  
  // Función para cancelar y volver atrás
  const handleCancel = () => {
    navigation.goBack();
  };
  
  // Mostrar indicador de carga mientras se cargan los datos del usuario
  if (loading && !currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <View style={styles.avatarContainer}>
            {currentUser?.avatar ? (
              <TouchableOpacity style={styles.avatarButton}>
                <View style={styles.avatar}>
                  {/* Aquí iría la imagen del avatar */}
                </View>
                <View style={styles.changeAvatarIcon}>
                  <Ionicons name="camera" size={14} color={theme.colors.white} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.avatarButton}>
                <View style={styles.avatarPlaceholder}>
                  <Ionicons name="person" size={40} color={theme.colors.gray[300]} />
                </View>
                <View style={styles.changeAvatarIcon}>
                  <Ionicons name="camera" size={14} color={theme.colors.white} />
                </View>
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.inputGroup}>
            <Input
              label="Nombre"
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre completo"
              error={validationErrors.name}
              leftIcon={<Ionicons name="person-outline" size={20} color={theme.colors.gray[500]} />}
            />
            
            <Input
              label="Nombre de usuario"
              value={username}
              onChangeText={setUsername}
              placeholder="Tu nombre de usuario"
              error={validationErrors.username}
              leftIcon={<Ionicons name="at-outline" size={20} color={theme.colors.gray[500]} />}
            />
            
            <Input
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={validationErrors.email}
              leftIcon={<Ionicons name="mail-outline" size={20} color={theme.colors.gray[500]} />}
              editable={false} // El email generalmente no se puede cambiar
            />
            
            <Input
              label="Biografía"
              value={bio}
              onChangeText={setBio}
              placeholder="Cuéntanos sobre ti..."
              multiline
              numberOfLines={4}
              style={styles.multilineInput}
              leftIcon={<Ionicons name="document-text-outline" size={20} color={theme.colors.gray[500]} />}
            />
            
            <Input
              label="Ubicación"
              value={location}
              onChangeText={setLocation}
              placeholder="Tu ciudad, país"
              leftIcon={<Ionicons name="location-outline" size={20} color={theme.colors.gray[500]} />}
            />
            
            <Input
              label="Sitio web"
              value={website}
              onChangeText={setWebsite}
              placeholder="https://tusitio.com"
              keyboardType="url"
              autoCapitalize="none"
              leftIcon={<Ionicons name="globe-outline" size={20} color={theme.colors.gray[500]} />}
            />
            
            <Input
              label="Teléfono"
              value={phone}
              onChangeText={setPhone}
              placeholder="+34 612 345 678"
              keyboardType="phone-pad"
              error={validationErrors.phone}
              leftIcon={<Ionicons name="call-outline" size={20} color={theme.colors.gray[500]} />}
            />
          </View>
          
          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}
          
          <View style={styles.buttonContainer}>
            <Button 
              title="Guardar cambios" 
              onPress={handleSaveChanges} 
              loading={loading}
              containerStyle={styles.saveButton}
            />
            <Button 
              title="Cancelar" 
              onPress={handleCancel} 
              type="outline"
              containerStyle={styles.cancelButton}
            />
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    padding: 16,
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarButton: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.gray[100],
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeAvatarIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  inputGroup: {
    marginBottom: 24,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
  errorText: {
    color: theme.colors.error,
    ...theme.typography.body2,
    marginBottom: 16,
    textAlign: 'center',
  },
}); 