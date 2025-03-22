/**
 * DTO para la distribución estadística de puntuaciones de reseñas
 * 
 * Representa la distribución de las puntuaciones de las reseñas
 * para un evento específico, útil para análisis y visualizaciones.
 */
export interface ReviewDistributionDTO {
  /** Total de reseñas */
  total: number;
  
  /** Puntuación promedio */
  average: number;
  
  /** Distribución por cada puntuación posible */
  distribution: {
    /** Número de reseñas con puntuación 1 */
    '1': number;
    /** Número de reseñas con puntuación 2 */
    '2': number;
    /** Número de reseñas con puntuación 3 */
    '3': number;
    /** Número de reseñas con puntuación 4 */
    '4': number;
    /** Número de reseñas con puntuación 5 */
    '5': number;
  };
} 