import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { eventService } from '../../src/services/event.service';
import { authService } from '../../src/services/auth.service';

export default function EventoDetalle() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [evento, setEvento] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOrganizador, setIsOrganizador] = useState(false);
  
  // Verificar autenticación y cargar datos del evento
  useEffect(() => {
    const checkAuthAndLoadEvent = async () => {
      try {
        // Verificar si el usuario está autenticado
        const auth = await authService.isAuthenticated();
        setIsAuthenticated(auth);
        
        // Cargar datos del evento
        const eventData = await eventService.getEventById(id.toString());
        setEvento(eventData);
        
        // Verificar si el usuario es el organizador
        if (auth) {
          const user = await authService.getCurrentUser();
          setIsOrganizador(user?.id === eventData.organizerId);
        }
      } catch (error) {
        console.error('Error al cargar evento:', error);
        Alert.alert(
          'Error',
          'No se pudo cargar los detalles del evento. Por favor, inténtalo de nuevo más tarde.'
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuthAndLoadEvent();
  }, [id]);

  // Formatear fecha
  const formatearFecha = (fechaString) => {
    try {
      const fecha = new Date(fechaString);
      return format(fecha, "EEEE d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es });
    } catch (error) {
      return fechaString;
    }
  };

  // Manejar asistencia al evento
  const handleAttendEvent = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Inicio de sesión requerido',
        'Debes iniciar sesión para registrarte en este evento.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar sesión', onPress: () => router.push('/login') }
        ]
      );
      return;
    }
    
    setIsProcessing(true);
    try {
      if (evento.isAttending) {
        await eventService.cancelAttendance(id.toString());
        Alert.alert('Éxito', 'Has cancelado tu asistencia al evento.');
      } else {
        await eventService.attendEvent(id.toString());
        Alert.alert('Éxito', 'Te has registrado para asistir al evento.');
      }
      
      // Recargar datos del evento
      const updatedEvent = await eventService.getEventById(id.toString());
      setEvento(updatedEvent);
    } catch (error) {
      console.error('Error al gestionar asistencia:', error);
      Alert.alert(
        'Error',
        'No se pudo procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // Eliminar evento
  const handleDeleteEvent = () => {
    Alert.alert(
      'Eliminar evento',
      '¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Eliminar', 
          style: 'destructive',
          onPress: async () => {
            setIsProcessing(true);
            try {
              await eventService.deleteEvent(id.toString());
              Alert.alert('Éxito', 'El evento ha sido eliminado correctamente.');
              router.replace('/tabs/eventos');
            } catch (error) {
              console.error('Error al eliminar evento:', error);
              Alert.alert(
                'Error',
                'No se pudo eliminar el evento. Por favor, inténtalo de nuevo más tarde.'
              );
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a80f5" />
        <Text style={styles.loadingText}>Cargando evento...</Text>
      </View>
    );
  }

  if (!evento) {
    return (
      <View style={styles.errorContainer}>
        <FontAwesome name="exclamation-circle" size={60} color="#ff3b30" />
        <Text style={styles.errorText}>No se pudo encontrar el evento</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.replace('/tabs/eventos')}
        >
          <Text style={styles.backButtonText}>Volver a eventos</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: evento.imageUrl || 'https://img.freepik.com/free-photo/group-people-enjoying-party_23-2147652037.jpg' }}
          style={styles.eventImage}
        />
        <TouchableOpacity 
          style={styles.backIconButton}
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="white" />
        </TouchableOpacity>
        
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{evento.category}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{evento.title}</Text>
        
        <View style={styles.infoRow}>
          <FontAwesome name="calendar" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{formatearFecha(evento.startDate)}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <FontAwesome name="map-marker" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>{evento.location}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <FontAwesome name="user" size={16} color="#666" style={styles.infoIcon} />
          <Text style={styles.infoText}>Organizado por {evento.organizerName || 'Usuario'}</Text>
        </View>
        
        {evento.capacity && (
          <View style={styles.infoRow}>
            <FontAwesome name="users" size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              {evento.attendees || 0} / {evento.capacity} asistentes
            </Text>
          </View>
        )}
        
        <View style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Descripción</Text>
        <Text style={styles.description}>{evento.description}</Text>
        
        <View style={styles.buttonContainer}>
          {isOrganizador ? (
            <>
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => router.push(`/editar-evento/${id}`)}
              >
                <FontAwesome name="edit" size={16} color="white" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Editar evento</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={handleDeleteEvent}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <>
                    <FontAwesome name="trash" size={16} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Eliminar evento</Text>
                  </>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={[
                styles.attendButton,
                evento.isAttending ? styles.cancelAttendButton : {}
              ]}
              onPress={handleAttendEvent}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <FontAwesome 
                    name={evento.isAttending ? "calendar-times-o" : "calendar-check-o"} 
                    size={16} 
                    color="white" 
                    style={styles.buttonIcon} 
                  />
                  <Text style={styles.buttonText}>
                    {evento.isAttending ? 'Cancelar asistencia' : 'Asistir al evento'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    marginBottom: 30,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#4a80f5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
  },
  eventImage: {
    width: '100%',
    height: 250,
  },
  backIconButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoIcon: {
    width: 25,
    textAlign: 'center',
    marginRight: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  attendButton: {
    backgroundColor: '#4a80f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  cancelAttendButton: {
    backgroundColor: '#ff9500',
  },
  editButton: {
    backgroundColor: '#4a80f5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#ff3b30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 