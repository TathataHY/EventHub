import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  Image, 
  StyleSheet, 
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@core/context/ThemeContext';
import { SearchResult, SearchResultType } from '../types';
import { EmptyState } from '@shared/components/ui/EmptyState';

interface SearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  getResultIcon: (type: SearchResultType) => string;
  onResultPress: (result: SearchResult) => void;
}

export function SearchResults({ 
  results, 
  searchQuery, 
  getResultIcon, 
  onResultPress 
}: SearchResultsProps) {
  const { theme } = useTheme();
  
  // Renderizar ítem de resultado
  const renderResultItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={[styles.resultItem, { backgroundColor: theme.colors.background.card }]}
      onPress={() => onResultPress(item)}
    >
      <View style={styles.resultImageContainer}>
        {item.imageUrl ? (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.resultImage}
            defaultSource={require('../../../../assets/placeholder.png')}
          />
        ) : (
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.border.light }]}>
            <Ionicons name={getResultIcon(item.type)} size={20} color={theme.colors.text.primary} />
          </View>
        )}
      </View>
      
      <View style={styles.resultContent}>
        <Text style={[styles.resultTitle, { color: theme.colors.text.primary }]}>
          {item.title}
        </Text>
        {item.subtitle && (
          <Text style={[styles.resultSubtitle, { color: theme.colors.text.secondary }]}>
            {item.subtitle}
          </Text>
        )}
      </View>
      
      <Ionicons name="chevron-forward" size={20} color={theme.colors.text.secondary} />
    </TouchableOpacity>
  );
  
  // Estado sin resultados
  const EmptyResults = () => (
    <View style={styles.emptyResultsContainer}>
      <Ionicons name="search-outline" size={60} color={theme.colors.text.secondary} />
      <Text style={[styles.emptyResultsText, { color: theme.colors.text.primary }]}>
        No se encontraron resultados para "{searchQuery}"
      </Text>
    </View>
  );
  
  return (
    <FlatList
      data={results}
      renderItem={renderResultItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.resultsList}
      ListEmptyComponent={EmptyResults}
    />
  );
}

const styles = StyleSheet.create({
  resultsList: {
    paddingHorizontal: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  resultImageContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
  },
  resultImage: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultContent: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  resultSubtitle: {
    fontSize: 14,
  },
  emptyResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  emptyResultsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
}); 