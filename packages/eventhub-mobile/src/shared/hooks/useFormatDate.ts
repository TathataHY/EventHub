import { useCallback } from 'react';
import { formatRelativeDate } from '../utils/formatters';

/**
 * Hook para formatear fechas en diferentes formatos
 */
export const useFormatDate = () => {
  /**
   * Formatea una fecha como texto relativo (ej: "hace 5 minutos")
   */
  const formatRelative = useCallback((date: string) => {
    return formatRelativeDate(date);
  }, []);

  /**
   * Formatea una fecha en formato corto (DD/MM/YYYY)
   */
  const formatShort = useCallback((date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  /**
   * Formatea una fecha en formato largo (DD de Mes, YYYY)
   */
  const formatLong = useCallback((date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }, []);

  return {
    formatRelative,
    formatShort,
    formatLong
  };
}; 