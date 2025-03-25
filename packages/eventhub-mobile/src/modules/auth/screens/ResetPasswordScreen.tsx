import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../services';
import { useTheme, getColorValue, getIconColor } from '../../../core/theme';
import { Button } from '@shared/components/ui';

interface ResetPasswordValues {
  password: string;
  confirmPassword: string;
  token: string;
}

export const ResetPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [isSuccess, setIsSuccess] = useState(false);

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número'
      )
      .required('La contraseña es obligatoria'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
      .required('Confirma tu contraseña'),
    token: Yup.string().required('El token de restablecimiento es obligatorio')
  });

  const initialValues: ResetPasswordValues = {
    password: '',
    confirmPassword: '',
    token: ''
  };

  const handleResetPassword = async (
    values: ResetPasswordValues,
    { setSubmitting, setErrors }: FormikHelpers<ResetPasswordValues>
  ) => {
    try {
      // Llamar al servicio para restablecer la contraseña
      const response = await authService.resetPassword(
        values.token,
        values.password
      );
      
      // Marcar como exitoso y mostrar mensaje
      setIsSuccess(true);
      
      // Redirección automática después de 3 segundos
      setTimeout(() => {
        navigation.navigate('Login' as never);
      }, 3000);
    } catch (error: any) {
      // Manejar error
      console.error('Error resetting password:', error);
      if (error.response?.data?.message) {
        Alert.alert('Error', error.response.data.message);
      } else {
        Alert.alert('Error', 'No se pudo restablecer tu contraseña. Verifica el token e inténtalo nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, { backgroundColor: getColorValue(theme.colors.background) }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: getColorValue(theme.colors.text.primary) }]}>
            Restablece tu contraseña
          </Text>
          {isSuccess && (
            <Text style={[styles.successMessage, { color: getColorValue(theme.colors.success) }]}>
              ¡Contraseña restablecida con éxito! Redirigiendo...
            </Text>
          )}
        </View>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleResetPassword}
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
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: getColorValue(theme.colors.text.primary) }]}>
                  Token de restablecimiento
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: touched.token && errors.token
                        ? getColorValue(theme.colors.error)
                        : getColorValue(theme.colors.text.secondary + '40'),
                      color: getColorValue(theme.colors.text.primary)
                    }
                  ]}
                  placeholder="Ingresa el token recibido por email"
                  placeholderTextColor={getColorValue(theme.colors.text.secondary + '80')}
                  onChangeText={handleChange('token')}
                  onBlur={handleBlur('token')}
                  value={values.token}
                  autoCapitalize="none"
                />
                {touched.token && errors.token && (
                  <Text style={[styles.errorText, { color: getColorValue(theme.colors.error) }]}>
                    {errors.token}
                  </Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: getColorValue(theme.colors.text.primary) }]}>
                  Nueva contraseña
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: touched.password && errors.password
                        ? getColorValue(theme.colors.error)
                        : getColorValue(theme.colors.text.secondary + '40'),
                      color: getColorValue(theme.colors.text.primary)
                    }
                  ]}
                  placeholder="Ingresa tu nueva contraseña"
                  placeholderTextColor={getColorValue(theme.colors.text.secondary + '80')}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                />
                {touched.password && errors.password && (
                  <Text style={[styles.errorText, { color: getColorValue(theme.colors.error) }]}>
                    {errors.password}
                  </Text>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: getColorValue(theme.colors.text.primary) }]}>
                  Confirmar contraseña
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      borderColor: touched.confirmPassword && errors.confirmPassword
                        ? getColorValue(theme.colors.error)
                        : getColorValue(theme.colors.text.secondary + '40'),
                      color: getColorValue(theme.colors.text.primary)
                    }
                  ]}
                  placeholder="Confirma tu nueva contraseña"
                  placeholderTextColor={getColorValue(theme.colors.text.secondary + '80')}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  secureTextEntry
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <Text style={[styles.errorText, { color: getColorValue(theme.colors.error) }]}>
                    {errors.confirmPassword}
                  </Text>
                )}
              </View>

              <Button
                title="Restablecer contraseña"
                onPress={handleSubmit}
                loading={isSubmitting}
              />
            </View>
          )}
        </Formik>

        <TouchableOpacity
          style={styles.backContainer}
          onPress={() => navigation.navigate('Login' as never)}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color={getIconColor(theme.colors.primary)}
          />
          <Text style={[styles.backText, { color: getColorValue(theme.colors.primary) }]}>
            Volver al inicio de sesión
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  formContainer: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 16,
    marginLeft: 8,
  }
}); 