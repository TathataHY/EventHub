import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik, FormikHelpers, FormikErrors } from 'formik';
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
const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .required('El nombre es obligatorio'),
  email: Yup.string()
    .email('Correo electrónico inválido')
    .required('El correo electrónico es obligatorio'),
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es obligatoria'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});

// Interfaz para valores del formulario
interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * Pantalla de registro
 */
export const RegisterScreen = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (
    values: RegisterFormValues, 
    { setSubmitting, setErrors }: FormikHelpers<RegisterFormValues>
  ) => {
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword
      });
      // Redirigir al usuario a la pantalla principal tras registro exitoso
      router.replace('/(tabs)');
    } catch (error: any) {
      if (error.message?.includes('email')) {
        setErrors({ email: 'Este correo electrónico ya está en uso' });
      } else {
        setErrors({ 
          auth: 'Error al crear la cuenta. Por favor, inténtalo de nuevo.' 
        } as FormikErrors<RegisterFormValues> & { auth?: string });
      }
      console.error('Error al registrar:', error);
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Crear cuenta</Text>
          <Text style={styles.subtitle}>Únete a EventHub y descubre eventos increíbles</Text>
        </View>

        <Card style={styles.formCard}>
          <Formik
            initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={RegisterSchema}
            onSubmit={handleRegister}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
              <View style={styles.form}>
                <Input
                  label="Nombre completo"
                  placeholder="Tu nombre"
                  autoCapitalize="words"
                  value={values.name}
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  error={touched.name && errors.name ? errors.name : undefined}
                  leftIcon={<Ionicons name="person-outline" size={18} color={theme.colors.text} />}
                />

                <Input
                  label="Correo electrónico"
                  placeholder="tu@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  error={touched.email && errors.email ? errors.email : undefined}
                  leftIcon={<Ionicons name="mail-outline" size={18} color={theme.colors.text} />}
                />

                <Input
                  label="Contraseña"
                  placeholder="Contraseña"
                  secureTextEntry={!showPassword}
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  error={touched.password && errors.password ? errors.password : undefined}
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
                  placeholder="Confirma tu contraseña"
                  secureTextEntry={!showConfirmPassword}
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  error={touched.confirmPassword && errors.confirmPassword ? errors.confirmPassword : undefined}
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

                {(errors as any).auth && (
                  <Text style={styles.errorText}>{(errors as any).auth}</Text>
                )}

                <Button
                  title={isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
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
          <Text style={styles.footerText}>¿Ya tienes una cuenta?</Text>
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
    padding: 20,
  },
  header: {
    marginTop: 40,
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
    marginBottom: 40,
  },
  footerText: {
    color: theme.colors.textSecondary,
    marginRight: 5,
  },
  loginLink: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
}); 