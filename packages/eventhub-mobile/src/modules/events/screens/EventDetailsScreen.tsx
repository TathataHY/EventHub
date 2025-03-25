import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Linking, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

// Importaciones de módulos con ruta corregida
import { useTheme, getColorValue, getIconColor } from '../../../core/theme';
import { Divider } from '../../../shared/components';
import { eventService } from '../services';
import { authService } from '../../auth/services';
import { commentService } from '../services';
import { bookmarkService } from '../services';
import { sharingService } from '../../social/services';
import { getCategoryColor } from '../../../shared/utils/color.utils';
import { ServiceEvent } from '../services/event.service';
import { Comment } from '../types';
import { userService } from '../../users/services';

const { width } = Dimensions.get('window');

/**
 * Pantalla de detalles de evento - Versión modular
 */
export const EventDetailsScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  
  const [evento, setEvento] = useState<ServiceEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [asistiendo, setAsistiendo] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [comentarios, setComentarios] = useState<Comment[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar autenticación
    const checkAuthentication = async () => {
      const authenticated = await authService.isAuthenticated();
      setIsAuthenticated(authenticated);
    };

    checkAuthentication();
    
    if (id) {
      checkAuthAndLoadEvent();
    } else {
      setLoading(false);
      Alert.alert('Error', 'Identificador de evento inválido');
    }
  }, [id]);

  const checkAuthAndLoadEvent = async () => {
    try {
      setLoading(true);
      
      if (!id) {
        return;
      }
      
      // Cargar datos del evento
      const eventoData = await eventService.getEventById(id);
      setEvento(eventoData);
      
      // Cargar estado de asistencia y guardado si está autenticado
      if (isAuthenticated) {
        const asistiendo = await eventService.isUserAttending(id);
        setAsistiendo(asistiendo);
        
        // Implementación temporal para isEventSaved mientras se agrega al servicio
        try {
          const savedEvents = await userService.getSavedEvents('current');
          const isEventSaved = savedEvents.some(event => event.id === id);
          setGuardado(isEventSaved);
        } catch (error) {
          console.error('Error al verificar si el evento está guardado:', error);
          setGuardado(false);
        }
      }
      
      // Cargar comentarios
      const comentarios = await commentService.getCommentsByEventId(id, { limit: 3 });
      setComentarios(comentarios as any);
    } catch (error) {
      console.error('Error al cargar evento:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo cargar la información del evento',
        position: 'bottom'
      });
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fechaString: string) => {
    try {
      const fecha = new Date(fechaString);
      return format(fecha, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es });
    } catch (error) {
      return fechaString;
    }
  };

  const toggleAttendance = async () => {
    try {
      if (!isAuthenticated) {
        // Redirigir a la pantalla de login si no está autenticado
        navigation.navigate('Login' as never);
        return;
      }
      
      // Verificar si id está definido
      if (!id) return;
      
      if (asistiendo) {
        // Si ya asiste, cancelar asistencia
        await eventService.unattendEvent(id);
        setAsistiendo(false);
        Toast.show({
          type: 'success',
          text1: 'Has cancelado tu asistencia',
          position: 'bottom'
        });
      } else {
        // Si no asiste, añadir asistencia
        const user = await userService.getCurrentUser();
        if (!user || !user.id) return;
        
        await eventService.attendEvent(user.id, id);
        setAsistiendo(true);
        Toast.show({
          type: 'success',
          text1: '¡Te has apuntado al evento!',
          position: 'bottom'
        });
      }
    } catch (error) {
      console.error('Error al gestionar asistencia:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo procesar tu solicitud',
        position: 'bottom'
      });
    }
  };

  const handleComprarEntradas = () => {
    if (!evento || !id) return;
    router.push(`/tickets/purchase/${id}`);
  };

  const handleSave = async () => {
    try {
      if (!isAuthenticated) {
        // Redirigir a la pantalla de login si no está autenticado
        navigation.navigate('Login' as never);
        return;
      }
      
      // Asegurarnos de que id no es undefined
      if (!id) return;
      
      // Usar userService.toggleSaveEvent en lugar de bookmarkService
      const resultado = await userService.toggleSaveEvent(id);
      setGuardado(resultado.saved);
      
      Toast.show({
        type: 'success',
        text1: resultado.saved ? 'Evento guardado' : 'Evento eliminado de guardados',
        position: 'bottom'
      });
    } catch (error) {
      console.error('Error al guardar evento:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo guardar el evento',
        position: 'bottom'
      });
    }
  };

  const handleShare = async () => {
    try {
      if (!evento) return;
      
      let fechaFormateada = '';
      if (evento.startDate) {
        fechaFormateada = formatearFecha(evento.startDate);
      }
      
      let ubicacion = '';
      if (typeof evento.location === 'string') {
        ubicacion = evento.location;
      } else if (evento.location && typeof evento.location === 'object') {
        if (evento.location.address) {
          ubicacion = evento.location.address;
        } else if (evento.location.name) {
          ubicacion = evento.location.name;
        }
      } else if (evento.type === 'ONLINE') {
        ubicacion = 'Evento online';
      }
      
      await sharingService.shareEvent(
        id || '',
        evento.title,
        fechaFormateada,
        ubicacion
      );
    } catch (error) {
      console.error('Error al compartir:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo compartir el evento',
        position: 'bottom'
      });
    }
  };

  const handleOpenMaps = () => {
    try {
      if (!evento) return;
      
      let locationStr = '';
      
      if (typeof evento.location === 'string') {
        locationStr = evento.location;
      } else if (evento.location && typeof evento.location === 'object') {
        if (evento.location.address) {
          locationStr = evento.location.address;
          if (evento.location.city) {
            locationStr += `, ${evento.location.city}`;
          }
          if (evento.location.country) {
            locationStr += `, ${evento.location.country}`;
          }
        } else if (evento.location.name) {
          locationStr = evento.location.name;
        }
      }
      
      if (!locationStr) return;
      
      const url = `https://maps.google.com/?q=${encodeURIComponent(locationStr)}`;
      Linking.openURL(url);
    } catch (error) {
      console.error('Error al abrir mapa:', error);
    }
  };

  const handleVerTodosComentarios = () => {
    if (!evento || !id) return;
    router.push(`/events/${id}/comments`);
  };

  const handleVerAsistentes = () => {
    if (!evento || !id) return;
    router.push(`/events/${id}/attendees`);
  };

  const handleUnattendEvent = async () => {
    try {
      if (!id) return;
      await eventService.unattendEvent(id);
      
      setAsistiendo(false);
      Toast.show({
        type: 'success',
        text1: 'Ya no asistirás a este evento',
        position: 'bottom'
      });
      
      // Actualizar contadores
      if (evento) {
        setEvento({
          ...evento,
          attendeesCount: (evento.attendeesCount || 0) - 1
        });
      }
    } catch (error) {
      console.error('Error al cancelar asistencia:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo cancelar tu asistencia',
        position: 'bottom'
      });
    }
  };

  const handleAttendEvent = async () => {
    try {
      if (!id || !isAuthenticated) return;
      
      // Obtener el usuario actual
      const currentUser = await userService.getCurrentUser();
      if (!currentUser || !currentUser.id) return;
      
      await eventService.attendEvent(currentUser.id, id);
      
      setAsistiendo(true);
      Toast.show({
        type: 'success',
        text1: '¡Asistirás a este evento!',
        position: 'bottom'
      });
      
      // Actualizar contadores
      if (evento) {
        setEvento({
          ...evento,
          attendeesCount: (evento.attendeesCount || 0) + 1
        });
      }
    } catch (error) {
      console.error('Error al asistir al evento:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo confirmar tu asistencia',
        position: 'bottom'
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: getColorValue(theme.colors.background) }]}>
        <ActivityIndicator size="large" color={getColorValue(theme.colors.primary)} />
      </View>
    );
  }

  if (!evento) {
    return (
      <View style={[styles.container, { backgroundColor: getColorValue(theme.colors.background) }]}>
        <Text style={[styles.errorText, { color: getColorValue(theme.colors.error) }]}>
          No se pudo cargar el evento
        </Text>
      </View>
    );
  }

  // Determinar si el evento permite compra de tickets
  const permitirCompra = evento.ticketsAvailable && evento.ticketsAvailable > 0 && 
                         new Date(evento.startDate) > new Date();

  return (
    <>
      <ScrollView 
        style={[styles.container, { backgroundColor: getColorValue(theme.colors.background) }]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: evento.imageUrl || evento.image }} 
            style={styles.image} 
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text 
              style={[styles.title, { color: getColorValue(theme.colors.text.primary) }]}
              numberOfLines={2}
            >
              {evento.title}
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={handleSave}
              >
                <Ionicons 
                  name={guardado ? "bookmark" : "bookmark-outline"} 
                  size={24} 
                  color={getIconColor(guardado ? theme.colors.primary : theme.colors.text.primary)} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={handleShare}
              >
                <Ionicons 
                  name="share-outline" 
                  size={24} 
                  color={getIconColor(theme.colors.text.primary)} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Ionicons 
                name="calendar-outline" 
                size={20} 
                color={getIconColor(theme.colors.primary)} 
              />
              <Text style={[styles.detailText, { color: getColorValue(theme.colors.text.primary) }]}>
                {formatearFecha(evento.startDate)}
              </Text>
            </View>
            
            <TouchableOpacity style={styles.detailItem} onPress={handleOpenMaps}>
              <Ionicons 
                name="location-outline" 
                size={20} 
                color={getIconColor(theme.colors.primary)} 
              />
              <Text style={[styles.detailText, { color: getColorValue(theme.colors.text.primary) }]}>
                {typeof evento.location === 'string' 
                  ? evento.location 
                  : evento.location?.name || 'Ubicación no especificada'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.detailItem}>
              <Ionicons 
                name="ticket-outline" 
                size={20} 
                color={getIconColor(theme.colors.primary)} 
              />
              <Text style={[styles.detailText, { color: getColorValue(theme.colors.text.primary) }]}>
                {(evento.price !== undefined && evento.price > 0) ? `${evento.price} €` : 'Entrada libre'}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons 
                name="people-outline" 
                size={20} 
                color={getIconColor(theme.colors.primary)} 
              />
              <Text style={[styles.detailText, { color: getColorValue(theme.colors.text.primary) }]}>
                {evento.attendeesCount || 0} asistentes confirmados
              </Text>
            </View>
          </View>
          
          {evento.category && (
            <TouchableOpacity
              style={[styles.categoryBadge, { backgroundColor: getCategoryColor(evento.category, theme) }]}
            >
              <Text style={styles.categoryText}>{evento.category}</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: getColorValue(theme.colors.text.primary) }]}>
              Descripción
            </Text>
            <Text style={[styles.description, { color: getColorValue(theme.colors.text.secondary) }]}>
              {evento.description}
            </Text>
          </View>
          
          <Divider />
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: getColorValue(theme.colors.text.primary) }]}>
                Organizado por
              </Text>
            </View>
            <Text style={[styles.organizerText, { color: getColorValue(theme.colors.text.secondary) }]}>
              {typeof evento.organizer === 'string' 
                ? evento.organizer 
                : evento.organizer?.name || 'Organizador no especificado'}
            </Text>
          </View>
          
          <Divider />
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: getColorValue(theme.colors.text.primary) }]}>
                Comentarios
              </Text>
              <TouchableOpacity onPress={handleVerTodosComentarios}>
                <Text style={[styles.verTodosLink, { color: getColorValue(theme.colors.primary) }]}>
                  Ver todos
                </Text>
              </TouchableOpacity>
            </View>
            
            {comentarios.length > 0 ? (
              comentarios.map((comentario, index) => (
                <View key={comentario.id} style={styles.comentario}>
                  <View style={styles.comentarioHeader}>
                    <Text style={[styles.comentarioAutor, { color: getColorValue(theme.colors.text.primary) }]}>
                      {comentario.author?.name || 'Usuario'}
                    </Text>
                    <Text style={[styles.comentarioFecha, { color: getColorValue(theme.colors.text.secondary) }]}>
                      {format(new Date(comentario.createdAt), 'dd/MM/yyyy')}
                    </Text>
                  </View>
                  <Text style={[styles.comentarioTexto, { color: getColorValue(theme.colors.text.secondary) }]}>
                    {comentario.content}
                  </Text>
                  {index < comentarios.length - 1 && <Divider style={styles.comentarioDivider} />}
                </View>
              ))
            ) : (
              <Text style={[styles.noComentarios, { color: getColorValue(theme.colors.text.secondary) }]}>
                No hay comentarios para mostrar
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      
      <View style={[styles.footerContainer, { backgroundColor: getColorValue(theme.colors.background) }]}>
        <TouchableOpacity
          style={[
            styles.asistirButton,
            { backgroundColor: asistiendo ? 'transparent' : getColorValue(theme.colors.primary) },
            asistiendo && { borderWidth: 1, borderColor: getColorValue(theme.colors.primary) }
          ]}
          onPress={toggleAttendance}
        >
          <Ionicons 
            name={asistiendo ? "checkmark" : "calendar"} 
            size={18} 
            color={asistiendo ? getIconColor(theme.colors.primary) : '#FFFFFF'} 
          />
          <Text 
            style={[
              styles.asistirButtonText, 
              { color: asistiendo ? getColorValue(theme.colors.primary) : '#FFFFFF' }
            ]}
          >
            {asistiendo ? 'Asistiendo' : 'Asistiré'}
          </Text>
        </TouchableOpacity>
        
        {permitirCompra && (
          <TouchableOpacity
            style={[styles.comprarButton, { backgroundColor: getColorValue(theme.colors.secondary) }]}
            onPress={handleComprarEntradas}
          >
            <Ionicons name="ticket-outline" size={18} color="#FFFFFF" />
            <Text style={styles.comprarButtonText}>Comprar entradas</Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  imageContainer: {
    width: '100%',
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
  },
  detailsContainer: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 16,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  organizerText: {
    fontSize: 14,
  },
  verTodosLink: {
    fontSize: 14,
  },
  comentario: {
    marginBottom: 8,
  },
  comentarioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  comentarioAutor: {
    fontWeight: '500',
  },
  comentarioFecha: {
    fontSize: 12,
  },
  comentarioTexto: {
    fontSize: 14,
  },
  comentarioDivider: {
    marginVertical: 8,
  },
  noComentarios: {
    fontStyle: 'italic',
  },
  footerContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  asistirButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
  },
  asistirButtonText: {
    fontWeight: '600',
    marginLeft: 8,
  },
  comprarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
  },
  comprarButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    margin: 20,
  },
}); 