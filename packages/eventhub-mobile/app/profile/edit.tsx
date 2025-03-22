import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Divider } from '../../src/components/common/Divider';

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Estados para los campos del formulario
  const [name, setName] = useState('María García');
  const [username, setUsername] = useState('mariagarcia');
  const [email, setEmail] = useState('maria.garcia@ejemplo.com');
  const [bio, setBio] = useState('Organizadora de eventos culturales y amante de la música en vivo');
  const [location, setLocation] = useState('Madrid, España');
  const [website, setWebsite] = useState('');
  const [phone, setPhone] = useState('');

  // Validación de formulario
  const validateForm = () => {
    // Validar nombre
    if (!name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return false;
    }

    // Validar nombre de usuario
    if (!username.trim()) {
      Alert.alert('Error', 'El nombre de usuario es obligatorio');
      return false;
    }

    // Validar email con expresión regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      Alert.alert('Error', 'Por favor, introduce un email válido');
      return false;
    }

    return true;
  };

  // Manejar la actualización del perfil
  const handleSaveChanges = () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulamos la actualización del perfil
    setTimeout(() => {
      setIsLoading(false);
      
      Alert.alert(
        'Éxito',
        'Tu perfil ha sido actualizado correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    }, 1500);
  };

  // Manejar cancelación
  const handleCancel = () => {
    Alert.alert(
      'Cancelar edición',
      '¿Estás seguro de que quieres cancelar? Los cambios no se guardarán.',
      [
        { text: 'No', style: 'cancel' },
        { text: 'Sí', onPress: () => router.back() }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleCancel}
          >
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Editar Perfil
          </Text>
          
          <TouchableOpacity
            style={[
              styles.saveButton,
              { backgroundColor: theme.colors.primary },
              isLoading && { opacity: 0.7 }
            ]}
            onPress={handleSaveChanges}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>

        <Divider />

        <View style={styles.profileImageSection}>
          <View style={[styles.profileImageContainer, { backgroundColor: theme.colors.secondaryText }]}>
            <Ionicons name="person" size={40} color={theme.colors.card} />
          </View>
          
          <TouchableOpacity
            style={[styles.changePhotoButton, { backgroundColor: theme.colors.primary }]}
          >
            <Ionicons name="camera" size={16} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={[styles.changePhotoText, { color: theme.colors.primary }]}>
            Cambiar foto de perfil
          </Text>
        </View>

        <View style={styles.formSection}>
          {/* Nombre */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              Nombre
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre completo"
              placeholderTextColor={theme.colors.secondaryText}
            />
          </View>

          {/* Nombre de usuario */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              Nombre de usuario
            </Text>
            <View style={styles.usernameInputContainer}>
              <Text style={[styles.atSymbol, { color: theme.colors.secondaryText }]}>@</Text>
              <TextInput
                style={[
                  styles.usernameInput,
                  { 
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                  }
                ]}
                value={username}
                onChangeText={setUsername}
                placeholder="username"
                placeholderTextColor={theme.colors.secondaryText}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              Email
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              value={email}
              onChangeText={setEmail}
              placeholder="tu.email@ejemplo.com"
              placeholderTextColor={theme.colors.secondaryText}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Teléfono */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              Teléfono (opcional)
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              value={phone}
              onChangeText={setPhone}
              placeholder="Tu teléfono"
              placeholderTextColor={theme.colors.secondaryText}
              keyboardType="phone-pad"
            />
          </View>

          {/* Ubicación */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              Ubicación
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              value={location}
              onChangeText={setLocation}
              placeholder="Ciudad, País"
              placeholderTextColor={theme.colors.secondaryText}
            />
          </View>

          {/* Sitio web */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              Sitio web (opcional)
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              value={website}
              onChangeText={setWebsite}
              placeholder="https://tusitio.com"
              placeholderTextColor={theme.colors.secondaryText}
              keyboardType="url"
              autoCapitalize="none"
            />
          </View>

          {/* Biografía */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              Biografía
            </Text>
            <TextInput
              style={[
                styles.bioInput,
                { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                }
              ]}
              value={bio}
              onChangeText={setBio}
              placeholder="Cuéntanos sobre ti..."
              placeholderTextColor={theme.colors.secondaryText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={[styles.characterCount, { color: theme.colors.secondaryText }]}>
              {bio.length}/150 caracteres
            </Text>
          </View>
        </View>

        <Divider />

        <View style={styles.dangerZone}>
          <Text style={[styles.dangerZoneTitle, { color: theme.colors.error }]}>
            Zona de peligro
          </Text>
          
          <TouchableOpacity
            style={[styles.deleteAccountButton, { borderColor: theme.colors.error }]}
            onPress={() => 
              Alert.alert(
                'Eliminar cuenta',
                '¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.',
                [
                  { text: 'Cancelar', style: 'cancel' },
                  { 
                    text: 'Eliminar', 
                    style: 'destructive',
                    onPress: () => console.log('Cuenta eliminada') 
                  }
                ]
              )
            }
          >
            <Ionicons name="trash-outline" size={18} color={theme.colors.error} />
            <Text style={[styles.deleteAccountText, { color: theme.colors.error }]}>
              Eliminar mi cuenta
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  profileImageSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 45,
    right: '35%',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  changePhotoText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  formSection: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  usernameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  atSymbol: {
    fontSize: 16,
    marginRight: 4,
  },
  usernameInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
  },
  bioInput: {
    minHeight: 100,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
  },
  characterCount: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  dangerZone: {
    padding: 16,
  },
  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
  },
  deleteAccountText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
}); 