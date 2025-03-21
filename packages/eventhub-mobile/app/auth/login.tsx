import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
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
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Correo electrónico inválido').required('Correo electrónico requerido'),
  password: Yup.string().min(6, 'La contraseña debe tener al menos 6 caracteres').required('Contraseña requerida'),
});

export default function Login() {
  const router = useRouter();

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      await authService.login({
        email: values.email,
        password: values.password
      });
      // Redirigir a la pantalla principal después del inicio de sesión exitoso
      router.replace('/tabs');
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      if (error.response?.status === 401) {
        setErrors({ general: 'Credenciales incorrectas' });
      } else {
        Alert.alert(
          'Error de inicio de sesión',
          'No se pudo iniciar sesión. Por favor, inténtalo de nuevo más tarde.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <FontAwesome name="arrow-left" size={20} color={theme.colors.primary.main} />
      </TouchableOpacity>
      
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://img.freepik.com/free-vector/sign-concept-illustration_114360-125.jpg?w=740&t=st=1710441991~exp=1710442591~hmac=f0c31be60a53b77b76e07d9520ca22da4e0efd7acefbe3f2bfc9a80c8ab10c2e' }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>¡Bienvenido de nuevo!</Text>
        <Text style={styles.subtitle}>Inicia sesión para continuar</Text>
      </View>
      
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleLogin}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
          <View style={styles.formContainer}>
            {errors.general && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.general}</Text>
              </View>
            )}
            
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
            
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => router.push('/auth/forgot-password')}
            >
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
            
            <Button
              title="Iniciar Sesión"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting}
              size="large"
              fullWidth
              style={styles.loginButton}
            />
            
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => router.push('/auth/register')}>
                <Text style={styles.signupLink}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.default,
    padding: theme.spacing.md,
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
  },
  formContainer: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: theme.colors.error.light,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.error.main,
    fontSize: theme.typography.fontSize.sm,
  },
  inputMargin: {
    marginBottom: theme.spacing.sm,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.md,
  },
  forgotPasswordText: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.fontSize.sm,
  },
  loginButton: {
    marginBottom: theme.spacing.md,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
  },
  signupText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  signupLink: {
    color: theme.colors.primary.main,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
}); 