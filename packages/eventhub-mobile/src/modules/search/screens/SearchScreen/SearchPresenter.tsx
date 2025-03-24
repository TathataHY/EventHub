import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../../../shared/hooks/useTheme';
import { LoadingState } from '@shared/components/ui/LoadingState';
import {
  SearchBar,
  SearchResults,
  RecentSearches,
  CategorySuggestions
} from '@modules/search/components';
import { SearchResult, SearchResultType } from '@modules/search/types';

// Categorías para las sugerencias
const popularCategories = [
  { id: '1', name: 'Música', icon: 'musical-notes' },
  { id: '2', name: 'Deportes', icon: 'football' },
  { id: '3', name: 'Arte', icon: 'color-palette' },
  { id: '4', name: 'Tecnología', icon: 'hardware-chip' },
  { id: '5', name: 'Gastronomía', icon: 'restaurant' },
  { id: '6', name: 'Educación', icon: 'school' }
];

interface SearchPresenterProps {
  searchQuery: string;
  isSearching: boolean;
  searchResults: SearchResult[];
  recentSearches: string[];
  onSearchQueryChange: (query: string) => void;
  onSearch: (query: string) => void;
  onResultPress: (result: SearchResult) => void;
  onRecentSearchPress: (term: string) => void;
  onClearRecentSearches: () => void;
  getResultIcon: (type: SearchResultType) => string;
}

/**
 * Presentador para la pantalla de búsqueda
 * Se encarga únicamente de la representación visual
 */
export function SearchPresenter({
  searchQuery,
  isSearching,
  searchResults,
  recentSearches,
  onSearchQueryChange,
  onSearch,
  onResultPress,
  onRecentSearchPress,
  onClearRecentSearches,
  getResultIcon
}: SearchPresenterProps) {
  const { theme } = useTheme();
  
  // Manejar el clic en una categoría
  const handleCategoryPress = (category: typeof popularCategories[0]) => {
    onRecentSearchPress(category.name);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.default }]}>
      {/* Barra de búsqueda */}
      <SearchBar
        searchQuery={searchQuery}
        onChangeText={onSearchQueryChange}
        onSubmit={() => onSearch(searchQuery)}
        onClear={() => onSearchQueryChange('')}
      />

      {/* Resultados de la búsqueda o búsquedas recientes */}
      {isSearching ? (
        <LoadingState message="Buscando..." />
      ) : searchQuery.length > 0 ? (
        <SearchResults
          results={searchResults}
          searchQuery={searchQuery}
          getResultIcon={getResultIcon}
          onResultPress={onResultPress}
        />
      ) : (
        <>
          <RecentSearches
            searches={recentSearches}
            onSearchPress={onRecentSearchPress}
            onClearAll={onClearRecentSearches}
          />
          
          <CategorySuggestions
            categories={popularCategories}
            onCategoryPress={handleCategoryPress}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 