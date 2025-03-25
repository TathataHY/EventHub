/**
 * Hooks compartidos para toda la aplicación
 */

export { useFormatDate } from './useFormatDate';
export { useInfiniteScroll } from './useInfiniteScroll';

// Ejemplo de hook básico
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // Implementación futura
  return {
    value: initialValue,
    setValue: (value: T) => {
      // Lógica de almacenamiento
    }
  };
}; 