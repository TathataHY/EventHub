import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { authService } from '../src/services/auth.service';

// Esquema de validación
const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Contraseña actual requerida'),
  newPassword: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('Nueva contraseña requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), null], 'Las contraseñas deben coincidir')
    .required('Confirmación de contraseña requerida'),
});

export default function CambiarContrasena() {
  const router = useRouter();
  const [enviando, setEnviando] = useState(false);
  const [hideCurrentPassword, setHideCurrentPassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  const cambiarContrasena = async (values) => {
    try {
      setEnviando(true);
      await authService.changePassword(values.currentPassword, values.newPassword);
      Alert.alert('Éxito', 'Contraseña actualizada correctamente');
      router.back();
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      
      if (error.response?.status === 401) {
        Alert.alert('Error', 'La contraseña actual es incorrecta');
      } else {
        Alert.alert('Error', 'No se pudo actualizar la contraseña. Inténtalo de nuevo más tarde.');
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#4a80f5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cambiar Contraseña</Text>
        <View style={{ width: 20 }} />
      </View>
      
      <Formik
        initialValues={{
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }}
        validationSchema={PasswordSchema}
        onSubmit={cambiarContrasena}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña actual</Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu contraseña actual"
                  secureTextEntry={hideCurrentPassword}
                  onChangeText={handleChange('currentPassword')}
                  onBlur={handleBlur('currentPassword')}
                  value={values.currentPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setHideCurrentPassword(!hideCurrentPassword)}
                >
                  <FontAwesome 
                    name={hideCurrentPassword ? "eye" : "eye-slash"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
              {touched.currentPassword && errors.currentPassword && (
                <Text style={styles.errorText}>{errors.currentPassword}</Text>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nueva contraseña</Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu nueva contraseña"
                  secureTextEntry={hideNewPassword}
                  onChangeText={handleChange('newPassword')}
                  onBlur={handleBlur('newPassword')}
                  value={values.newPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setHideNewPassword(!hideNewPassword)}
                >
                  <FontAwesome 
                    name={hideNewPassword ? "eye" : "eye-slash"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
              {touched.newPassword && errors.newPassword && (
                <Text style={styles.errorText}>{errors.newPassword}</Text>
              )}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar nueva contraseña</Text>
              <View style={styles.inputContainer}>
                <FontAwesome name="lock" size={20} color="#999" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirma tu nueva contraseña"
                  secureTextEntry={hideConfirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                />
                <TouchableOpacity
                  style={styles.eyeButton}
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
            </View>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSubmit}
              disabled={enviando}
            >
              {enviando ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Cambiar Contraseña</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 50,
  },
  inputIcon: {
    padding: 10,
    width: 40,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    color: '#333',
  },
  eyeButton: {
    padding: 10,
    width: 40,
    alignItems: 'center',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#4a80f5',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 