import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Debes confirmar la contraseña'),
});

/**
 * Pantalla de restablecimiento de contraseña
 */
export const ResetPasswordScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const token = typeof params.token === 'string' ? params.token : '';
  const { resetPassword } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);

  const handleResetPassword = async (values, { setSubmitting, setErrors }) => {
    try {
      await resetPassword(token, values.password);
      setResetComplete(true);
    } catch (error) {
      setErrors({ auth: 'Error al restablecer la contraseña. Por favor, inténtalo de nuevo.' });
      console.error('Error al restablecer contraseña:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const navigateToLogin = () => {
    router.push('/auth/login');
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  if (resetComplete) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={80} color={theme.colors.success} style={styles.successIcon} />
          <Text style={styles.successTitle}>¡Contraseña restablecida!</Text>
          <Text style={styles.successMessage}>
            Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña.
          </Text>
          <Button
            title="Iniciar sesión"
            onPress={navigateToLogin}
            style={styles.loginButton}
          />
        </View>
      </View>
    );
  }

  if (!token) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={80} color={theme.colors.error} style={styles.errorIcon} />
          <Text style={styles.errorTitle}>Enlace inválido</Text>
          <Text style={styles.errorMessage}>
            El enlace para restablecer la contraseña es inválido o ha expirado. 
            Por favor, solicita un nuevo enlace de restablecimiento.
          </Text>
          <Button
            title="Volver a inicio de sesión"
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
          <Text style={styles.title}>Crear nueva contraseña</Text>
          <Text style={styles.subtitle}>Ingresa y confirma tu nueva contraseña</Text>
        </View>

        <Card style={styles.formCard}>
          <Formik
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={ResetPasswordSchema}
            onSubmit={handleResetPassword}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View style={styles.form}>
                <Input
                  label="Nueva contraseña"
                  placeholder="Mínimo 6 caracteres"
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

                <Input
                  label="Confirmar contraseña"
                  placeholder="Repite tu contraseña"
                  secureTextEntry={!showConfirmPassword}
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  error={touched.confirmPassword && errors.confirmPassword}
                  leftIcon={<Ionicons name="lock-closed-outline" size={18} color={theme.colors.text} />}
                  rightIcon={
                    <TouchableOpacity onPress={toggleShowConfirmPassword}>
                      <Ionicons
                        name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color={theme.colors.text}
                      />
                    </TouchableOpacity>
                  }
                />

                {errors.auth && (
                  <Text style={styles.errorText}>{errors.auth}</Text>
                )}

                <Button
                  title={isSubmitting ? 'Guardando...' : 'Guardar nueva contraseña'}
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
          <TouchableOpacity onPress={navigateToLogin}>
            <Text style={styles.loginLink}>Volver al inicio de sesión</Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorIcon: {
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  loginButton: {
    minWidth: 200,
  },
}); 