import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';

// Componentes compartidos
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Card } from '../../../shared/components/ui/Card';
import { theme } from '../../../theme';

// Servicios y hooks
import { useAuth } from '../hooks/useAuth';

// Esquema de validación del formulario
const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es obligatorio'),
});

/**
 * Pantalla de recuperación de contraseña
 */
export const ForgotPasswordScreen = () => {
  const router = useRouter();
  const { requestPasswordReset } = useAuth();
  const [emailSent, setEmailSent] = useState(false);

  const handleForgotPassword = async (values, { setSubmitting, setErrors }) => {
    try {
      await requestPasswordReset(values.email);
      setEmailSent(true);
    } catch (error) {
      if (error.response?.status === 404) {
        setErrors({ email: 'No existe una cuenta con este correo electrónico' });
      } else {
        setErrors({ auth: 'Error al procesar tu solicitud. Por favor, inténtalo de nuevo.' });
      }
      console.error('Error al solicitar recuperación de contraseña:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  if (emailSent) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={80} color={theme.colors.success} style={styles.successIcon} />
          <Text style={styles.successTitle}>Correo enviado</Text>
          <Text style={styles.successMessage}>
            Hemos enviado instrucciones para restablecer tu contraseña a tu correo electrónico.
            Por favor, revisa tu bandeja de entrada.
          </Text>
          <Button
            title="Volver a iniciar sesión"
            onPress={navigateToLogin}
            style={styles.loginButton}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>¿Olvidaste tu contraseña?</Text>
          <Text style={styles.subtitle}>Ingresa tu correo electrónico para recibir instrucciones</Text>
        </View>

        <Card style={styles.formCard}>
          <Formik
            initialValues={{ email: '' }}
            validationSchema={ForgotPasswordSchema}
            onSubmit={handleForgotPassword}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View style={styles.form}>
                <Input
                  label="Correo electrónico"
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={touched.email && errors.email}
                  leftIcon={<Ionicons name="mail-outline" size={18} color={theme.colors.text} />}
                />

                {errors.auth && (
                  <Text style={styles.errorText}>{errors.auth}</Text>
                )}

                <Button
                  title={isSubmitting ? 'Enviando...' : 'Recuperar contraseña'}
                  onPress={handleSubmit}
                  disabled={isSubmitting}
                  loading={isSubmitting}
                  style={styles.submitButton}
                />
              </View>
            )}
          </Formik>
        </Card>

        <View style={styles.footer}>
          <Text style={styles.footerText}>¿Recordaste tu contraseña?</Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={styles.loginLink}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  formCard: {
    padding: 20,
    marginBottom: 20,
  },
  form: {
    gap: 16,
  },
  submitButton: {
    marginTop: 24,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 14,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: theme.colors.textSecondary,
    marginRight: 5,
  },
  loginLink: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  successMessage: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  loginButton: {
    minWidth: 200,
  },
}); 