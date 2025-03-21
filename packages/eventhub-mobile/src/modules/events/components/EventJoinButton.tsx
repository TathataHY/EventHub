import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import theme from '../../theme';
import { eventService } from '../../services/event.service';
import { notificationService } from '../../services/notification.service';

interface EventJoinButtonProps {
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  initialJoined?: boolean;
  onJoinStatusChange?: (isJoined: boolean) => void;
}

export const EventJoinButton: React.FC<EventJoinButtonProps> = ({
  eventId,
  eventTitle,
  eventDate,
  initialJoined = false,
  onJoinStatusChange
}) => {
  const [isJoined, setIsJoined] = useState(initialJoined);
  const [loading, setLoading] = useState(false);
  const [permissionsRequested, setPermissionsRequested] = useState(false);

  useEffect(() => {
    setIsJoined(initialJoined);
  }, [initialJoined]);

  const requestNotificationPermissions = async () => {
    if (permissionsRequested) return true;
    
    const permissionGranted = await notificationService.requestPermissions();
    setPermissionsRequested(true);
    
    if (!permissionGranted) {
      Alert.alert(
        'Notificaciones',
        'Para recibir recordatorios de este evento, necesitamos tu permiso para enviar notificaciones.',
        [
          { text: 'No, gracias', style: 'cancel' },
          { 
            text: 'Configuración', 
            // Idealmente, aquí abrirías la configuración del dispositivo
            onPress: () => console.log('Abrir configuración') 
          }
        ]
      );
    }
    
    return permissionGranted;
  };

  const handleJoinEvent = async () => {
    setLoading(true);
    try {
      if (isJoined) {
        // Si ya está unido, abandonar el evento
        await eventService.leaveEvent(eventId);
        
        // Cancelar notificaciones programadas para este evento
        await notificationService.cancelEventNotifications(eventId);
        
        setIsJoined(false);
        if (onJoinStatusChange) onJoinStatusChange(false);
        
        Alert.alert('¡Listo!', 'Has abandonado el evento.');
      } else {
        // Si no está unido, unirse al evento
        await eventService.joinEvent(eventId);
        
        // Solicitar permisos y programar notificaciones
        const hasPermission = await requestNotificationPermissions();
        if (hasPermission) {
          await notificationService.scheduleEventNotification(
            eventId, 
            eventTitle, 
            new Date(eventDate)
          );
          
          Alert.alert(
            '¡Genial!', 
            'Te has unido al evento. Recibirás notificaciones con recordatorios.'
          );
        } else {
          Alert.alert(
            '¡Genial!', 
            'Te has unido al evento. No recibirás notificaciones ya que no has dado permiso.'
          );
        }
        
        setIsJoined(true);
        if (onJoinStatusChange) onJoinStatusChange(true);
      }
    } catch (error) {
      console.error('Error al cambiar estado de asistencia:', error);
      Alert.alert(
        'Error', 
        `No se pudo ${isJoined ? 'abandonar' : 'unirse a'} el evento. Inténtalo de nuevo.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isJoined ? styles.joinedButton : styles.joinButton
      ]}
      onPress={handleJoinEvent}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={isJoined ? theme.colors.primary.main : theme.colors.common.white} />
      ) : (
        <>
          <FontAwesome
            name={isJoined ? 'check-circle' : 'calendar-plus-o'}
            size={16}
            color={isJoined ? theme.colors.primary.main : theme.colors.common.white}
            style={styles.icon}
          />
          <Text
            style={[
              styles.buttonText,
              isJoined ? styles.joinedButtonText : styles.joinButtonText
            ]}
          >
            {isJoined ? 'Asistirás' : 'Unirme'}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
  },
  joinButton: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  joinedButton: {
    backgroundColor: theme.colors.common.white,
    borderColor: theme.colors.primary.main,
  },
  icon: {
    marginRight: 8,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: theme.typography.fontSize.sm,
  },
  joinButtonText: {
    color: theme.colors.common.white,
  },
  joinedButtonText: {
    color: theme.colors.primary.main,
  },
}); 