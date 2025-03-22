/**
 * DTO para representar información de ingresos
 */
export interface RevenueDTO {
  /**
   * Total de ingresos en el período
   */
  total: number;
  
  /**
   * Moneda de los ingresos
   */
  currency: string;
  
  /**
   * Período de tiempo del reporte (diario, semanal, mensual, anual, total)
   */
  period?: string;
  
  /**
   * Fecha de inicio del período
   */
  startDate?: Date;
  
  /**
   * Fecha de fin del período
   */
  endDate?: Date;
  
  /**
   * Número total de transacciones
   */
  transactionCount?: number;
  
  /**
   * Monto promedio por transacción
   */
  averageAmount?: number;
  
  /**
   * Ingresos por segmento de tiempo (día, semana, mes)
   */
  revenueByTimeSegment?: Record<string, number>;
} 