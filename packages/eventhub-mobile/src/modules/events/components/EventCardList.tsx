import React from 'react';
import { 
  View, 
  FlatList, 
  StyleSheet, 
  ActivityIndicator, 
  Text, 
  ViewStyle 
} from 'react-native';
import { EventCard, EventCardProps } from './EventCard';
import { EmptyState } from '../../../shared/components/ui/EmptyState';
import { useTheme } from '../../../shared/hooks/useTheme';

export interface EventCardListProps {
  events: EventCardProps['event'][];
  loading?: boolean;
  refreshing?: boolean;
  onRefresh?: () => void;
  onEventPress?: (event: EventCardProps['event']) => void;
  emptyStateMessage?: {
    icon?: string;
    title: string;
    message?: string;
  };
  horizontal?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  numColumns?: number;
  compact?: boolean;
}

/**
 * Componente que renderiza una lista de EventCard
 */
export const EventCardList = ({
  events,
  loading = false,
  refreshing = false,
  onRefresh,
  onEventPress,
  emptyStateMessage = {
    icon: 'calendar-outline',
    title: 'No hay eventos disponibles',
    message: 'No se encontraron eventos que coincidan con tus criterios'
  },
  horizontal = false,
  showsHorizontalScrollIndicator = false,
  style,
  contentContainerStyle,
  numColumns = 1,
  compact = false,
}: EventCardListProps) => {
  const { theme, getColorValue } = useTheme();
  
  // Renderizar cada elemento de la lista
  const renderItem = ({ item }: { item: EventCardProps['event'] }) => (
    <EventCard
      event={item}
      onPress={() => onEventPress && onEventPress(item)}
      compact={compact}
    />
  );
  
  // Renderizar estado vacío
  const renderEmpty = () => {
    if (loading) return null;
    
    return (
      <EmptyState
        icon={emptyStateMessage.icon || 'calendar-outline'}
        title={emptyStateMessage.title}
        message={emptyStateMessage.message}
        containerStyle={styles.emptyStateContainer}
      />
    );
  };
  
  // Renderizar indicador de carga
  const renderLoading = () => {
    if (!loading || refreshing) return null;
    
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator 
          size="large" 
          color={getColorValue(theme.colors.primary.main)} 
        />
        <Text style={[
          styles.loadingText, 
          { color: getColorValue(theme.colors.text.secondary) }
        ]}>
          Cargando eventos...
        </Text>
      </View>
    );
  };
  
  if (loading && !refreshing && events.length === 0) {
    return renderLoading();
  }
  
  return (
    <FlatList
      data={events}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListEmptyComponent={renderEmpty}
      refreshing={refreshing}
      onRefresh={onRefresh}
      horizontal={horizontal}
      showsHorizontalScrollIndicator={showsHorizontalScrollIndicator}
      style={[styles.container, style]}
      contentContainerStyle={[
        styles.contentContainer,
        events.length === 0 && styles.emptyListContainer,
        contentContainerStyle
      ]}
      numColumns={numColumns}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateContainer: {
    padding: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
}); 