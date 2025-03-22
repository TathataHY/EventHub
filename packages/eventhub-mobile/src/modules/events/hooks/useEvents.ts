import { useState, useCallback } from 'react';
import { eventService } from '../services';
import { Event, EventSearchParams } from '../types';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar eventos
  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const fetchedEvents = await eventService.getEvents();
      setEvents(fetchedEvents);
    } catch (err) {
      setError('Error al cargar los eventos');
      console.error('Error loading events:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar eventos
  const searchEvents = useCallback(async (params: EventSearchParams) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const searchResults = await eventService.searchEvents(params);
      setEvents(searchResults);
    } catch (err) {
      setError('Error al buscar eventos');
      console.error('Error searching events:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refrescar eventos
  const refreshEvents = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);
      
      const refreshedEvents = await eventService.getEvents();
      setEvents(refreshedEvents);
    } catch (err) {
      setError('Error al refrescar los eventos');
      console.error('Error refreshing events:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return {
    events,
    isLoading,
    isRefreshing,
    error,
    loadEvents,
    searchEvents,
    refreshEvents
  };
}; 