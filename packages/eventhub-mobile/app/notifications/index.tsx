import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Divider } from '../../src/components/common/Divider';

// Tipos de notificaciones
type NotificationType = 'evento' | 'seguidor' | 'comentario' | 'invitacion' | 'sistema';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string; // ISO string
  read: boolean;
  data?: {
    eventId?: string;
    userId?: string;
    commentId?: string;
  };
}

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<NotificationType | 'todas'>('todas');

  // Datos de ejemplo - En una aplicación real, estos vendrían de una API
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'evento',
      title: 'Evento actualizado',
      message: 'El evento "Festival de Jazz en el Parque" ha cambiado de fecha.',
      date: '2024-04-10T14:30:00Z',
      read: false,
      data: {
        eventId: '1',
      },
    },
    {
      id: '2',
      type: 'seguidor',
      title: 'Nuevo seguidor',
      message: 'Carlos Rodríguez ha comenzado a seguirte.',
      date: '2024-04-09T09:15:00Z',
      read: true,
      data: {
        userId: '123',
      },
    },
    {
      id: '3',
      type: 'comentario',
      title: 'Nuevo comentario',
      message: 'Ana López comentó en tu evento "Taller de Fotografía".',
      date: '2024-04-08T18:45:00Z',
      read: false,
      data: {
        eventId: '3',
        commentId: '456',
      },
    },
    {
      id: '4',
      type: 'invitacion',
      title: 'Invitación a evento',
      message: 'Pablo Martínez te ha invitado al evento "Exposición de Arte Moderno".',
      date: '2024-04-07T11:20:00Z',
      read: true,
      data: {
        eventId: '6',
        userId: '789',
      },
    },
    {
      id: '5',
      type: 'sistema',
      title: 'Bienvenido a EventHub',
      message: '¡Gracias por unirte a EventHub! Comienza a explorar eventos cerca de ti.',
      date: '2024-04-05T10:00:00Z',
      read: true,
    },
    {
      id: '6',
      type: 'evento',
      title: 'Recordatorio de evento',
      message: 'Tu evento "Conferencia de Diseño" comienza mañana.',
      date: '2024-04-04T09:30:00Z',
      read: false,
      data: {
        eventId: '3',
      },
    },
  ];

  useEffect(() => {
    // Simulamos la carga de datos
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  // Formatear fecha relativa
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Ahora mismo';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `Hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
    }
    
    // Si es más de una semana, mostramos la fecha
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
    });
  };

  // Obtener icono según el tipo de notificación
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'evento':
        return 'calendar';
      case 'seguidor':
        return 'person-add';
      case 'comentario':
        return 'chatbubble';
      case 'invitacion':
        return 'mail';
      case 'sistema':
        return 'information-circle';
      default:
        return 'notifications';
    }
  };

  // Obtener color según el tipo de notificación
  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'evento':
        return '#4A80F5'; // Azul
      case 'seguidor':
        return '#5856D6'; // Púrpura
      case 'comentario':
        return '#34C759'; // Verde
      case 'invitacion':
        return '#FF9500'; // Naranja
      case 'sistema':
        return '#8E8E93'; // Gris
      default:
        return theme.colors.primary;
    }
  };

  // Manejar la acción al tocar una notificación
  const handleNotificationPress = (notification: Notification) => {
    // Marcar como leída
    const updatedNotifications = notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);

    // Navegar según el tipo de notificación
    if (notification.type === 'evento' && notification.data?.eventId) {
      router.push(`/events/evento/${notification.data.eventId}`);
    } else if (notification.type === 'seguidor' && notification.data?.userId) {
      // Aquí iría la navegación al perfil del usuario
      console.log(`Ver perfil del usuario ${notification.data.userId}`);
    } else if (notification.type === 'invitacion' && notification.data?.eventId) {
      router.push(`/events/evento/${notification.data.eventId}`);
    }
  };

  // Marcar todas como leídas
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
  };

  const filteredNotifications = filter === 'todas' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { backgroundColor: theme.colors.card },
        !item.read && styles.unreadNotification,
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View 
        style={[
          styles.iconContainer, 
          { backgroundColor: getNotificationColor(item.type) + '20' }
        ]}
      >
        <Ionicons 
          name={getNotificationIcon(item.type)} 
          size={24} 
          color={getNotificationColor(item.type)} 
        />
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text 
            style={[
              styles.notificationTitle, 
              { color: theme.colors.text },
              !item.read && { fontWeight: '700' }
            ]}
          >
            {item.title}
          </Text>
          <Text style={[styles.dateText, { color: theme.colors.secondaryText }]}>
            {formatRelativeDate(item.date)}
          </Text>
        </View>
        
        <Text 
          style={[
            styles.notificationMessage, 
            { color: theme.colors.secondaryText },
            !item.read && { color: theme.colors.text }
          ]}
          numberOfLines={2}
        >
          {item.message}
        </Text>
      </View>
      
      {!item.read && (
        <View 
          style={[
            styles.unreadDot, 
            { backgroundColor: theme.colors.primary }
          ]} 
        />
      )}
    </TouchableOpacity>
  );

  const renderFilterChip = (filterType: NotificationType | 'todas', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        filter === filterType ? 
          { backgroundColor: theme.colors.primary } : 
          { borderColor: theme.colors.border, borderWidth: 1 }
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Text 
        style={[
          styles.filterChipText,
          { color: filter === filterType ? '#FFFFFF' : theme.colors.text }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Notificaciones
        </Text>
        
        {notifications.some(n => !n.read) && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <Text style={[styles.markAllButtonText, { color: theme.colors.primary }]}>
              Marcar todas como leídas
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.filtersContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.filtersScrollContent}
        >
          {renderFilterChip('todas', 'Todas')}
          {renderFilterChip('evento', 'Eventos')}
          {renderFilterChip('seguidor', 'Seguidores')}
          {renderFilterChip('comentario', 'Comentarios')}
          {renderFilterChip('invitacion', 'Invitaciones')}
          {renderFilterChip('sistema', 'Sistema')}
        </ScrollView>
      </View>
      
      <Divider />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Cargando notificaciones...
          </Text>
        </View>
      ) : filteredNotifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="notifications-off" 
            size={60} 
            color={theme.colors.secondaryText} 
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No hay notificaciones
          </Text>
          <Text style={[styles.emptyMessage, { color: theme.colors.secondaryText }]}>
            {filter === 'todas' 
              ? 'No tienes notificaciones en este momento' 
              : `No tienes notificaciones de tipo "${filter}"`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notificationsList}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  markAllButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  markAllButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filtersScrollContent: {
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    position: 'relative',
  },
  unreadNotification: {
    backgroundColor: 'rgba(74, 128, 245, 0.05)', // Ligero tinte azul para no leídas
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  dateText: {
    fontSize: 12,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 13,
    lineHeight: 18,
  },
  unreadDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  separator: {
    height: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 40,
  },
}); 