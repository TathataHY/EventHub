import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeSelector } from './ThemeSelector';
import { SettingsOption } from './SettingsOption';
import { useTheme } from '../../../shared/hooks/useTheme';

export const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <View style={styles.headerContainer}>
        <Text style={[styles.title, { color: theme.colors.text.primary }]}>Ajustes</Text>
      </View>
      
      {/* Secciones de ajustes */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Apariencia</Text>
        <View style={[styles.optionsContainer, { backgroundColor: theme.colors.background.default }]}>
          <ThemeSelector />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Cuenta</Text>
        <View style={[styles.optionsContainer, { backgroundColor: theme.colors.background.default }]}>
          <SettingsOption 
            icon="person-outline"
            title="Perfil"
            onPress={() => navigation.navigate('Profile')}
          />
          <SettingsOption 
            icon="notifications-outline"
            title="Notificaciones"
            onPress={() => navigation.navigate('NotificationPreferences')}
          />
          <SettingsOption 
            icon="lock-closed-outline"
            title="Privacidad"
            onPress={() => navigation.navigate('PrivacySettings')}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Soporte</Text>
        <View style={[styles.optionsContainer, { backgroundColor: theme.colors.background.default }]}>
          <SettingsOption 
            icon="help-circle-outline"
            title="Ayuda y Soporte"
            onPress={() => navigation.navigate('Help')}
          />
          <SettingsOption 
            icon="document-text-outline"
            title="Términos y Condiciones"
            onPress={() => navigation.navigate('Terms')}
          />
          <SettingsOption 
            icon="shield-checkmark-outline"
            title="Política de Privacidad"
            onPress={() => navigation.navigate('Privacy')}
          />
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text.secondary }]}>Acerca de</Text>
        <View style={[styles.optionsContainer, { backgroundColor: theme.colors.background.default }]}>
          <SettingsOption 
            icon="information-circle-outline"
            title="Información de la App"
            onPress={() => navigation.navigate('About')}
          />
          <SettingsOption 
            icon="star-outline"
            title="Calificar la App"
            onPress={() => Linking.openURL('https://play.google.com/store/apps/details?id=com.eventhub')}
          />
        </View>
      </View>
      
      <TouchableOpacity 
        style={[styles.logoutButton, { backgroundColor: theme.colors.error.main }]}
        onPress={() => alert('Cerrando sesión...')}
      >
        <Ionicons name="log-out-outline" size={20} color="white" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </TouchableOpacity>
      
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: theme.colors.text.secondary }]}>
          EventHub v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 20,
    textTransform: 'uppercase',
  },
  optionsContainer: {
    borderRadius: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  versionText: {
    fontSize: 14,
  },
}); 