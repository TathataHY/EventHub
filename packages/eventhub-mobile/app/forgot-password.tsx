import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { authService } from '../src/services/auth.service';

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
        <FontAwesome name="arrow-left" size={20} color="#4a80f5" />
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
              <View style={styles.inputContainer}>
                <FontAwesome name="envelope" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Correo electrónico"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
              </View>
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
              
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Enviar instrucciones</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      ) : (
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <FontAwesome name="check-circle" size={60} color="#4a80f5" />
          </View>
          <Text style={styles.successText}>
            Si el correo electrónico está registrado, recibirás instrucciones para restablecer tu contraseña.
          </Text>
          <TouchableOpacity 
            style={styles.backToLoginButton}
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.backToLoginText}>Volver al inicio de sesión</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>¿Recordaste tu contraseña? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginLink}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  errorText: {
    color: '#ff3b30',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: '#4a80f5',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  successIcon: {
    marginBottom: 20,
  },
  successText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  backToLoginButton: {
    backgroundColor: '#4a80f5',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  backToLoginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#4a80f5',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 