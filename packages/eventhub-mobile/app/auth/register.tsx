import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { authService } from '../../src/services/auth.service';
import Button from '../../src/components/ui/Button';
import Input from '../../src/components/ui/Input';
import theme from '../../src/theme';

// Esquema de validación
const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Nombre completo requerido'),
  email: Yup.string().email('Correo electrónico inválido').required('Correo electrónico requerido'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('Contraseña requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirmación de contraseña requerida'),
});

export default function Register() {
  const router = useRouter();

  const handleRegister = async (values, { setSubmitting, setErrors }) => {
    try {
      await authService.register({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword
      });
      
      Alert.alert(
        'Registro exitoso',
        'Tu cuenta ha sido creada. Ahora puedes iniciar sesión.',
        [
          { 
            text: 'Iniciar sesión', 
            onPress: () => router.replace('/auth/login') 
          }
        ]
      );
    } catch (error) {
      console.error('Error en registro:', error);
      
      if (error.response?.status === 409) {
        setErrors({ email: 'Este correo electrónico ya está registrado' });
      } else {
        Alert.alert(
          'Error de registro',
          'No se pudo completar el registro. Por favor, inténtalo de nuevo más tarde.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <StatusBar style="dark" />
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <FontAwesome name="arrow-left" size={20} color={theme.colors.primary.main} />
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://img.freepik.com/free-vector/mobile-login-concept-illustration_114360-83.jpg?w=740&t=st=1710442060~exp=1710442660~hmac=88d0f5ab1d6c12a63ab4a7ffa56233f2e9c0d0c7c926548b70fdc0b18261a9d2' }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Crear una cuenta</Text>
        <Text style={styles.subtitle}>Únete a EventHub y descubre eventos increíbles</Text>
      </View>
      
      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={RegisterSchema}
        onSubmit={handleRegister}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={styles.formContainer}>
            {/* Nombre completo */}
            <Input
              value={values.name}
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              placeholder="Nombre completo"
              leftIcon="user"
              error={touched.name && errors.name ? errors.name : undefined}
              style={styles.inputMargin}
            />
            
            {/* Correo electrónico */}
            <Input
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              placeholder="Correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="envelope"
              error={touched.email && errors.email ? errors.email : undefined}
              style={styles.inputMargin}
            />
            
            {/* Contraseña */}
            <Input
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              placeholder="Contraseña"
              secureTextEntry
              leftIcon="lock"
              error={touched.password && errors.password ? errors.password : undefined}
              style={styles.inputMargin}
            />
            
            {/* Confirmar contraseña */}
            <Input
              value={values.confirmPassword}
              onChangeText={handleChange('confirmPassword')}
              onBlur={handleBlur('confirmPassword')}
              placeholder="Confirmar contraseña"
              secureTextEntry
              leftIcon="lock"
              error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
              style={styles.inputMargin}
            />
            
            <Button
              title="Registrarse"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              size="large"
              fullWidth
              style={styles.registerButton}
            />
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={styles.loginLink}>Iniciar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  contentContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginTop: 80,
    marginBottom: 30,
  },
  image: {
    width: 200,
    height: 160,
    marginBottom: 20,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputMargin: {
    marginBottom: theme.spacing.sm,
  },
  registerButton: {
    marginVertical: theme.spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  loginText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  loginLink: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
}); 