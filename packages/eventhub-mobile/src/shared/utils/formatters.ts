/**
 * Utilidades de formateo de datos
 */

/**
 * Formatea una fecha a un formato legible
 * @param date Fecha a formatear (string ISO o Date)
 * @param options Opciones de formato
 * @returns String formateado
 */
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  if (!date) return 'Fecha no disponible';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Opciones predeterminadas
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  // Usar opciones personalizadas o predeterminadas
  const formatOptions = options || defaultOptions;
  
  return new Intl.DateTimeFormat('es-ES', formatOptions).format(dateObj);
};

/**
 * Versión simplificada del formateo de fecha (solo fecha, sin hora)
 */
export const formatDateShort = (date: string | Date): string => {
  if (!date) return 'Fecha no disponible';
  
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Formatea una ubicación para mostrarla de forma legible
 */
export const formatLocation = (location: any): string => {
  if (!location) return 'Ubicación no disponible';
  
  if (typeof location === 'string') {
    return location;
  }
  
  // Si es un objeto con propiedades de ubicación
  if (typeof location === 'object') {
    const parts = [];
    
    if (location.venue) parts.push(location.venue);
    if (location.address) parts.push(location.address);
    if (location.city) parts.push(location.city);
    
    return parts.length > 0 ? parts.join(', ') : 'Ubicación no disponible';
  }
  
  return 'Ubicación no disponible';
};

/**
 * Formatea un número para mostrar como precio
 */
export const formatPrice = (price: number, currency = 'EUR'): string => {
  if (price === undefined || price === null) return 'Precio no disponible';
  
  if (price === 0) return 'Gratis';
  
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(price);
};

/**
 * Formatea un número grande (para contadores, etc.)
 */
export const formatNumber = (number: number): string => {
  if (number === undefined || number === null) return '0';
  
  if (number < 1000) return number.toString();
  
  if (number < 1000000) {
    return `${(number / 1000).toFixed(1)}K`;
  }
  
  return `${(number / 1000000).toFixed(1)}M`;
}; 