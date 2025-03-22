import React from 'react';
import { useSearch } from '@modules/search/hooks';
import { SearchPresenter } from './SearchPresenter';

/**
 * Componente contenedor para la pantalla de búsqueda
 * Maneja la lógica y estado, delegando la presentación al SearchPresenter
 */
export function SearchContainer() {
  // Usar hook personalizado para toda la lógica de negocio
  const {
    searchQuery,
    isSearching,
    searchResults,
    recentSearches,
    handleSearchQueryChange,
    performSearch,
    handleResultPress,
    handleRecentSearchPress,
    clearRecentSearches,
    getResultIcon
  } = useSearch();
  
  // Pasar todos los props necesarios al componente de presentación
  return (
    <SearchPresenter
      searchQuery={searchQuery}
      isSearching={isSearching}
      searchResults={searchResults}
      recentSearches={recentSearches}
      onSearchQueryChange={handleSearchQueryChange}
      onSearch={performSearch}
      onResultPress={handleResultPress}
      onRecentSearchPress={handleRecentSearchPress}
      onClearRecentSearches={clearRecentSearches}
      getResultIcon={getResultIcon}
    />
  );
} 