import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { appColors, appTypography, appSpacing } from '../../../theme';
import { Button } from '../../../shared/components/ui';

/**
 * Pantalla de bienvenida que se muestra como punto de entrada a la autenticación
 */
export const WelcomeScreen = () => {
  const router = useRouter();

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
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Ionicons name="calendar" size={40} color={appColors.primary} />
        <Text style={styles.title}>EventHub</Text>
        <Text style={styles.subtitle}>Descubre y gestiona eventos a tu alrededor</Text>
      </View>
      
      <View style={styles.imageContainer}>
        <Image 
          source={{ 
            uri: 'https://img.freepik.com/free-vector/people-celebrating-party-illustration_52683-23027.jpg' 
          }} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.features}>
        <View style={styles.featureItem}>
          <Ionicons name="search" size={24} color={appColors.primary} />
          <Text style={styles.featureText}>Encuentra eventos cercanos</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="ticket" size={24} color={appColors.primary} />
          <Text style={styles.featureText}>Gestiona tus entradas</Text>
        </View>
        <View style={styles.featureItem}>
          <Ionicons name="notifications" size={24} color={appColors.primary} />
          <Text style={styles.featureText}>Recibe notificaciones</Text>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Iniciar Sesión"
          onPress={handleLogin}
          style={styles.loginButton}
        />
        
        <Button
          title="Registrarse"
          variant="outline"
          onPress={handleRegister}
          style={styles.registerButton}
        />
        
        <Button
          title="Explorar sin cuenta"
          variant="text"
          onPress={handleExplore}
          style={styles.exploreButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
    padding: appSpacing.md,
  },
  header: {
    alignItems: 'center',
    marginTop: appSpacing.xl,
  },
  title: {
    ...appTypography.h1,
    color: appColors.text,
    marginTop: appSpacing.sm,
    marginBottom: appSpacing.xs,
  },
  subtitle: {
    ...appTypography.body1,
    color: appColors.gray[600],
    textAlign: 'center',
    paddingHorizontal: appSpacing.lg,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: appSpacing.lg,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 20,
  },
  features: {
    marginBottom: appSpacing.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: appSpacing.sm,
  },
  featureText: {
    ...appTypography.body2,
    color: appColors.text,
    marginLeft: appSpacing.sm,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: appSpacing.xl,
  },
  loginButton: {
    marginBottom: appSpacing.sm,
  },
  registerButton: {
    marginBottom: appSpacing.sm,
  },
  exploreButton: {
    marginTop: appSpacing.xs,
  },
}); 