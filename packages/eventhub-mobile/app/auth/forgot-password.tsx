import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
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
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Correo electrónico inválido').required('Correo electrónico requerido'),
});

export default function ForgotPassword() {
  const router = useRouter();
  const [emailSent, setEmailSent] = useState(false);

  const handleForgotPassword = async (values, { setSubmitting, setErrors }) => {
    try {
      await authService.requestPasswordReset(values.email);
      setEmailSent(true);
    } catch (error) {
      console.error('Error al solicitar recuperación de contraseña:', error);
      
      if (error.response?.status === 404) {
        setErrors({ email: 'No existe una cuenta con este correo electrónico' });
      } else {
        Alert.alert(
          'Error',
          'No se pudo procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.'
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
          source={{ uri: 'https://img.freepik.com/free-vector/forgot-password-concept-illustration_114360-1123.jpg?w=740&t=st=1710442120~exp=1710442720~hmac=6c1b8540e4afe28e93d0c14a44be364bd5728c0b6176984c33c93002fbd63c30' }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
        <Text style={styles.subtitle}>
          {emailSent 
            ? 'Hemos enviado un correo electrónico con instrucciones para restablecer tu contraseña'
            : 'Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña'}
        </Text>
      </View>
      
      {!emailSent ? (
        <Formik
          initialValues={{ email: '' }}
          validationSchema={ForgotPasswordSchema}
          onSubmit={handleForgotPassword}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.formContainer}>
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
              
              <Button 
                title="Enviar instrucciones"
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                size="large"
                fullWidth
                style={styles.submitButton}
              />
            </View>
          )}
        </Formik>
      ) : (
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <FontAwesome name="check-circle" size={60} color={theme.colors.primary.main} />
          </View>
          <Text style={styles.successText}>
            Si el correo electrónico está registrado, recibirás instrucciones para restablecer tu contraseña.
          </Text>
          <Button 
            title="Volver al inicio de sesión"
            onPress={() => router.replace('/auth/login')}
            size="large"
            fullWidth
            style={styles.backToLoginButton}
          />
        </View>
      )}
      
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>¿Recordaste tu contraseña? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.loginLink}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: theme.spacing.sm,
    color: theme.colors.text.primary,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  inputMargin: {
    marginBottom: theme.spacing.sm,
  },
  submitButton: {
    marginBottom: theme.spacing.md,
  },
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  successIcon: {
    marginBottom: theme.spacing.md,
  },
  successText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  backToLoginButton: {
    marginBottom: theme.spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: theme.spacing.md,
  },
  loginText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.sm,
  },
  loginLink: {
    color: theme.colors.primary.main,
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.sm,
  },
}); 