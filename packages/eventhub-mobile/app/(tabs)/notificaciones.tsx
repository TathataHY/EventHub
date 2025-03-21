import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '../../src/context/ThemeContext';
import { Divider } from '../../src/components/common/Divider';

type NotificationType = 
  | 'evento'     // Notificaciones relacionadas con eventos (cancelación, cambio de horario, etc)
  | 'seguidor'   // Cuando alguien comienza a seguirte
  | 'comentario' // Comentarios en tus eventos
  | 'invitacion' // Invitaciones a eventos
  | 'sistema';   // Notificaciones del sistema

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

export default function NotificacionesScreen() {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<NotificationType | 'todas'>('todas');

  // Cargar notificaciones (simulado)
  useEffect(() => {
    const fakeNotificaciones: Notification[] = [
      {
        id: '1',
        type: 'evento',
        title: 'Evento actualizado',
        message: 'El horario de "Festival de Jazz 2023" ha cambiado a las 19:00',
        date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutos atrás
        read: false,
        data: { eventId: '101' }
      },
      {
        id: '2',
        type: 'seguidor',
        title: 'Nuevo seguidor',
        message: 'Carlos Martínez ahora te sigue',
        date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 horas atrás
        read: true,
        data: { userId: '202' }
      },
      {
        id: '3',
        type: 'comentario',
        title: 'Nuevo comentario',
        message: 'Laura dejó un comentario en tu evento "Taller de Fotografía"',
        date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 horas atrás
        read: false,
        data: { eventId: '103', commentId: '304' }
      },
      {
        id: '4',
        type: 'invitacion',
        title: 'Invitación a evento',
        message: 'Ana te ha invitado a "Noche de cine al aire libre"',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 día atrás
        read: false,
        data: { eventId: '104', userId: '205' }
      },
      {
        id: '5',
        type: 'sistema',
        title: 'Bienvenido a EventHub',
        message: '¡Gracias por unirte! Descubre eventos cerca de ti.',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 días atrás
        read: true
      },
      {
        id: '6',
        type: 'evento',
        title: 'Recordatorio de evento',
        message: '"Taller de cocina italiana" comienza mañana a las 11:00',
        date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 horas atrás
        read: false,
        data: { eventId: '106' }
      },
      {
        id: '7',
        type: 'sistema',
        title: 'Actualización de la aplicación',
        message: 'Hemos añadido nuevas funciones. ¡Descúbrelas!',
        date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 días atrás
        read: true
      }
    ];

    // Simular carga de datos
    setTimeout(() => {
      setNotifications(fakeNotificaciones);
      setLoading(false);
    }, 1000);
  }, []);

  // Formatear fecha relativa
  const formatRelativeDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) {
      return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    } else {
      return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    }
  };

  // Obtener icono según tipo de notificación
  const getNotificationIcon = (type: NotificationType): string => {
    switch (type) {
      case 'evento': return 'calendar';
      case 'seguidor': return 'person-add';
      case 'comentario': return 'chatbubble';
      case 'invitacion': return 'mail';
      case 'sistema': return 'information-circle';
      default: return 'notifications';
    }
  };

  // Obtener color según tipo de notificación
  const getNotificationColor = (type: NotificationType): string => {
    switch (type) {
      case 'evento': return theme.colors.primary;
      case 'seguidor': return theme.colors.success;
      case 'comentario': return theme.colors.info;
      case 'invitacion': return theme.colors.secondary;
      case 'sistema': return theme.colors.warning;
      default: return theme.colors.primary;
    }
  };

  // Manejar click en una notificación
  const handleNotificationPress = (notification: Notification) => {
    // Marcar como leída
    const updatedNotifications = notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);

    // Navegar según tipo y datos
    if (notification.type === 'evento' && notification.data?.eventId) {
      router.push(`/events/evento/${notification.data.eventId}`);
    } else if (notification.type === 'comentario' && notification.data?.eventId) {
      router.push(`/events/evento/comentarios/${notification.data.eventId}`);
    } else if (notification.type === 'invitacion' && notification.data?.eventId) {
      router.push(`/events/evento/${notification.data.eventId}`);
    } else if (notification.type === 'seguidor' && notification.data?.userId) {
      router.push(`/profile/${notification.data.userId}`);
    }
  };

  // Marcar todas como leídas
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  // Renderizar item de notificación
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem, 
        { backgroundColor: theme.colors.card },
        !item.read && styles.unreadNotification,
        !item.read && { backgroundColor: theme.colors.primaryLight }
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(item.type) + '20' }]}>
        <Ionicons 
          name={getNotificationIcon(item.type)} 
          size={24} 
          color={getNotificationColor(item.type)} 
        />
      </View>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.notificationDate, { color: theme.colors.secondaryText }]}>
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
    </TouchableOpacity>
  );

  // Renderizar chip de filtro
  const renderFilterChip = (type: NotificationType | 'todas', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        activeFilter === type && styles.activeFilterChip,
        { 
          backgroundColor: activeFilter === type 
            ? theme.colors.primary 
            : theme.colors.card 
        }
      ]}
      onPress={() => setActiveFilter(type)}
    >
      <Text 
        style={[
          styles.filterChipText,
          { color: activeFilter === type ? '#FFFFFF' : theme.colors.text }
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Filtrar notificaciones
  const filteredNotifications = activeFilter === 'todas'
    ? notifications
    : notifications.filter(n => n.type === activeFilter);

  // Notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.secondaryText }]}>
          Cargando notificaciones...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <View style={styles.headerTop}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Notificaciones
            </Text>
            {unreadCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
          {unreadCount > 0 && (
            <TouchableOpacity
              style={styles.markReadButton}
              onPress={markAllAsRead}
            >
              <Text style={[styles.markReadText, { color: theme.colors.primary }]}>
                Marcar todo como leído
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {renderFilterChip('todas', 'Todas')}
          {renderFilterChip('evento', 'Eventos')}
          {renderFilterChip('seguidor', 'Seguidores')}
          {renderFilterChip('comentario', 'Comentarios')}
          {renderFilterChip('invitacion', 'Invitaciones')}
          {renderFilterChip('sistema', 'Sistema')}
        </ScrollView>
      </View>

      {filteredNotifications.length > 0 ? (
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <Divider style={{ marginHorizontal: 16 }} />}
        />
      ) : (
        <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
          <Ionicons 
            name="notifications-off-outline" 
            size={64} 
            color={theme.colors.secondaryText} 
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            No hay notificaciones
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.colors.secondaryText }]}>
            {activeFilter === 'todas'
              ? 'Aún no tienes notificaciones.'
              : `No tienes notificaciones de tipo "${activeFilter}".`}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomStartRadius: 16,
    borderBottomEndRadius: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  markReadButton: {
    paddingVertical: 4,
  },
  markReadText: {
    fontSize: 14,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  activeFilterChip: {
    borderWidth: 0,
  },
  filterChipText: {
    fontSize: 14,
  },
  listContainer: {
    paddingTop: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
  },
  unreadNotification: {
    borderLeftWidth: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  notificationDate: {
    fontSize: 12,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  }
}); 