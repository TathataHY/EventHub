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
import { Event } from '@modules/events/types';
import { EventCard } from './EventCard';
import { useTheme } from '@core/context/ThemeContext';

interface EventsListProps {
  events: Event[];
  isLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onEventPress?: (event: Event) => void;
  emptyText?: string;
}

export const EventsList: React.FC<EventsListProps> = ({
  events,
  isLoading = false,
  isRefreshing = false,
  onRefresh,
  onEventPress,
  emptyText = "No hay eventos disponibles"
}) => {
  const { theme } = useTheme();
  
  // Renderizar cada ítem de la lista
  const renderItem = ({ item }: ListRenderItemInfo<Event>) => (
    <EventCard
      event={item}
      onPress={onEventPress ? () => onEventPress(item) : undefined}
    />
  );

  // Renderizar mensaje cuando la lista está vacía
  const renderEmptyComponent = () => {
    if (isLoading) return null;

    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
          {emptyText}
        </Text>
      </View>
    );
  };

  // Renderizar indicador de carga
  const renderLoader = () => {
    if (!isLoading) return null;

    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={[styles.loaderText, { color: theme.colors.text.primary }]}>
          Cargando eventos...
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
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
          numColumns={2}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={[theme.colors.primary.main]}
              tintColor={theme.colors.primary.main}
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
  },
  listContent: {
    padding: 8,
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
  },
}); 