import { useState } from 'react';
import { router } from 'expo-router';
import { SearchResult, SearchResultType } from '@modules/search/types';

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'conciertos',
    'talleres de cocina',
    'eventos deportivos',
    'festivales'
  ]);

  // Manejar cambios en la consulta de búsqueda
  const handleSearchQueryChange = (text: string) => {
    setSearchQuery(text);
    
    if (text.length > 2) {
      performSearch(text);
    } else if (text.length === 0) {
      setSearchResults([]);
      setIsSearching(false);
    }
  };

  // Realizar búsqueda (simulada)
  const performSearch = (query: string) => {
    setIsSearching(true);
    
    // Simulamos una búsqueda con un retraso
    setTimeout(() => {
      // Datos de muestra para la búsqueda
      const mockResults: SearchResult[] = [
        {
          id: '1',
          type: 'event',
          title: 'Festival de Música Indie',
          subtitle: '10 Jun 2024 • Madrid',
          imageUrl: 'https://example.com/events/festival.jpg'
        },
        {
          id: '2',
          type: 'event',
          title: 'Taller de Cocina Italiana',
          subtitle: '15 Jun 2024 • Barcelona',
          imageUrl: 'https://example.com/events/cooking.jpg'
        },
        {
          id: '3',
          type: 'user',
          title: 'Carlos Rodríguez',
          subtitle: '@carlos_events',
          imageUrl: 'https://example.com/users/carlos.jpg'
        },
        {
          id: '4',
          type: 'place',
          title: 'Teatro Principal',
          subtitle: 'Calle Mayor 1, Madrid',
          imageUrl: 'https://example.com/places/teatro.jpg'
        },
        {
          id: '5',
          type: 'event',
          title: 'Exposición de Arte Contemporáneo',
          subtitle: '20 Jun 2024 • Valencia',
          imageUrl: 'https://example.com/events/art.jpg'
        }
      ];
      
      // Filtrar resultados basados en la consulta
      const filteredResults = mockResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        (result.subtitle && result.subtitle.toLowerCase().includes(query.toLowerCase()))
      );
      
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 500);
  };

  // Manejar el clic en un resultado de búsqueda
  const handleResultPress = (result: SearchResult) => {
    // Guardar la búsqueda en el historial
    if (searchQuery && !recentSearches.includes(searchQuery)) {
      setRecentSearches(prev => [searchQuery, ...prev].slice(0, 5));
    }
    
    // Navegar según el tipo de resultado
    if (result.type === 'event') {
      router.push(`/events/${result.id}`);
    } else if (result.type === 'user') {
      router.push(`/profile/${result.id}`);
    } else if (result.type === 'place') {
      router.push(`/map?place=${result.id}`);
    }
  };

  // Manejar el clic en una búsqueda reciente
  const handleRecentSearchPress = (search: string) => {
    setSearchQuery(search);
    performSearch(search);
  };

  // Limpiar búsquedas recientes
  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Obtener icono según el tipo de resultado
  const getResultIcon = (type: SearchResultType): string => {
    switch (type) {
      case 'event': return 'calendar';
      case 'user': return 'person';
      case 'place': return 'location';
      default: return 'search';
    }
  };

  return {
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
  };
} 