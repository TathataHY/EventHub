// Tipos de resultado de búsqueda
export type SearchResultType = 'event' | 'user' | 'place';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  imageUrl?: string;
} 