import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Formik, FormikHelpers, FormikErrors } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../services';
import { useTheme, getColorValue, getIconColor } from '../../../core/theme';

interface ForgotPasswordValues {
  email: string;
}

export const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const [emailSent, setEmailSent] = useState(false);

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Ingresa un correo electrónico válido')
      .required('El correo electrónico es obligatorio')
  });
  
  const initialValues: ForgotPasswordValues = {
    email: ''
  };

  const handleForgotPassword = async (
    values: ForgotPasswordValues, 
    { setSubmitting, setErrors }: FormikHelpers<ForgotPasswordValues>
  ) => {
    try {
      // Llamada al servicio de restablecimiento de contraseña
      await authService.requestPasswordReset(values.email);
      
      // Mostrar información al usuario que el correo fue enviado
      setEmailSent(true);
    } catch (error: any) {
      // Manejar diferentes tipos de errores
      console.error('Error al solicitar restablecimiento de contraseña:', error);
      
      if (error.response?.data?.message) {
        // Error específico del servidor
        setErrors({ email: error.response.data.message });
      } else if (error.message) {
        // Error general
        setErrors({ email: error.message });
      } else {
        // Error desconocido
        setErrors({ 
          email: 'Ocurrió un error al procesar tu solicitud. Inténtalo nuevamente.'
        });
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
            Recupera tu contraseña
          </Text>
          <Text style={[styles.subtitle, { color: getColorValue(theme.colors.text.secondary) }]}>
            Introduce tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña
          </Text>
        </View>

        {emailSent ? (
          <View style={styles.successContainer}>
            <Ionicons 
              name="mail" 
              size={64} 
              color={getIconColor(theme.colors.success)} 
              style={styles.icon}
            />
            <Text style={[styles.successTitle, { color: getColorValue(theme.colors.text.primary) }]}>
              ¡Correo enviado!
            </Text>
            <Text style={[styles.successText, { color: getColorValue(theme.colors.text.secondary) }]}>
              Hemos enviado instrucciones para restablecer tu contraseña a tu dirección de correo electrónico. 
              Por favor, revisa tu bandeja de entrada.
            </Text>
            <TouchableOpacity 
              style={[
                styles.backButton, 
                { backgroundColor: getColorValue(theme.colors.primary) }
              ]}
              onPress={() => navigation.navigate('Login' as never)}
            >
              <Text style={styles.backButtonText}>
                Volver al inicio de sesión
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleForgotPassword}
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
                    Correo electrónico
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        borderColor: touched.email && errors.email
                          ? getColorValue(theme.colors.error)
                          : getColorValue(theme.colors.text.secondary + '40'),
                        color: getColorValue(theme.colors.text.primary)
                      }
                    ]}
                    placeholder="tu@email.com"
                    placeholderTextColor={getColorValue(theme.colors.text.secondary + '80')}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  {touched.email && errors.email && (
                    <Text style={[styles.errorText, { color: getColorValue(theme.colors.error) }]}>
                      {errors.email}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    { backgroundColor: getColorValue(theme.colors.primary) }
                  ]}
                  onPress={() => handleSubmit()}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>
                      Enviar instrucciones
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        )}

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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  formContainer: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
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
  submitButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
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