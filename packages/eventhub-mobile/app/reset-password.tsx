import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { authService } from '../src/services/auth.service';

// Esquema de validación
const ResetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('Nueva contraseña requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
    .required('Confirmación de contraseña requerida'),
});

export default function ResetPassword() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [resetSuccessful, setResetSuccessful] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  
  const token = params.token as string;
  
  useEffect(() => {
    // Verificar si hay un token válido
    if (!token) {
      setTokenValid(false);
      Alert.alert(
        'Enlace inválido',
        'El enlace para restablecer tu contraseña no es válido o ha expirado.',
        [
          { text: 'Volver al inicio', onPress: () => router.replace('/') }
        ]
      );
    }
  }, [token, router]);

  const handleResetPassword = async (values, { setSubmitting, setErrors }) => {
    try {
      await authService.resetPassword(token, values.password);
      setResetSuccessful(true);
    } catch (error) {
      console.error('Error al restablecer contraseña:', error);
      
      if (error.response?.status === 400) {
        setErrors({ general: 'El enlace para restablecer tu contraseña no es válido o ha expirado.' });
      } else {
        Alert.alert(
          'Error',
          'No se pudo restablecer tu contraseña. Por favor, inténtalo de nuevo más tarde.'
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!tokenValid) {
    return null; // No renderizar nada si el token no es válido
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Image 
          source={{ uri: 'https://img.freepik.com/free-vector/reset-password-concept-illustration_114360-7866.jpg?w=740&t=st=1710442201~exp=1710442801~hmac=4dbcc48ecd6d5f96af74b5b5b5d0c3f4df97408c02ddeb81c5ffdc8cc9a9b53a' }}
          style={styles.image}
          resizeMode="contain"
        />
        {resetSuccessful ? (
          <>
            <Text style={styles.title}>¡Contraseña restablecida!</Text>
            <Text style={styles.subtitle}>Tu contraseña ha sido actualizada correctamente.</Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>Crear nueva contraseña</Text>
            <Text style={styles.subtitle}>Ingresa tu nueva contraseña</Text>
          </>
        )}
      </View>
      
      {!resetSuccessful ? (
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={ResetPasswordSchema}
          onSubmit={handleResetPassword}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.formContainer}>
              {errors.general && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errors.general}</Text>
                </View>
              )}
              
              {/* Nueva contraseña */}
              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nueva contraseña"
                  secureTextEntry={hidePassword}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setHidePassword(!hidePassword)}
                >
                  <FontAwesome 
                    name={hidePassword ? "eye" : "eye-slash"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
              {touched.password && errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
              
              {/* Confirmar contraseña */}
              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar contraseña"
                  secureTextEntry={hideConfirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
                >
                  <FontAwesome 
                    name={hideConfirmPassword ? "eye" : "eye-slash"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
              )}
              
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.resetButtonText}>Restablecer contraseña</Text>
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
            Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.loginButtonText}>Iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  errorContainer: {
    backgroundColor: '#ffe6e6',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
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
  eyeIcon: {
    padding: 10,
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
  resetButton: {
    backgroundColor: '#4a80f5',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  resetButtonText: {
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
  loginButton: {
    backgroundColor: '#4a80f5',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 