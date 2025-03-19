import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { authService } from '../../src/services/auth.service';

export default function Profile() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      setCargando(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        router.replace('/login');
        return;
      }
      
      const userData = await authService.getUserProfile();
      setUsuario(userData);
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      Alert.alert('Error', 'No se pudo cargar la información del perfil');
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      await authService.logout();
      router.replace('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (cargando) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#4a80f5" />
        <Text style={styles.loadingText}>Cargando perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.profileHeader}>
        <Image 
          source={{ uri: usuario?.avatarUrl || 'https://via.placeholder.com/150' }} 
          style={styles.profileImage} 
        />
        <Text style={styles.profileName}>{usuario?.nombre || 'Usuario'}</Text>
        <Text style={styles.profileEmail}>{usuario?.email || 'email@ejemplo.com'}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{usuario?.eventosCreados?.length || 0}</Text>
          <Text style={styles.statLabel}>Eventos Creados</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{usuario?.eventosAsistidos?.length || 0}</Text>
          <Text style={styles.statLabel}>Eventos Asistidos</Text>
        </View>
      </View>
      
      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.optionItem} onPress={() => router.push('/editar-perfil')}>
          <FontAwesome name="user-edit" size={20} color="#4a80f5" style={styles.optionIcon} />
          <Text style={styles.optionText}>Editar Perfil</Text>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionItem} onPress={() => router.push('/mis-eventos')}>
          <FontAwesome name="calendar" size={20} color="#4a80f5" style={styles.optionIcon} />
          <Text style={styles.optionText}>Mis Eventos</Text>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionItem} onPress={() => router.push('/favoritos')}>
          <FontAwesome name="heart" size={20} color="#4a80f5" style={styles.optionIcon} />
          <Text style={styles.optionText}>Eventos Favoritos</Text>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.optionItem} onPress={() => router.push('/configuracion')}>
          <FontAwesome name="cog" size={20} color="#4a80f5" style={styles.optionIcon} />
          <Text style={styles.optionText}>Configuración</Text>
          <FontAwesome name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={cerrarSesion}>
        <FontAwesome name="sign-out" size={20} color="#fff" style={styles.logoutIcon} />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4a80f5',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  optionsContainer: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionIcon: {
    marginRight: 15,
    width: 24,
    textAlign: 'center',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#444',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    margin: 20,
    padding: 15,
    borderRadius: 8,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 