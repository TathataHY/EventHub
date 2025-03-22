/**
 * Estadísticas generales del sistema
 * 
 * Encapsula métricas globales del sistema como número de usuarios,
 * eventos, transacciones y actividad del sistema.
 */
export interface SystemStatistics {
  /** Total de usuarios registrados */
  totalUsers: number;
  /** Usuarios nuevos en el último periodo */
  newUsers: number;
  /** Total de eventos */
  totalEvents: number;
  /** Eventos nuevos en el último periodo */
  newEvents: number;
  /** Total de transacciones */
  totalTransactions: number;
  /** Valor total de las transacciones */
  totalTransactionValue: number;
  /** Usuarios activos en el último periodo */
  activeUsers: number;
  /** Tasa de conversión (registros a compras) */
  conversionRate: number;
  /** Actividad por período (día/semana/mes) */
  activityByPeriod: Array<{ period: string; count: number }>;
}

/**
 * Estadísticas de usuario específico
 * 
 * Contiene métricas de actividad y participación de un usuario
 * en la plataforma, útil para perfiles y análisis personalizados.
 */
export interface UserStatistics {
  /** Total de eventos asistidos */
  eventsAttended: number;
  /** Total de reseñas publicadas */
  reviewsPosted: number;
  /** Compras realizadas */
  purchases: number;
  /** Valor total de compras */
  totalSpent: number;
  /** Categorías favoritas basadas en asistencia */
  favoriteCategories: Array<{ category: string; count: number }>;
  /** Historial de actividad */
  activityHistory: Array<{ date: string; type: string; eventId?: string }>;
}

/**
 * Estadísticas de organizador
 * 
 * Encapsula métricas relevantes para organizadores de eventos,
 * incluyendo rendimiento de ventas y satisfacción de asistentes.
 */
export interface OrganizerStatistics {
  /** Total de eventos creados */
  totalEvents: number;
  /** Eventos activos actualmente */
  activeEvents: number;
  /** Total de asistentes a todos los eventos */
  totalAttendees: number;
  /** Ingresos totales generados */
  totalRevenue: number;
  /** Calificación promedio de los eventos */
  averageRating: number;
  /** Eventos por categoría */
  eventsByCategory: Array<{ category: string; count: number }>;
  /** Rendimiento de ventas por período */
  salesPerformance: Array<{ period: string; revenue: number; tickets: number }>;
}

/**
 * Estadísticas de un evento específico
 * 
 * Contiene métricas detalladas sobre un evento, incluyendo
 * ventas, asistencia y satisfacción de los participantes.
 */
export interface EventStatistics {
  /** Total de entradas disponibles */
  totalTickets: number;
  /** Entradas vendidas */
  ticketsSold: number;
  /** Porcentaje de entradas vendidas */
  occupancyRate: number;
  /** Ingresos generados */
  revenue: number;
  /** Calificación promedio del evento */
  averageRating: number;
  /** Distribución de calificaciones (1-5) */
  ratingDistribution: { [key: string]: number };
  /** Datos demográficos de asistentes */
  attendeeDemographics: any;
  /** Ventas por día hasta el evento */
  salesByDay: Array<{ date: string; tickets: number; revenue: number }>;
}

/**
 * Estadísticas de ventas
 * 
 * Proporciona métricas financieras y de transacciones
 * para análisis de rendimiento y tendencias de ventas.
 */
export interface SalesStatistics {
  /** Total de transacciones en el período */
  totalTransactions: number;
  /** Ingreso total en el período */
  totalRevenue: number;
  /** Precio promedio de ticket */
  averageTicketPrice: number;
  /** Valor promedio de transacción */
  averageTransactionValue: number;
  /** Ventas por categoría de evento */
  salesByCategory: Array<{ category: string; revenue: number; tickets: number }>;
  /** Tendencia de ventas por período (día/semana/mes) */
  salesTrend: Array<{ period: string; revenue: number; transactions: number }>;
  /** Método de pago más utilizado */
  topPaymentMethod: string;
}

/**
 * Estadísticas de ubicaciones
 * 
 * Analiza la distribución geográfica de eventos y asistentes,
 * útil para expansión y estrategias de marketing regional.
 */
export interface LocationStatistics {
  /** Ciudades con más eventos */
  topCities: Array<{ city: string; country: string; eventCount: number }>;
  /** Países con más eventos */
  topCountries: Array<{ country: string; eventCount: number }>;
  /** Ciudades con más asistentes */
  mostAttendeeCities: Array<{ city: string; country: string; attendeeCount: number }>;
  /** Tasa de eventos virtuales vs presenciales */
  virtualVsInPerson: { virtual: number; inPerson: number };
}

/**
 * Estadísticas de categorías de eventos
 * 
 * Proporciona análisis de popularidad y rendimiento
 * de las diferentes categorías de eventos en la plataforma.
 */
export interface CategoryStatistics {
  /** Categorías más populares por número de eventos */
  topCategories: Array<{ category: string; eventCount: number }>;
  /** Categorías con más asistentes */
  categoriesByAttendance: Array<{ category: string; attendeeCount: number }>;
  /** Categorías con mayor ingreso */
  categoriesByRevenue: Array<{ category: string; revenue: number }>;
  /** Precio promedio por categoría */
  averagePriceByCategory: Array<{ category: string; averagePrice: number }>;
  /** Categorías con mejor calificación */
  topRatedCategories: Array<{ category: string; averageRating: number }>;
}

/**
 * Repositorio de estadísticas del sistema
 * 
 * Define métodos para recuperar diferentes tipos de estadísticas
 * desde los repositorios de datos subyacentes, procesando y agregando
 * información de diversas fuentes para generar métricas útiles.
 * 
 * Este repositorio es fundamental para las funcionalidades de análisis,
 * dashboards y reportes de la plataforma, proporcionando insights
 * valiosos sobre el rendimiento del sistema y el comportamiento de los usuarios.
 */
export interface StatisticsRepository {
  /**
   * Obtiene estadísticas generales del sistema
   * 
   * Proporciona una visión global del estado y rendimiento de la plataforma,
   * incluyendo usuarios, eventos, transacciones y actividad.
   * 
   * @returns Estadísticas generales del sistema
   */
  getSystemStatistics(): Promise<SystemStatistics>;

  /**
   * Obtiene estadísticas específicas de un usuario
   * 
   * Recupera métricas personalizadas de actividad y participación
   * de un usuario específico en la plataforma.
   * 
   * @param userId ID del usuario a analizar
   * @returns Estadísticas personalizadas del usuario
   */
  getUserStatistics(userId: string): Promise<UserStatistics>;

  /**
   * Obtiene estadísticas de un organizador de eventos
   * 
   * Proporciona métricas de rendimiento para organizadores,
   * incluyendo eventos, ventas y satisfacción de clientes.
   * 
   * @param organizerId ID del organizador a analizar
   * @returns Estadísticas del organizador
   */
  getOrganizerStatistics(organizerId: string): Promise<OrganizerStatistics>;

  /**
   * Obtiene estadísticas detalladas de un evento específico
   * 
   * Analiza el rendimiento, ventas y satisfacción de un evento particular,
   * útil para organizadores y reportes post-evento.
   * 
   * @param eventId ID del evento a analizar
   * @returns Estadísticas completas del evento
   */
  getEventStatistics(eventId: string): Promise<EventStatistics>;

  /**
   * Obtiene estadísticas de ventas para un período
   * 
   * Proporciona análisis financiero y de transacciones filtrado
   * por período de tiempo, para análisis de tendencias.
   * 
   * @param period Período a analizar ('day', 'week', 'month', 'year')
   * @param startDate Fecha inicial del período (opcional)
   * @param endDate Fecha final del período (opcional)
   * @returns Estadísticas de ventas para el período
   */
  getSalesStatistics(period: string, startDate?: Date, endDate?: Date): Promise<SalesStatistics>;

  /**
   * Obtiene estadísticas geográficas
   * 
   * Analiza la distribución de eventos y asistentes por ubicaciones,
   * útil para estrategias de expansión y marketing regional.
   * 
   * @param limit Número máximo de ubicaciones a incluir
   * @returns Estadísticas de distribución geográfica
   */
  getLocationStatistics(limit?: number): Promise<LocationStatistics>;

  /**
   * Obtiene estadísticas de categorías de eventos
   * 
   * Proporciona análisis de popularidad y rendimiento de las
   * diferentes categorías de eventos en la plataforma.
   * 
   * @param limit Número máximo de categorías a incluir
   * @returns Estadísticas de categorías
   */
  getCategoryStatistics(limit?: number): Promise<CategoryStatistics>;
} 