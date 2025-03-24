import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useTheme } from '@core/context/ThemeContext';
import {
  NotificationItem,
  NotificationHeader
} from '@modules/notifications/components';
import { EmptyState } from '@shared/components/ui/EmptyState';
import { Notification } from '@modules/notifications/services/notification.service';

interface NotificationsPresenterProps {
  notifications: Notification[];
  loading: boolean;
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onRefresh: () => void;
  onNotificationPress: (notification: Notification) => void;
}

/**
 * Presentador para la pantalla de notificaciones
 * Se encarga únicamente de la representación visual
 */
export function NotificationsPresenter({
  notifications,
  loading,
  unreadCount,
  onMarkAllAsRead,
  onRefresh,
  onNotificationPress
}: NotificationsPresenterProps) {
  const { theme } = useTheme();
  
  // Renderizar ítem de notificación
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <NotificationItem
      notification={item}
      onPress={onNotificationPress}
    />
  );

  // Renderizar separador entre items
  const renderSeparator = () => (
    <View style={[styles.separator, { backgroundColor: theme.colors.border.main }]} />
  );

  if (loading && notifications.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background.default }]}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      <NotificationHeader
        unreadCount={unreadCount}
        onMarkAllAsRead={onMarkAllAsRead}
      />
      
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotificationItem}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={notifications.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <EmptyState 
            title="No hay notificaciones"
            message="No tienes notificaciones en este momento"
            icon="notifications-outline"
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[theme.colors.primary.main]}
            tintColor={theme.colors.primary.main}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  emptyList: {
    flex: 1,
  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
}); 