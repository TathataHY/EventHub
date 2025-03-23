import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Linking, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Importaciones de módulos
import { useTheme } from '../../../core/context';
import { Divider } from '../../../shared/components';
import { eventService } from '../services';
import { authService } from '../../auth/services';
import { commentService } from '../services';
import { bookmarkService } from '../services';
import { sharingService } from '../../social/services';

const { width } = Dimensions.get('window');

// Colores de categorías
const getCategoriaColor = (categoria: string) => {
  switch (categoria) {
    case 'música':
      return 'primary';
    case 'tecnología':
      return 'secondary';
    case 'deporte':
      return 'success';
    case 'arte':
      return 'warning';
    case 'negocios':
      return 'info';
    case 'gastronomía':
      return 'dark';
    default:
      return 'primary';
  }
};

/**
 * Pantalla de detalles de evento - Versión modular
 */
export const EventDetailsScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [evento, setEvento] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [asistiendo, setAsistiendo] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [comentarios, setComentarios] = useState([]);

  useEffect(() => {
    checkAuthAndLoadEvent();
  }, [id]);

  const checkAuthAndLoadEvent = async () => {
    try {
      setLoading(true);
      // Verificar autenticación
      const isAuthenticated = await authService.isAuthenticated();
      
      if (!isAuthenticated) {
        // Opcional: Redirigir a login o mostrar versión limitada
      }
      
      // Cargar datos del evento
      const eventoData = await eventService.getEventById(id);
      setEvento(eventoData);
      
      // Cargar estado de asistencia y guardado
      if (isAuthenticated) {
        const asistiendo = await eventService.isUserAttending(id);
        setAsistiendo(asistiendo);
        
        const guardado = await bookmarkService.isEventSaved(id);
        setGuardado(guardado);
      }
      
      // Cargar comentarios
      const comentarios = await commentService.getCommentsByEventId(id, { limit: 3 });
      setComentarios(comentarios);
    } catch (error) {
      console.error('Error al cargar evento:', error);
      Alert.alert('Error', 'No se pudo cargar la información del evento');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fechaString: string) => {
    const fecha = new Date(fechaString);
    return format(fecha, "EEEE d 'de' MMMM 'a las' HH:mm", { locale: es });
  };

  const handleAttendEvent = async () => {
    try {
      if (!asistiendo) {
        await eventService.attendEvent(evento.id);
        setAsistiendo(true);
        Alert.alert('¡Confirmado!', 'Has confirmado tu asistencia a este evento');
      } else {
        await eventService.unattendEvent(evento.id);
        setAsistiendo(false);
        Alert.alert('Cancelado', 'Has cancelado tu asistencia a este evento');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo procesar tu solicitud');
    }
  };

  const handleViewAllComments = () => {
    router.push(`/events/comments/${id}`);
  };

  const handleViewLocation = () => {
    router.push(`/events/location/${id}`);
  };

  const handleRegister = () => {
    router.push('/auth/login');
  };

  const handleSave = async () => {
    try {
      if (!guardado) {
        await bookmarkService.saveEvent(evento.id);
        setGuardado(true);
        Alert.alert('Guardado', 'Evento guardado en tus favoritos');
      } else {
        await bookmarkService.unsaveEvent(evento.id);
        setGuardado(false);
        Alert.alert('Eliminado', 'Evento eliminado de tus favoritos');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'No se pudo procesar tu solicitud');
    }
  };

  const handleShare = async () => {
    try {
      await sharingService.shareEvent(evento);
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  const handleComprarTicket = async () => {
    router.push(`/tickets/purchase/${id}`);
  };

  const handleOpenMaps = () => {
    const direccion = encodeURIComponent(evento.lugar);
    Linking.openURL(`https://maps.google.com/?q=${direccion}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!evento) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          No se pudo cargar el evento
        </Text>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Image source={{ uri: evento.imagen }} style={styles.image} />
        
        <View style={styles.contentContainer}>
          <View style={styles.headerContainer}>
            <Text 
              style={[styles.title, { color: theme.colors.text.primary }]}
              numberOfLines={2}
            >
              {evento.titulo}
            </Text>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={handleSave}
              >
                <Ionicons 
                  name={guardado ? "bookmark" : "bookmark-outline"} 
                  size={24} 
                  color={guardado ? theme.colors.primary : theme.colors.text.primary} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton} 
                onPress={handleShare}
              >
                <Ionicons 
                  name="share-social-outline" 
                  size={24} 
                  color={theme.colors.text.primary} 
                />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.text.primary }]}>
                {formatearFecha(evento.fecha)}
              </Text>
            </View>
            
            <TouchableOpacity style={styles.detailItem} onPress={handleOpenMaps}>
              <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.text.primary }]}>
                {evento.lugar}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.detailItem}>
              <Ionicons name="ticket-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.text.primary }]}>
                {evento.precio}
              </Text>
            </View>

            <View style={styles.detailItem}>
              <Ionicons name="people-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.detailText, { color: theme.colors.text.primary }]}>
                {evento.asistentes} / {evento.capacidad} asistentes
              </Text>
            </View>
          </View>
          
          <TouchableOpacity
            style={[styles.categoryBadge, { backgroundColor: theme.colors[getCategoriaColor(evento.categoria)] }]}
          >
            <Text style={styles.categoryText}>{evento.categoria}</Text>
          </TouchableOpacity>
          
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Descripción
            </Text>
            <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
              {evento.descripcion}
            </Text>
          </View>
          
          <Divider />
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                Organizado por
              </Text>
            </View>
            <Text style={[styles.organizerText, { color: theme.colors.text.secondary }]}>
              {evento.organizador}
            </Text>
          </View>
          
          <Divider />
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                Ubicación
              </Text>
              <TouchableOpacity onPress={handleViewLocation}>
                <Text style={[styles.viewAll, { color: theme.colors.primary }]}>
                  Ver mapa
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={styles.mapPreview} 
              onPress={handleViewLocation}
            >
              <Image 
                source={{ uri: `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(evento.lugar)}&zoom=14&size=600x300&maptype=roadmap&markers=color:red%7C${encodeURIComponent(evento.lugar)}&key=YOUR_API_KEY` }} 
                style={styles.mapImage} 
              />
              <View style={styles.mapOverlay}>
                <Text style={styles.mapOverlayText}>Ver en mapa</Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <Divider />
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                Comentarios
              </Text>
              <TouchableOpacity onPress={handleViewAllComments}>
                <Text style={[styles.viewAll, { color: theme.colors.primary }]}>
                  Ver todos
                </Text>
              </TouchableOpacity>
            </View>
            
            {comentarios.length > 0 ? (
              comentarios.map((comentario: any, index: number) => (
                <View key={index} style={styles.commentItem}>
                  <View style={styles.commentHeader}>
                    <Image source={{ uri: comentario.usuario.avatar }} style={styles.commentAvatar} />
                    <View>
                      <Text style={[styles.commentUser, { color: theme.colors.text.primary }]}>
                        {comentario.usuario.nombre}
                      </Text>
                      <Text style={[styles.commentDate, { color: theme.colors.text.secondary }]}>
                        {format(new Date(comentario.fecha), "d MMM 'a las' HH:mm", { locale: es })}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.commentText, { color: theme.colors.text.primary }]}>
                    {comentario.texto}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={[styles.noCommentsText, { color: theme.colors.text.secondary }]}>
                No hay comentarios aún. ¡Sé el primero en comentar!
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { backgroundColor: theme.colors.background.card }]}>
        <TouchableOpacity
          style={[
            styles.attendButton,
            { backgroundColor: asistiendo ? theme.colors.success.main : theme.colors.primary.main }
          ]}
          onPress={handleAttendEvent}
        >
          <Text style={styles.attendButtonText}>
            {asistiendo ? 'Asistiré ✓' : 'Asistiré'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.buyButton, { backgroundColor: theme.colors.secondary.main }]}
          onPress={handleComprarTicket}
        >
          <Text style={styles.buyButtonText}>
            Comprar ticket
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 12,
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
    fontSize: 15,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  categoryText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  section: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  organizerText: {
    fontSize: 15,
  },
  viewAll: {
    fontSize: 14,
  },
  mapPreview: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOverlayText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  commentItem: {
    marginBottom: 16,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentUser: {
    fontWeight: '600',
    fontSize: 14,
  },
  commentDate: {
    fontSize: 12,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
  },
  noCommentsText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  attendButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  attendButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  buyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  buyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 20,
  },
}); 