import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import { useUser } from '@modules/auth/hooks';
import { useTheme } from '../../../shared/hooks/useTheme';
import { bookmarkService } from '@modules/events/services/bookmark.service';
import { eventService } from '@modules/events/services/event.service';
import { authService } from '@modules/auth/services/auth.service';
import { EventCard } from '@modules/events/components';
import { formatCurrency, formatDate } from '@shared/utils';
import { EmptyState } from '@shared/components/ui/EmptyState';
import { LoadingState } from '../../../shared/components/ui/LoadingState';

// Interfaz para los eventos
interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  location: string;
  price: number;
  category: string;
  organizer: string;
}

export function SavedEventsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { currentUser, isLoading, getSavedEvents } = useUser();
  const [refreshing, setRefreshing] = useState(false);
  const [savedEvents, setSavedEvents] = useState<any[]>([]);

  // Cargar eventos guardados
  useEffect(() => {
    loadSavedEvents();
  }, []);

  const loadSavedEvents = async () => {
    try {
      const events = await getSavedEvents();
      setSavedEvents(events || []);
    } catch (error) {
      console.error('Error loading saved events:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSavedEvents();
    setRefreshing(false);
  };

  const handleBrowseEvents = () => {
    // Implementar navegación a la pantalla de explorar eventos
    // navigation.navigate('Explore');
  };

  // Renderizado condicional basado en el estado
  if (isLoading && !refreshing) {
    return (
      <LoadingState message="Cargando eventos guardados..." />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={savedEvents}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventCard event={item} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary.main}
            colors={[theme.colors.primary.main]}
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="bookmark-outline"
            title="No has guardado ningún evento"
            message="Los eventos que guardes aparecerán aquí para acceso rápido"
            containerStyle={styles.emptyStateContainer}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    flexGrow: 1,
    padding: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  browseButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  browseButtonText: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
}); 