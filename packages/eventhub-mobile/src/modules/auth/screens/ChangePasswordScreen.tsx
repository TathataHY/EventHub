import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Ionicons } from '@expo/vector-icons';

import { appColors, appTypography, appSpacing } from '../../../theme';
import { Button, Input, Card } from '../../../shared/components/ui';
import { authService } from '../services/auth.service';

// Esquema de validación
const PasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Contraseña actual requerida'),
  newPassword: Yup.string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{6,}$/,
      'Debe contener al menos una mayúscula, una minúscula y un número'
    )
    .required('Nueva contraseña requerida'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Las contraseñas deben coincidir')
    .required('Confirmación de contraseña requerida'),
});

/**
 * Pantalla para cambiar la contraseña del usuario actual
 */
export const ChangePasswordScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Función para cambiar la contraseña
  const handleChangePassword = async (values) => {
    try {
      setLoading(true);
      await authService.changePassword(values.currentPassword, values.newPassword);
      Alert.alert(
        'Éxito', 
        'Contraseña actualizada correctamente',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      
      if (error.response?.status === 401) {
        Alert.alert('Error', 'La contraseña actual es incorrecta');
      } else {
        Alert.alert('Error', 'No se pudo actualizar la contraseña. Inténtalo de nuevo más tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Text style={styles.title}>Cambiar Contraseña</Text>
          <Text style={styles.subtitle}>
            Actualiza tu contraseña con una nueva que cumpla los requisitos de seguridad
          </Text>
          
          <Formik
            initialValues={{
              currentPassword: '',
              newPassword: '',
              confirmPassword: '',
            }}
            validationSchema={PasswordSchema}
            onSubmit={handleChangePassword}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.formContainer}>
                <Input
                  label="Contraseña actual"
                  placeholder="Ingresa tu contraseña actual"
                  secureTextEntry
                  leftIcon={<Ionicons name="lock-closed-outline" size={20} color={appColors.gray[500]} />}
                  onChangeText={handleChange('currentPassword')}
                  onBlur={handleBlur('currentPassword')}
                  value={values.currentPassword}
                  error={touched.currentPassword && errors.currentPassword}
                  style={styles.inputField}
                />
                
                <Input
                  label="Nueva contraseña"
                  placeholder="Ingresa tu nueva contraseña"
                  secureTextEntry
                  leftIcon={<Ionicons name="key-outline" size={20} color={appColors.gray[500]} />}
                  onChangeText={handleChange('newPassword')}
                  onBlur={handleBlur('newPassword')}
                  value={values.newPassword}
                  error={touched.newPassword && errors.newPassword}
                  style={styles.inputField}
                />
                
                <Input
                  label="Confirmar nueva contraseña"
                  placeholder="Confirma tu nueva contraseña"
                  secureTextEntry
                  leftIcon={<Ionicons name="checkmark-circle-outline" size={20} color={appColors.gray[500]} />}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  error={touched.confirmPassword && errors.confirmPassword}
                  style={styles.inputField}
                />
                
                <View style={styles.passwordHints}>
                  <Text style={styles.hintTitle}>La contraseña debe contener:</Text>
                  <View style={styles.hintItem}>
                    <Ionicons
                      name={values.newPassword.length >= 6 ? "checkmark-circle" : "ellipse-outline"}
                      size={16}
                      color={values.newPassword.length >= 6 ? appColors.success : appColors.gray[400]}
                    />
                    <Text style={styles.hintText}>Al menos 6 caracteres</Text>
                  </View>
                  <View style={styles.hintItem}>
                    <Ionicons
                      name={/[A-Z]/.test(values.newPassword) ? "checkmark-circle" : "ellipse-outline"}
                      size={16}
                      color={/[A-Z]/.test(values.newPassword) ? appColors.success : appColors.gray[400]}
                    />
                    <Text style={styles.hintText}>Al menos una letra mayúscula</Text>
                  </View>
                  <View style={styles.hintItem}>
                    <Ionicons
                      name={/[a-z]/.test(values.newPassword) ? "checkmark-circle" : "ellipse-outline"}
                      size={16}
                      color={/[a-z]/.test(values.newPassword) ? appColors.success : appColors.gray[400]}
                    />
                    <Text style={styles.hintText}>Al menos una letra minúscula</Text>
                  </View>
                  <View style={styles.hintItem}>
                    <Ionicons
                      name={/\d/.test(values.newPassword) ? "checkmark-circle" : "ellipse-outline"}
                      size={16}
                      color={/\d/.test(values.newPassword) ? appColors.success : appColors.gray[400]}
                    />
                    <Text style={styles.hintText}>Al menos un número</Text>
                  </View>
                </View>
                
                <View style={styles.buttonsContainer}>
                  <Button
                    title="Cancelar"
                    variant="outline"
                    onPress={() => router.back()}
                    style={styles.cancelButton}
                  />
                  <Button
                    title={loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                    onPress={handleSubmit}
                    disabled={loading}
                    loading={loading}
                    style={styles.submitButton}
                  />
                </View>
              </View>
            )}
          </Formik>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: appSpacing.md,
    justifyContent: 'center',
  },
  card: {
    padding: appSpacing.lg,
  },
  title: {
    ...appTypography.h4,
    color: appColors.text,
    marginBottom: appSpacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...appTypography.body2,
    color: appColors.gray[600],
    marginBottom: appSpacing.lg,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputField: {
    marginBottom: appSpacing.md,
  },
  passwordHints: {
    backgroundColor: appColors.gray[50],
    borderRadius: 8,
    padding: appSpacing.md,
    marginBottom: appSpacing.lg,
  },
  hintTitle: {
    ...appTypography.subtitle2,
    color: appColors.gray[700],
    marginBottom: appSpacing.xs,
  },
  hintItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: appSpacing.xs,
  },
  hintText: {
    ...appTypography.body2,
    color: appColors.gray[700],
    marginLeft: appSpacing.xs,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: appSpacing.md,
  },
  cancelButton: {
    flex: 1,
    marginRight: appSpacing.xs,
  },
  submitButton: {
    flex: 2,
    marginLeft: appSpacing.xs,
  },
}); 