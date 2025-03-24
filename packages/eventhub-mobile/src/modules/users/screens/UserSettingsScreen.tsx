import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { appColors as colors, appTypography as typography, appSpacing as spacing } from '../../../theme';
import { Card } from '@shared/components/ui';
import { userService } from '../services/user.service';
import { mockService } from '@core/services/mock.service';
import { UserAppPreferences } from '../types/user.types';

/**
 * Pantalla de configuración del usuario
 */
export const UserSettingsScreen = () => {
  const router = useRouter();
  const [preferences, setPreferences] = useState<UserAppPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      setLoading(true);
      const userPreferences = await userService.getPreferences();
      setPreferences(userPreferences);
    } catch (error) {
      console.error('Error al cargar preferencias:', error);
      Alert.alert('Error', 'No se pudieron cargar tus preferencias. Inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (key: keyof UserAppPreferences, value: boolean) => {
    if (!preferences) return;
    
    try {
      // Actualizar localmente para retroalimentación inmediata
      setPreferences({
        ...preferences,
        [key]: value
      });
      
      // Guardar en el servidor
      await userService.updatePreferences({ [key]: value });
    } catch (error) {
      console.error(`Error al actualizar preferencia ${key}:`, error);
      // Revertir cambio local si falló
      setPreferences({
        ...preferences,
        [key]: !value
      });
      Alert.alert('Error', 'No se pudo actualizar la configuración. Inténtalo de nuevo más tarde.');
    }
  };

  const handleNestedToggle = async (parent: keyof UserAppPreferences, key: string, value: any) => {
    if (!preferences) return;
    
    // Verificar que la propiedad padre exista y sea un objeto
    const parentObj = preferences[parent];
    if (!parentObj || typeof parentObj !== 'object' || Array.isArray(parentObj)) {
      console.error(`La propiedad ${parent} no existe o no es un objeto válido`);
      return;
    }
    
    try {
      // Crear una copia segura de las preferencias para actualizar
      const updatedParentObj = {...parentObj as Record<string, any>};
      updatedParentObj[key] = value;
      
      // Actualizar localmente para retroalimentación inmediata
      setPreferences({
        ...preferences,
        [parent]: updatedParentObj
      });
      
      // Guardar en el servidor
      await userService.updatePreferences({
        [parent]: updatedParentObj
      });
    } catch (error) {
      console.error(`Error al actualizar preferencia anidada ${parent}.${key}:`, error);
      
      // Revertir cambio local si falló
      const originalParentObj = {...parentObj as Record<string, any>};
      setPreferences({
        ...preferences,
        [parent]: originalParentObj
      });
      
      Alert.alert('Error', 'No se pudo actualizar la configuración. Inténtalo de nuevo más tarde.');
    }
  };

  const changeLanguage = async () => {
    try {
      router.push('/profile/settings/language');
    } catch (error) {
      console.error('Error al cambiar idioma:', error);
    }
  };
  
  const resetSettings = async () => {
    Alert.alert(
      'Restablecer configuración',
      '¿Estás seguro de que deseas restablecer todas las configuraciones a sus valores predeterminados?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Restablecer',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaving(true);
              // Llamar al servicio para restablecer
              const defaultPreferences = await userService.getDefaultPreferences();
              setPreferences(defaultPreferences);
              Alert.alert('Éxito', 'Se ha restablecido tu configuración a los valores predeterminados.');
            } catch (error) {
              console.error('Error al restablecer configuración:', error);
              Alert.alert('Error', 'No se pudo restablecer la configuración. Inténtalo de nuevo más tarde.');
            } finally {
              setSaving(false);
            }
          }
        }
      ]
    );
  };
  
  const deleteAccount = () => {
    Alert.alert(
      'Eliminar cuenta',
      'Esta acción no se puede deshacer. Todos tus datos, eventos y tickets se eliminarán permanentemente.',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar cuenta',
          style: 'destructive',
          onPress: () => {
            // Navegar a la pantalla de confirmación de eliminación
            router.push('/profile/settings/delete-account');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loaderText}>Cargando configuración...</Text>
      </View>
    );
  }

  if (!preferences) {
    return (
      <View style={styles.loaderContainer}>
        <Ionicons name="settings" size={64} color={colors.grey[300]} />
        <Text style={styles.emptyText}>No se pudo cargar la configuración</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Configuración</Text>
      <Text style={styles.subtitle}>Personaliza tu experiencia en la app</Text>
      
      {/* Sección de notificaciones */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Notificaciones push</Text>
            <Text style={styles.settingDescription}>Recibe alertas sobre eventos y actividad</Text>
          </View>
          <Switch
            value={preferences.notificationsEnabled}
            onValueChange={(value) => handleToggle('notificationsEnabled', value)}
            trackColor={{ false: colors.grey[300], true: colors.primary.main }}
            thumbColor={colors.common.white}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Notificaciones por email</Text>
            <Text style={styles.settingDescription}>Recibe resúmenes y notificaciones por correo</Text>
          </View>
          <Switch
            value={preferences.emailNotificationsEnabled}
            onValueChange={(value) => handleToggle('emailNotificationsEnabled', value)}
            trackColor={{ false: colors.grey[300], true: colors.primary.main }}
            thumbColor={colors.common.white}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Recordatorios de eventos</Text>
            <Text style={styles.settingDescription}>Recibe recordatorios antes de eventos</Text>
          </View>
          <Switch
            value={preferences.eventRemindersEnabled}
            onValueChange={(value) => handleToggle('eventRemindersEnabled', value)}
            trackColor={{ false: colors.grey[300], true: colors.primary.main }}
            thumbColor={colors.common.white}
          />
        </View>
      </Card>
      
      {/* Sección de Privacidad */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Privacidad</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Perfil público</Text>
            <Text style={styles.settingDescription}>Permite que otros usuarios vean tu perfil</Text>
          </View>
          <Switch
            value={preferences.privacySettings?.profileVisibility === 'public'}
            onValueChange={(value) => handleNestedToggle('privacySettings', 'profileVisibility', value ? 'public' : 'private')}
            trackColor={{ false: colors.grey[300], true: colors.primary.main }}
            thumbColor={colors.common.white}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Mostrar ubicación</Text>
            <Text style={styles.settingDescription}>Muestra tu ciudad en tu perfil</Text>
          </View>
          <Switch
            value={preferences.privacySettings?.locationSharing}
            onValueChange={(value) => handleNestedToggle('privacySettings', 'locationSharing', value)}
            trackColor={{ false: colors.grey[300], true: colors.primary.main }}
            thumbColor={colors.common.white}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Mostrar eventos</Text>
            <Text style={styles.settingDescription}>Muestra eventos a los que asistirás</Text>
          </View>
          <Switch
            value={preferences.privacySettings?.activitySharing}
            onValueChange={(value) => handleNestedToggle('privacySettings', 'activitySharing', value)}
            trackColor={{ false: colors.grey[300], true: colors.primary.main }}
            thumbColor={colors.common.white}
          />
        </View>
      </Card>
      
      {/* Sección de Apariencia */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Apariencia</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Modo oscuro</Text>
            <Text style={styles.settingDescription}>Cambiar tema de la aplicación</Text>
          </View>
          <Switch
            value={preferences.darkModeEnabled}
            onValueChange={(value) => handleToggle('darkModeEnabled', value)}
            trackColor={{ false: colors.grey[300], true: colors.primary.main }}
            thumbColor={colors.common.white}
          />
        </View>
        
        <TouchableOpacity style={styles.optionRow} onPress={changeLanguage}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Idioma</Text>
            <Text style={styles.settingDescription}>
              {preferences.language === 'es' ? 'Español' : 'English'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.grey[400]} />
        </TouchableOpacity>
      </Card>
      
      {/* Sección de Acciones */}
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Acciones</Text>
        
        <TouchableOpacity style={styles.actionRow} onPress={resetSettings}>
          <Ionicons name="refresh" size={20} color={colors.warning.main} />
          <Text style={[styles.actionText, { color: colors.warning.main }]}>
            Restablecer configuración
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionRow} onPress={deleteAccount}>
          <Ionicons name="trash" size={20} color={colors.error.main} />
          <Text style={[styles.actionText, { color: colors.error.main }]}>
            Eliminar cuenta
          </Text>
        </TouchableOpacity>
      </Card>
      
      <View style={styles.footer}>
        <Text style={styles.versionText}>EventHub v1.0.0</Text>
        <TouchableOpacity onPress={() => router.push('/profile/settings/about')}>
          <Text style={styles.linkText}>Acerca de EventHub</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loaderText: {
    fontSize: typography.body1.fontSize,
    lineHeight: typography.body1.lineHeight,
    fontWeight: 'normal',
    color: colors.grey[600],
    marginTop: spacing.md,
  },
  emptyText: {
    fontSize: typography.h6.fontSize,
    lineHeight: typography.h6.lineHeight,
    fontWeight: 'bold',
    color: colors.grey[600],
    marginTop: spacing.md,
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.h4.fontSize,
    lineHeight: typography.h4.lineHeight,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.body2.fontSize,
    lineHeight: typography.body2.lineHeight,
    fontWeight: 'normal',
    color: colors.grey[600],
  },
  section: {
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.subtitle1.fontSize,
    lineHeight: typography.subtitle1.lineHeight,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: typography.subtitle2.fontSize,
    lineHeight: typography.subtitle2.lineHeight,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: 'normal',
    color: colors.grey[600],
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  actionText: {
    fontSize: typography.subtitle2.fontSize,
    lineHeight: typography.subtitle2.lineHeight,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
  footer: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  versionText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: 'normal',
    color: colors.grey[500],
    marginBottom: spacing.xs,
  },
  linkText: {
    fontSize: typography.body2.fontSize,
    lineHeight: typography.body2.lineHeight,
    fontWeight: 'normal',
    color: colors.primary.main,
    textDecorationLine: 'underline',
  },
}); 