import React from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useTheme } from '@shared/hooks/useTheme';
import { getColorValue } from '@theme/theme.types';
import { EventCard } from './EventCard';
import { Event } from '@modules/events/types';
import { ServiceEvent } from '../services/event.service';

interface EventListProps {
  events: Event[] | ServiceEvent[];
  loading?: boolean;
  error?: string | null;
  onEventPress?: (event: Event | ServiceEvent) => void;
  emptyMessage?: string;
  headerComponent?: React.ReactElement;
  footerComponent?: React.ReactElement;
  numColumns?: number;
}

/**
 * Componente que renderiza una lista de eventos
 */
export const EventList: React.FC<EventListProps> = ({
  events,
  loading = false,
  error = null,
  onEventPress,
  emptyMessage = 'No hay eventos disponibles',
  headerComponent,
  footerComponent,
  numColumns = 1,
}) => {
  const { theme } = useTheme();

  const renderItem = ({ item }: { item: Event | ServiceEvent }) => {
    const event = {
      id: item.id,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl || item.image,
      startDate: item.startDate,
      endDate: item.endDate,
      location: item.location,
      price: item.price,
      category: item.category || '',
      organizerId: item.organizerId,
      organizer: item.organizer,
    };

    return (
      <EventCard
        event={event}
        onPress={(eventId) => onEventPress && onEventPress(item)}
        showDetails={true}
      />
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={getColorValue(theme.colors.primary.main)} />
        <Text style={[styles.loadingText, { color: getColorValue(theme.colors.text.secondary) }]}>
          Cargando eventos...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.errorText, { color: getColorValue(theme.colors.error.main) }]}>
          {error}
        </Text>
      </View>
    );
  }

  if (!events || events.length === 0) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.emptyText, { color: getColorValue(theme.colors.text.secondary) }]}>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        numColumns={numColumns}
        ListHeaderComponent={headerComponent}
        ListFooterComponent={footerComponent}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  listContent: {
    padding: 16,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
}); 