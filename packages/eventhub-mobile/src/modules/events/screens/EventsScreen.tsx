import React, { useState, useMemo } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';
import { useEvents } from '../hooks/useEvents';
import { EventsList, EventsSearchBar, EventFilters } from '../components';
import { Event, EventCategory, EventType } from '../types';
import { colors } from '@theme';

interface EventsScreenProps {
  onEventPress?: (event: Event) => void;
}

export const EventsScreen: React.FC<EventsScreenProps> = ({ onEventPress }) => {
  // Filtros de búsqueda
  const [searchQuery, setSearchQuery] = useState('');
  const [filterParams, setFilterParams] = useState<{
    categories: EventCategory[];
    types: EventType[];
    isFree?: boolean;
  }>({
    categories: [],
    types: [],
  });
  
  // Usar el hook de eventos
  const {
    events,
    isLoading,
    isRefreshing,
    error,
    loadEvents,
    searchEvents,
    refreshEvents
  } = useEvents();
  
  // Manejar cambios en la búsqueda
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    searchEvents({
      query,
      category: filterParams.categories.length > 0 ? filterParams.categories[0] : undefined,
      type: filterParams.types.length > 0 ? filterParams.types[0] : undefined,
      isFree: filterParams.isFree
    });
  };
  
  // Manejar cambios en los filtros
  const handleFilterChange = (filters: any) => {
    const newFilterParams = {
      categories: filters.categories || [],
      types: filters.types || [],
      isFree: filters.isFree
    };
    
    setFilterParams(newFilterParams);
    searchEvents({
      query: searchQuery,
      category: newFilterParams.categories.length > 0 ? newFilterParams.categories[0] : undefined,
      type: newFilterParams.types.length > 0 ? newFilterParams.types[0] : undefined,
      isFree: newFilterParams.isFree
    });
  };
  
  // Manejar el refresco de la lista
  const handleRefresh = () => {
    refreshEvents();
  };
  
  // Manejar el press en un evento
  const handleEventPress = (event: Event) => {
    if (onEventPress) {
      onEventPress(event);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      
      <View style={styles.searchContainer}>
        <EventsSearchBar
          onSearch={handleSearch}
          initialValue={searchQuery}
        />
      </View>
      
      <EventFilters
        onFilterChange={handleFilterChange}
        initialFilters={filterParams}
      />
      
      <EventsList
        events={events}
        isLoading={isLoading}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
        onEventPress={handleEventPress}
        emptyText={
          searchQuery || filterParams.categories.length > 0 || filterParams.types.length > 0
            ? "No se encontraron eventos con los filtros seleccionados"
            : "No hay eventos disponibles"
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    backgroundColor: colors.cardBackground,
    paddingBottom: 8,
  },
}); 