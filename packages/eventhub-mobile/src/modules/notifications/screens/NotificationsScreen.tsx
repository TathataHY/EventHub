import React, { useState, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  ScrollView
} from 'react-native';
import { NotificationList } from '../components';
import { useHeaderHeight } from '@react-navigation/elements';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme';
import { notificationService } from '../services';

export const NotificationsScreen: React.FC = () => {
  const headerHeight = useHeaderHeight();
  const navigation = useNavigation();
  
  // Estado para filtros
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  
  // Función para marcar todas como leídas
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAsRead({ allNotifications: true });
      // Actualizar la lista (se hará en el componente NotificationList a través de un refresh)
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  }, []);

  // Configurar el encabezado con botón para marcar todas como leídas
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={handleMarkAllAsRead}
        >
          <Text style={styles.headerButtonText}>Marcar todo como leído</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleMarkAllAsRead]);

  // Tipos de filtro con sus íconos
  const filters = [
    { id: 'all', label: 'Todas', icon: 'notifications' },
    { id: 'EVENT_REMINDER', label: 'Recordatorios', icon: 'alarm' },
    { id: 'EVENT_INVITE', label: 'Invitaciones', icon: 'mail' },
    { id: 'EVENT_UPDATE', label: 'Actualizaciones', icon: 'refresh' },
    { id: 'NEW_COMMENT', label: 'Comentarios', icon: 'chatbubble' },
  ];

  return (
    <View style={[styles.container, { paddingTop: headerHeight * 0.2 }]}>
      {/* Filtros en chips */}
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersContainer}
      >
        {filters.map(filter => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              activeFilter === filter.id && styles.activeFilterChip
            ]}
            onPress={() => setActiveFilter(
              activeFilter === filter.id ? null : filter.id
            )}
          >
            <Ionicons 
              name={filter.icon as any} 
              size={16} 
              color={activeFilter === filter.id ? 'white' : colors.primary}
              style={styles.filterIcon}
            />
            <Text 
              style={[
                styles.filterLabel,
                activeFilter === filter.id && styles.activeFilterLabel
              ]}
            >
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de notificaciones */}
      <NotificationList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerButton: {
    paddingHorizontal: 16,
  },
  headerButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.lightGray,
  },
  activeFilterChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterLabel: {
    fontSize: 14,
    color: colors.textDark,
  },
  activeFilterLabel: {
    color: 'white',
  },
}); 