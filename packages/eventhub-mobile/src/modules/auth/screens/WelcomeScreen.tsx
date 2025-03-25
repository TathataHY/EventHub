import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { useTheme, getColorValue, getIconColor } from '../../../core/theme';
import { Button } from '../../../shared/components/ui';

/**
 * Pantalla de bienvenida que se muestra como punto de entrada a la autenticación
 */
export const WelcomeScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();

  // Obtener el logo según el tema
  const getLogo = () => {
    return theme.dark 
      ? require('@assets/images/logo/logo-dark.png')
      : require('@assets/images/logo/logo-light.png');
  };

  // Navegar a la pantalla de login
  const handleLogin = () => {
    router.push('/auth/login');
  };

  // Navegar a la pantalla de registro
  const handleRegister = () => {
    router.push('/auth/register');
  };

  // Explorar la app sin iniciar sesión
  const handleExplore = () => {
    router.push('/tabs');
  };

  return (
    <View style={[styles.container, { backgroundColor: getColorValue(theme.colors.background) }]}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <Image
          source={getLogo()}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="calendar" size={40} color={getIconColor(theme.colors.primary)} />
        </View>
        
        <Text style={[styles.title, { color: getColorValue(theme.colors.text.primary) }]}>
          EventHub
        </Text>
        
        <Text style={[styles.subtitle, { color: getColorValue(theme.colors.text.secondary) }]}>
          Encuentra, organiza y asiste a los mejores eventos en tu ciudad
        </Text>
        
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Ionicons name="search" size={24} color={getIconColor(theme.colors.primary)} />
            <Text style={[styles.featureText, { color: getColorValue(theme.colors.text.secondary) }]}>
              Encuentra eventos cerca de ti
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="ticket" size={24} color={getIconColor(theme.colors.primary)} />
            <Text style={[styles.featureText, { color: getColorValue(theme.colors.text.secondary) }]}>
              Compra entradas directamente
            </Text>
          </View>
          
          <View style={styles.featureItem}>
            <Ionicons name="notifications" size={24} color={getIconColor(theme.colors.primary)} />
            <Text style={[styles.featureText, { color: getColorValue(theme.colors.text.secondary) }]}>
              Recibe recordatorios de eventos
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Button
          title="Crear Cuenta"
          onPress={handleRegister}
          style={styles.registerButton}
        />
        
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={[styles.loginText, { color: getColorValue(theme.colors.primary) }]}>
            Ya tengo una cuenta
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  logo: {
    width: 150,
    height: 60,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
  },
  features: {
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
  },
  footer: {
    padding: 32,
  },
  registerButton: {
    marginBottom: 16,
  },
  loginButton: {
    alignItems: 'center',
    padding: 12,
  },
  loginText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 