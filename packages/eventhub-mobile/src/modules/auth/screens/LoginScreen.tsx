import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
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
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es obligatorio'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
});

/**
 * Pantalla de inicio de sesión
 */
export const LoginScreen = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (values, { setSubmitting, setErrors }) => {
    try {
      await login(values.email, values.password);
      router.replace('/(tabs)');
    } catch (error) {
      setErrors({ auth: 'Credenciales incorrectas. Por favor, inténtalo de nuevo.' });
      console.error('Error al iniciar sesión:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const navigateToRegister = () => {
    router.push('/auth/register');
  };

  const navigateToForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.subtitle}>Bienvenido de nuevo a EventHub</Text>
        </View>

        <Card style={styles.formCard}>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
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

                <Input
                  label="Contraseña"
                  placeholder="Contraseña"
                  secureTextEntry={!showPassword}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={touched.password && errors.password}
                  leftIcon={<Ionicons name="lock-closed-outline" size={18} color={theme.colors.text} />}
                  rightIcon={
                    <TouchableOpacity onPress={toggleShowPassword}>
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color={theme.colors.text}
                      />
                    </TouchableOpacity>
                  }
                />

                {errors.auth && (
                  <Text style={styles.errorText}>{errors.auth}</Text>
                )}

                <TouchableOpacity 
                  style={styles.forgotPassword} 
                  onPress={navigateToForgotPassword}
                >
                  <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

                <Button
                  title={isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
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
          <Text style={styles.footerText}>¿No tienes una cuenta?</Text>
          <TouchableOpacity onPress={navigateToRegister}>
            <Text style={styles.registerLink}>Regístrate aquí</Text>
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
  },
  formCard: {
    padding: 20,
    marginBottom: 20,
  },
  form: {
    gap: 16,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 14,
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
  registerLink: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
}); 