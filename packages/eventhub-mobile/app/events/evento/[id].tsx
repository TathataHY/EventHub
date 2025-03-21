import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Share, Toast, ActivityIndicator, Linking, Dimensions } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useTheme } from '../../../src/context/ThemeContext';
import { Divider } from '../../../src/components/common/Divider';
import { EventCard } from '../../../src/components/event/EventCard';
import { EventLocationMap } from '../../../src/components/map/EventLocationMap';
import { SimilarEvents } from '../../../src/components/event/SimilarEvents';

import { eventService } from '../../../src/services/event.service';
import { authService } from '../../../src/services/auth.service';
import { commentService } from '../../../src/services/commentService';
import Button from '../../../src/components/ui/Button';
import Badge from '../../../src/components/ui/Badge';
import Card from '../../../src/components/ui/Card';
import { EventComments } from '../../../src/components/event/EventComments';
import { EventMap } from '../../../src/components/event/EventMap';
import { EventShareButtons } from '../../../src/components/event/EventShareButtons';
import { EventJoinButton } from '../../../src/components/event/EventJoinButton';
import theme from '../../../src/theme';
import { bookmarkService } from '../../../src/services/bookmark.service';
import { sharingService } from '../../../src/services/sharing.service';
import { mockService } from '../../../src/services/mock.service';

const { width } = Dimensions.get('window');

// Datos de ejemplo para desarrollo
const EVENTO_MOCK = {
  id: '1',
  titulo: 'Festival de Música Electrónica',
  descripcion: 'Disfruta de la mejor música electrónica con DJs internacionales en un ambiente increíble. El festival contará con 3 escenarios, zona de comida y bebida, y mucho más. No te pierdas esta experiencia única que reunirá a los mejores exponentes de la música electrónica mundial en un solo lugar.\n\nHorario:\n- 16:00: Apertura de puertas\n- 17:00-19:00: DJs locales\n- 19:00-21:00: Artistas nacionales\n- 21:00-00:00: Headliners internacionales\n\nSe recomienda llegar con tiempo para evitar colas.',
  fecha: '2023-06-10T18:00:00',
  lugar: 'Parque Central, Av. Principal 123, Madrid',
  imagen: 'https://img.freepik.com/free-photo/excited-audience-watching-confetti-fireworks-having-fun-music-festival-night-copy-space_637285-559.jpg',
  categoria: 'música',
  precio: 'Desde €25',
  organizador: 'EventPro Productions',
  capacidad: 5000,
  asistentes: 3240,
  asistiendo: false
};

// Función para obtener el color de categoría
const getCategoriaColor = (categoria) => {
  switch (categoria) {
    case 'música':
      return 'primary';
    case 'tecnología':
      return 'secondary';
    case 'arte':
      return 'info';
    case 'deporte':
      return 'success';
    case 'gastronomía':
      return 'warning';
    default:
      return 'primary';
  }
};

export default function EventDetailsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [evento, setEvento] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOrganizador, setIsOrganizador] = useState(false);
  const [comments, setComments] = useState([]);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [hasTicket, setHasTicket] = useState(false);
  const [organizadorData, setOrganizadorData] = useState(null);
  const [activeTab, setActiveTab] = useState('info');

  // Verificar autenticación y cargar datos del evento
  useEffect(() => {
    const checkAuthAndLoadEvent = async () => {
      try {
        // Verificar si el usuario está autenticado
        const auth = await authService.isAuthenticated();
        setIsAuthenticated(auth);
        
        // Para desarrollo, usar datos de ejemplo
        // En producción, descomentar la línea siguiente:
        // const eventData = await eventService.getEventById(id.toString());
        const eventData = EVENTO_MOCK;
        setEvento(eventData);
        
        // Cargar comentarios
        const eventComments = await commentService.getEventComments(id.toString());
        setComments(eventComments);
        
        // Verificar si el usuario es el organizador
        if (auth) {
          setIsOrganizador(false); // Para desarrollo
          // Descomentar en producción:
          // const user = await authService.getCurrentUser();
          // setIsOrganizador(user?.id === eventData.organizerId);
        }

        // Comprobar si el usuario está autenticado
        const user = await authService.getCurrentUser();
        setCurrentUser(user);
        
        if (id && user) {
          // Comprobar si el evento está guardado en favoritos
          const eventSaved = await bookmarkService.isEventBookmarked(user.id, id);
          setIsSaved(eventSaved);
        }

        // Verificar si el usuario tiene un ticket para este evento
        const ticket = await mockService.getTicketByEventId(id);
        setHasTicket(!!ticket);
        
        // Cargar información del organizador
        const organizadorData = await mockService.getUserById(eventData.organizer);
        setOrganizadorData(organizadorData);
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
          { text: 'Iniciar sesión', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }
    
    setIsProcessing(true);
    try {
      // Simular cambio de estado para desarrollo
      setEvento({
        ...evento,
        asistiendo: !evento.asistiendo,
        asistentes: evento.asistiendo ? evento.asistentes - 1 : evento.asistentes + 1
      });
      
      // En producción, descomentar:
      /*
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
      */
      
      Alert.alert(
        'Éxito', 
        evento.asistiendo 
          ? 'Has cancelado tu asistencia al evento.' 
          : 'Te has registrado para asistir al evento.'
      );
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
              // En producción, descomentar:
              // await eventService.deleteEvent(id.toString());
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

  const handleAddComment = async (text: string, rating: number) => {
    try {
      const user = await authService.getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'Debes iniciar sesión para comentar');
        return;
      }

      const newComment = await commentService.addComment(
        id.toString(),
        user.id,
        text,
        rating
      );
      
      setComments(prevComments => [newComment, ...prevComments]);
    } catch (error) {
      console.error('Error al agregar comentario:', error);
      Alert.alert(
        'Error',
        'No se pudo agregar el comentario. Por favor, inténtalo de nuevo.'
      );
    }
  };

  const handleViewAllComments = () => {
    router.push(`/events/comments/${id}`);
  };

  const handleViewLocation = () => {
    router.push(`/events/location/${id}`);
  };

  const handleRegister = () => {
    setIsRegistered(!isRegistered);
    // Aquí iría la lógica de registro
  };

  const handleSave = async () => {
    if (!currentUser) {
      Alert.alert(
        'Inicio de sesión requerido',
        'Debes iniciar sesión para guardar eventos.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Iniciar sesión', onPress: () => router.push('/auth/login') }
        ]
      );
      return;
    }
    
    try {
      const newSavedState = await bookmarkService.toggleBookmark(currentUser.id, id as string);
      setIsSaved(newSavedState);
      
      // Mostrar feedback
      Toast.show({
        type: 'success',
        text1: newSavedState ? 'Evento guardado' : 'Evento eliminado de favoritos',
        position: 'bottom',
      });
    } catch (error) {
      console.error('Error al guardar/eliminar favorito:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo actualizar favoritos. Inténtalo de nuevo.',
        position: 'bottom',
      });
    }
  };

  const handleShare = async () => {
    if (!evento) return;
    
    try {
      await sharingService.shareEvent({
        eventId: evento.id,
        eventName: evento.titulo,
        eventDate: evento.fecha,
        eventLocation: evento.lugar,
      });
    } catch (error) {
      console.error('Error al compartir evento:', error);
    }
  };

  const handleComprarTicket = async () => {
    try {
      await mockService.purchaseTicket(id);
      setHasTicket(true);
      // Navegar a la pantalla de tickets
      router.push('/profile/tickets');
    } catch (error) {
      console.error('Error al comprar ticket:', error);
    }
  };

  const handleOpenMaps = () => {
    if (evento?.location?.coordinates) {
      const { latitude, longitude } = evento.location.coordinates;
      const url = `https://maps.google.com/?q=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  // Verificar si el evento tiene ubicación
  const hasLocation = evento?.location?.latitude && evento?.location?.longitude;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Cargando evento...</Text>
      </View>
    );
  }

  if (!evento) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={60} color="#ff3b30" />
        <Text style={styles.errorTitle}>Evento no encontrado</Text>
        <Text style={styles.errorText}>El evento que buscas no existe o ha sido eliminado.</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: evento.titulo,
          headerBackTitle: 'Eventos',
        }}
      />
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.imageContainer}>
          <View style={[styles.imageWrapper, { backgroundColor: theme.colors.secondaryText }]}>
            <Ionicons name="image" size={80} color={theme.colors.card} />
          </View>
          
          <TouchableOpacity 
            style={[styles.backButton, { backgroundColor: theme.colors.card }]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.contentSection}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {evento.titulo}
          </Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.infoText, { color: theme.colors.text }]}>
                {formatearFecha(evento.fecha)}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.infoText, { color: theme.colors.text }]}>
                {evento.fecha.split('T')[1].split(':').slice(0, 2).join(':')}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.infoRow}
            onPress={handleViewLocation}
          >
            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.infoText, { color: theme.colors.text }]}>
                {evento.lugar}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.secondaryText} />
          </TouchableOpacity>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Ionicons name="person-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.infoText, { color: theme.colors.text }]}>
                Organizado por {evento.organizador}
              </Text>
            </View>
            
            <View style={styles.infoItem}>
              <Ionicons name="people-outline" size={20} color={theme.colors.primary} />
              <Text style={[styles.infoText, { color: theme.colors.text }]}>
                {evento.asistentes} / {evento.capacidad} asistentes
              </Text>
            </View>
          </View>
          
          <View style={styles.tagsContainer}>
            {evento.categoria && (
              <View 
                style={[styles.tagPill, { backgroundColor: theme.colors.primary + '20' }]}
              >
                <Text style={[styles.tagText, { color: theme.colors.primary }]}>
                  {evento.categoria}
                </Text>
              </View>
            )}
          </View>
          
          <Divider />
          
          <Card style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Descripción</Text>
            <Divider style={styles.sectionDivider} />
            <Text style={[styles.eventDescription, { color: theme.colors.text }]}>
              {evento.descripcion}
            </Text>
          </Card>
          
          {/* Ubicación del evento */}
          {hasLocation && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Ubicación
              </Text>
              
              <View style={styles.locationContainer}>
                <Text style={[styles.locationText, { color: theme.colors.secondaryText }]}>
                  {evento.lugar}
                </Text>
                
                <EventLocationMap
                  latitude={evento.location.latitude}
                  longitude={evento.location.longitude}
                  name={evento.titulo}
                  address={evento.lugar}
                  height={200}
                />
              </View>
            </View>
          )}
          
          <Card style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Comentarios y valoraciones</Text>
              <TouchableOpacity onPress={handleViewAllComments}>
                <Text style={[styles.viewAllLink, { color: theme.colors.primary }]}>Ver todos</Text>
              </TouchableOpacity>
            </View>
            <Divider style={styles.sectionDivider} />
            <EventComments 
              comments={comments.slice(0, 2)} 
              onAddComment={handleAddComment}
              showForm={false}
            />
            {comments.length > 2 && (
              <TouchableOpacity 
                style={styles.viewAllCommentsButton}
                onPress={handleViewAllComments}
              >
                <Text style={[styles.viewAllCommentsText, { color: theme.colors.primary }]}>
                  Ver todos los {comments.length} comentarios
                </Text>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            )}
          </Card>
          
          {/* Eventos similares */}
          <SimilarEvents currentEventId={id} />
          
          <Divider />
          
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Precio
            </Text>
            <Text style={[styles.priceText, { color: theme.colors.primary }]}>
              {evento.precio}
            </Text>
          </View>
          
          <Divider />
          
          <Text style={[styles.sectionTitle, { color: theme.colors.text, marginBottom: 10 }]}>Compartir</Text>
          <EventShareButtons 
            eventId={id.toString()} 
            eventName={evento.titulo}
            eventDate={formatearFecha(evento.fecha)}
            eventLocation={evento.lugar}
          />
          
          <Divider />
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: isRegistered ? theme.colors.success : theme.colors.primary }
              ]}
              onPress={handleRegister}
            >
              <Ionicons 
                name={isRegistered ? "checkmark" : "ticket-outline"} 
                size={20} 
                color="#FFFFFF" 
              />
              <Text style={styles.buttonText}>
                {isRegistered ? 'Registrado' : 'Registrarse'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.secondaryButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  { borderColor: theme.colors.primary }
                ]}
                onPress={handleSave}
              >
                <Ionicons 
                  name={isSaved ? "bookmark" : "bookmark-outline"} 
                  size={20} 
                  color={theme.colors.primary} 
                />
                <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
                  {isSaved ? 'Guardado' : 'Guardar'}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  { borderColor: theme.colors.primary }
                ]}
                onPress={handleShare}
              >
                <Ionicons name="share-outline" size={20} color={theme.colors.primary} />
                <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
                  Compartir
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {/* Barra inferior con botón de compra */}
      <View style={styles.bottomBar}>
        {hasTicket ? (
          <TouchableOpacity 
            style={styles.viewTicketButton}
            onPress={() => router.push('/profile/tickets')}
          >
            <Ionicons name="ticket-outline" size={20} color="#fff" />
            <Text style={styles.viewTicketButtonText}>Ver mi ticket</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={styles.buyButton}
            onPress={handleComprarTicket}
          >
            <Text style={styles.buyButtonText}>
              {evento.precio === 0 ? 'Reservar entrada gratuita' : 'Comprar entrada'}
            </Text>
            <Text style={styles.buyButtonPrice}>
              {evento.precio}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 250,
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentSection: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tagPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  section: {
    marginVertical: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllLink: {
    fontSize: 14,
  },
  sectionDivider: {
    marginVertical: 12,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 22,
  },
  sectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 16,
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    marginTop: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  secondaryButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    marginHorizontal: 4,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#0066CC',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  viewAllCommentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 8,
  },
  viewAllCommentsText: {
    fontSize: 14,
    marginRight: 4,
  },
  locationContainer: {
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  locationText: {
    fontSize: 14,
    marginBottom: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  buyButton: {
    backgroundColor: '#0066CC',
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buyButtonPrice: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewTicketButton: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewTicketButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
}); 