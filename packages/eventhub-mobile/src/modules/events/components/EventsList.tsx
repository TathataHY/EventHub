import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  ListRenderItemInfo
} from 'react-native';
import { Event } from '../types';
import { EventCard } from './EventCard';
import { colors } from '@theme';

interface EventsListProps {
  events: Event[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onEventPress?: (event: Event) => void;
  emptyText?: string;
  compact?: boolean;
}

export const EventsList: React.FC<EventsListProps> = ({
  events,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  onEventPress,
  emptyText = "No hay eventos disponibles",
  compact = false
}) => {
  // Renderizar cada ítem de la lista
  const renderItem = ({ item }: ListRenderItemInfo<Event>) => (
    <EventCard
      event={item}
      onPress={() => onEventPress?.(item)}
      compact={compact}
    />
  );

  // Renderizar mensaje cuando la lista está vacía
  const renderEmptyComponent = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{emptyText}</Text>
      </View>
    );
  };

  // Renderizar indicador de carga
  const renderLoader = () => {
    if (!isLoading) return null;

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loaderText}>Cargando eventos...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Mostrar loader si está cargando inicialmente */}
      {isLoading && events.length === 0 ? (
        renderLoader()
      ) : (
        <FlatList
          data={events}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 200,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    minHeight: 200,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textDark,
  },
}); 