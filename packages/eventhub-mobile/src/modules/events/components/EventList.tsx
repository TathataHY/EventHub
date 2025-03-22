import React from 'react';
import { FlatList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useTheme } from '@core/context/ThemeContext';
import { EventCard } from './EventCard';
import { Event } from '@modules/events/types';

interface EventListProps {
  events: Event[];
  loading?: boolean;
  error?: string | null;
  onEventPress?: (event: Event) => void;
  emptyMessage?: string;
  headerComponent?: React.ReactElement;
  footerComponent?: React.ReactElement;
  numColumns?: number;
}

export const EventList: React.FC<EventListProps> = ({
  events,
  loading = false,
  error = null,
  onEventPress,
  emptyMessage = 'No hay eventos disponibles',
  headerComponent,
  footerComponent,
  numColumns = 1
}) => {
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background.default }]}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background.default }]}>
        <Text style={[styles.message, { color: theme.colors.error.main }]}>
          {error}
        </Text>
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background.default }]}>
        <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
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
      numColumns={numColumns}
      key={numColumns.toString()} // Forzar rerenderizado cuando cambia numColumns
      contentContainerStyle={styles.list}
      columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
      ListHeaderComponent={headerComponent}
      ListFooterComponent={footerComponent}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
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