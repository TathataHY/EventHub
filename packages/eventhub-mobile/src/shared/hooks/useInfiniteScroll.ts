import { useState, useCallback, useEffect } from 'react';

interface UseInfiniteScrollOptions<T> {
  fetchData: (page: number) => Promise<T[]>;
  initialPage?: number;
  pageSize?: number;
  enabled?: boolean;
}

interface UseInfiniteScrollResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => Promise<void>;
}

/**
 * Hook para implementar desplazamiento infinito en listas
 */
export function useInfiniteScroll<T>({
  fetchData,
  initialPage = 1,
  pageSize = 10,
  enabled = true
}: UseInfiniteScrollOptions<T>): UseInfiniteScrollResult<T> {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoaded, setInitialLoaded] = useState(false);

  // Cargar datos
  const loadData = useCallback(async (currentPage: number, append = true) => {
    if (!enabled) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const newData = await fetchData(currentPage);
      
      // Actualizar el estado según si estamos añadiendo o reemplazando datos
      setData(prevData => append ? [...prevData, ...newData] : newData);
      
      // Comprobar si hay más páginas
      setHasMore(newData.length === pageSize);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
      console.error('Error en useInfiniteScroll:', err);
    } finally {
      setLoading(false);
      if (currentPage === initialPage) {
        setInitialLoaded(true);
      }
    }
  }, [fetchData, pageSize, enabled, initialPage]);

  // Cargar la primera página de datos
  useEffect(() => {
    if (enabled && !initialLoaded) {
      loadData(initialPage, false);
    }
  }, [loadData, initialPage, enabled, initialLoaded]);

  // Función para cargar más datos
  const loadMore = useCallback(() => {
    if (loading || !hasMore || !enabled) return;
    setPage(prev => {
      const nextPage = prev + 1;
      loadData(nextPage, true);
      return nextPage;
    });
  }, [loading, hasMore, loadData, enabled]);

  // Función para refrescar los datos
  const refresh = useCallback(async () => {
    if (!enabled) return;
    setPage(initialPage);
    await loadData(initialPage, false);
  }, [loadData, initialPage, enabled]);

  return {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    refresh
  };
} 