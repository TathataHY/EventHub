import React from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useTheme } from '@core/context/ThemeContext';
import EventCard from './EventCard';
import { Event } from '../types';

interface EventListProps {
  events: Event[];
  loading?: boolean;
  error?: string | null;
  onEventPress?: (event: Event) => void;
  emptyMessage?: string;
  headerComponent?: React.ReactElement;
  footerComponent?: React.ReactElement;
}

const EventList: React.FC<EventListProps> = ({
  events,
  loading = false,
  error = null,
  onEventPress,
  emptyMessage = 'No hay eventos disponibles',
  headerComponent,
  footerComponent,
}) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.message, { color: theme.colors.error }]}>
          {error}
        </Text>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={[styles.message, { color: theme.colors.secondaryText }]}>
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={events}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <EventCard
          event={item}
          onPress={onEventPress ? () => onEventPress(item) : undefined}
        />
      )}
      contentContainerStyle={styles.list}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={footerComponent}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default EventList; 