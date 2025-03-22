import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Button from '../../src/components/ui/Button';
import Input from '../../src/components/ui/Input';
import Avatar from '../../src/components/ui/Avatar';
import Card from '../../src/components/ui/Card';
import theme from '../../src/theme';

// Datos de ejemplo para desarrollo
const USUARIO_MOCK = {
  id: '1',
  nombre: 'Carlos Rodríguez',
  email: 'carlos.rodriguez@example.com',
  fotoPerfil: 'https://randomuser.me/api/portraits/men/32.jpg',
  bio: 'Amante de los eventos culturales y la música en vivo. Siempre buscando nuevas experiencias.',
  telefono: '+34 612 345 678',
  ciudad: 'Madrid'
};

// Esquema de validación
const ProfileSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .required('Nombre requerido'),
  email: Yup.string()
    .email('Email inválido')
    .required('Email requerido'),
  bio: Yup.string()
    .max(250, 'La biografía debe tener máximo 250 caracteres'),
  telefono: Yup.string()
    .matches(/^[+\d\s()-]{7,20}$/, 'Formato de teléfono inválido'),
  ciudad: Yup.string()
});

export default function EditarPerfilScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Cargar datos del usuario
  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setUsuario(USUARIO_MOCK);
      setAvatarPreview(USUARIO_MOCK.fotoPerfil);
      setIsLoading(false);
    }, 800);
  }, []);

  // Manejar envío del formulario
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const userData = {
        ...values,
        fotoPerfil: avatarPreview
      };

      console.log('Datos del usuario a actualizar:', userData);
      
      // En producción, descomentar:
      // await userService.updateProfile(userData);

      Alert.alert(
        'Éxito',
        'Perfil actualizado correctamente',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      Alert.alert(
        'Error',
        'No se pudo actualizar el perfil. Por favor, inténtalo de nuevo más tarde.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Seleccionar avatar
  const handleSelectAvatar = () => {
    // En una implementación real, aquí se abriría un selector de imágenes
    Alert.alert(
      'Cambiar foto de perfil',
      'Esta funcionalidad estaría implementada con un selector de imágenes real',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Usar avatar de ejemplo', 
          onPress: () => {
            // Rotar entre algunos avatares de ejemplo
            const avatares = [
              'https://randomuser.me/api/portraits/men/32.jpg',
              'https://randomuser.me/api/portraits/women/44.jpg',
              'https://randomuser.me/api/portraits/men/45.jpg',
              'https://randomuser.me/api/portraits/women/68.jpg',
              'https://randomuser.me/api/portraits/men/86.jpg'
            ];
            const currentIndex = avatares.indexOf(avatarPreview);
            const nextIndex = (currentIndex + 1) % avatares.length;
            setAvatarPreview(avatares[nextIndex]);
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Button 
          title="Cargando..." 
          loading={true}
          disabled={true}
          style={styles.loadingButton}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color={theme.colors.common.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar perfil</Text>
      </View>

      <View style={styles.avatarContainer}>
        <Avatar 
          source={{ uri: avatarPreview }}
          size="xlarge"
          style={styles.avatar}
        />
        <TouchableOpacity 
          style={styles.changeAvatarButton}
          onPress={handleSelectAvatar}
        >
          <FontAwesome name="camera" size={16} color={theme.colors.common.white} />
        </TouchableOpacity>
      </View>

      <Formik
        initialValues={{
          nombre: usuario.nombre,
          email: usuario.email,
          bio: usuario.bio || '',
          telefono: usuario.telefono || '',
          ciudad: usuario.ciudad || ''
        }}
        validationSchema={ProfileSchema}
        onSubmit={handleSubmit}
      >
        {({ 
          handleChange, 
          handleBlur, 
          handleSubmit, 
          values, 
          errors, 
          touched, 
          isSubmitting
        }) => (
          <Card style={styles.formCard}>
            {/* Nombre */}
            <Input
              label="Nombre completo"
              value={values.nombre}
              onChangeText={handleChange('nombre')}
              onBlur={handleBlur('nombre')}
              placeholder="Tu nombre completo"
              error={touched.nombre && errors.nombre ? errors.nombre : undefined}
              leftIcon="user"
              style={styles.input}
            />

            {/* Email */}
            <Input
              label="Correo electrónico"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              error={touched.email && errors.email ? errors.email : undefined}
              leftIcon="envelope"
              style={styles.input}
            />

            {/* Biografía */}
            <Input
              label="Biografía"
              value={values.bio}
              onChangeText={handleChange('bio')}
              onBlur={handleBlur('bio')}
              placeholder="Cuéntanos sobre ti..."
              multiline
              numberOfLines={4}
              error={touched.bio && errors.bio ? errors.bio : undefined}
              leftIcon="align-left"
              style={styles.input}
              textAlignVertical="top"
            />

            {/* Teléfono */}
            <Input
              label="Teléfono (opcional)"
              value={values.telefono}
              onChangeText={handleChange('telefono')}
              onBlur={handleBlur('telefono')}
              placeholder="+34 612 345 678"
              keyboardType="phone-pad"
              error={touched.telefono && errors.telefono ? errors.telefono : undefined}
              leftIcon="phone"
              style={styles.input}
            />

            {/* Ciudad */}
            <Input
              label="Ciudad (opcional)"
              value={values.ciudad}
              onChangeText={handleChange('ciudad')}
              onBlur={handleBlur('ciudad')}
              placeholder="Tu ciudad"
              error={touched.ciudad && errors.ciudad ? errors.ciudad : undefined}
              leftIcon="map-marker"
              style={styles.input}
            />

            {/* Contraseña */}
            <TouchableOpacity 
              style={styles.changePasswordButton}
              onPress={() => router.push('/auth/cambiar-contrasena')}
            >
              <FontAwesome name="lock" size={16} color={theme.colors.primary.main} style={styles.passwordIcon} />
              <Text style={styles.changePasswordText}>Cambiar contraseña</Text>
            </TouchableOpacity>

            {/* Botones de acción */}
            <View style={styles.buttonContainer}>
              <Button
                title="Cancelar"
                onPress={() => router.back()}
                variant="outline"
                style={styles.cancelButton}
              />
              <Button
                title="Guardar cambios"
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={styles.submitButton}
              />
            </View>
            
            {/* Eliminar cuenta */}
            <TouchableOpacity 
              style={styles.deleteAccountButton}
              onPress={() => {
                Alert.alert(
                  'Eliminar cuenta',
                  '¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    { 
                      text: 'Eliminar', 
                      style: 'destructive',
                      onPress: () => {
                        Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada correctamente.');
                        router.replace('/auth/login');
                      }
                    }
                  ]
                );
              }}
            >
              <FontAwesome name="trash" size={16} color={theme.colors.error.main} style={styles.deleteIcon} />
              <Text style={styles.deleteAccountText}>Eliminar cuenta</Text>
            </TouchableOpacity>
          </Card>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.default,
  },
  loadingButton: {
    width: 150,
  },
  header: {
    height: 120,
    backgroundColor: theme.colors.primary.main,
    paddingTop: 40,
    paddingHorizontal: theme.spacing.md,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.common.white,
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -40,
    marginBottom: theme.spacing.md,
  },
  avatar: {
    borderWidth: 3,
    borderColor: theme.colors.common.white,
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: theme.colors.primary.main,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.common.white,
  },
  formCard: {
    margin: theme.spacing.md,
    padding: theme.spacing.md,
    ...theme.shadows.md,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  changePasswordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  passwordIcon: {
    marginRight: theme.spacing.sm,
  },
  changePasswordText: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
  },
  cancelButton: {
    flex: 1,
    marginRight: theme.spacing.xs,
  },
  submitButton: {
    flex: 2,
    marginLeft: theme.spacing.xs,
  },
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
  },
  deleteIcon: {
    marginRight: theme.spacing.sm,
  },
  deleteAccountText: {
    color: theme.colors.error.main,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
}); 