import React, { useEffect } from 'react';
import { View, StyleSheet, Alert, ActivityIndicator, Text, ScrollView } from 'react-native';
import { useEventDetails } from '../hooks/useEventDetails';
import { EventDetail } from '../components';
import { colors } from '@theme';

interface EventDetailScreenProps {
  eventId: string | number;
  onAttendPress?: (eventId: string | number) => void;
  onSharePress?: (eventId: string | number) => void;
  onOrganizerPress?: (organizerId: string | number) => void;
  onBackPress?: () => void;
}

export const EventDetailScreen: React.FC<EventDetailScreenProps> = ({
  eventId,
  onAttendPress,
  onSharePress,
  onOrganizerPress,
  onBackPress
}) => {
  const {
    event,
    isLoading,
    error,
    isAttending,
    loadEventDetails,
    toggleAttendance
  } = useEventDetails(eventId);

  // Cargar detalles del evento
  useEffect(() => {
    loadEventDetails();
  }, [eventId, loadEventDetails]);

  // Manejar el press en el botón de asistir
  const handleAttendPress = async () => {
    try {
      await toggleAttendance();
      
      if (onAttendPress) {
        onAttendPress(eventId);
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo actualizar su asistencia al evento. Inténtelo de nuevo.",
        [{ text: "OK" }]
      );
    }
  };

  // Manejar el press en el botón de compartir
  const handleSharePress = () => {
    if (onSharePress) {
      onSharePress(eventId);
    }
  };

  // Manejar el press en el organizador
  const handleOrganizerPress = () => {
    if (event && event.organizerId && onOrganizerPress) {
      onOrganizerPress(event.organizerId);
    }
  };

  // Renderizar un error
  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Si está cargando y no hay datos aún, mostrar indicador
  if (isLoading && !event) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando detalles del evento...</Text>
      </View>
    );
  }

  // Si no hay evento, mostrar mensaje
  if (!event) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No se encontró el evento</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <EventDetail
        event={event}
        isLoading={isLoading}
        isAttending={isAttending}
        onAttendPress={handleAttendPress}
        onSharePress={handleSharePress}
        onOrganizerPress={handleOrganizerPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: 'center',
  },
}); 