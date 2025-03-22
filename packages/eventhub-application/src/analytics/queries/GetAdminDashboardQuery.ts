import { Query } from '../../core/interfaces/Query';
import { EventRepository } from '@eventhub/domain/dist/events/repositories/EventRepository';
import { UserRepository } from '@eventhub/domain/dist/users/repositories/UserRepository';
import { PaymentRepository } from '@eventhub/domain/dist/payments/repositories/PaymentRepository';

/**
 * Modelo del resultado del dashboard de administrador
 */
export interface AdminDashboardResult {
  usersCount: number;
  newUsersThisMonth: number;
  activeUsersThisMonth: number;
  eventsCount: number;
  newEventsThisMonth: number;
  upcomingEventsCount: number;
  totalRevenue: number;
  revenueThisMonth: number;
  currency: string;
  userGrowth: {
    month: string;
    count: number;
  }[];
  eventGrowth: {
    month: string;
    count: number;
  }[];
  revenueGrowth: {
    month: string;
    amount: number;
  }[];
  topOrganizers: {
    id: string;
    name: string;
    eventsCount: number;
    attendeesCount: number;
    revenue: number;
  }[];
  categoriesDistribution: {
    categoryId: string;
    name: string;
    eventsCount: number;
    attendeesCount: number;
  }[];
}

/**
 * Query para obtener el dashboard de administrador
 */
export class GetAdminDashboardQuery implements Query<AdminDashboardResult> {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly period: string = 'year',
    private readonly limit: number = 5
  ) {}

  /**
   * Ejecuta la consulta para obtener el dashboard del administrador
   * @returns Promise<AdminDashboardResult> Datos del dashboard del administrador
   */
  async execute(): Promise<AdminDashboardResult> {
    // Obtener datos necesarios
    const users = await this.userRepository.findAll();
    const events = await this.eventRepository.findAll();
    const allPayments = await this.getPaymentsForEvents(events.map(event => event.id));
    
    // Fecha actual y fecha de inicio del mes actual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Filtrar usuarios nuevos este mes
    const newUsersThisMonth = users.filter(user => 
      new Date(user.createdAt) >= startOfMonth
    ).length;
    
    // Calcular usuarios activos este mes (simplificado)
    // En un caso real se usaría algún registro de actividad de usuario
    const activeUsersThisMonth = users.filter(user => 
      user.lastLoginAt && new Date(user.lastLoginAt) >= startOfMonth
    ).length;
    
    // Filtrar eventos futuros
    const upcomingEvents = events.filter(event => 
      new Date(event.startDate) >= now
    );
    
    // Filtrar eventos nuevos este mes
    const newEventsThisMonth = events.filter(event => 
      new Date(event.createdAt) >= startOfMonth
    ).length;
    
    // Filtrar pagos completados
    const completedPayments = allPayments.filter(payment => payment.status === 'completed');
    
    // Calcular ingresos totales
    const totalRevenue = completedPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Calcular ingresos de este mes
    const revenueThisMonth = completedPayments
      .filter(payment => new Date(payment.createdAt) >= startOfMonth)
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    // Determinar la moneda (asumiendo que todos los pagos usan la misma moneda)
    const currency = completedPayments.length > 0 ? completedPayments[0].currency : 'EUR';
    
    // Calcular crecimiento de usuarios por mes
    const userGrowth = this.calculateUserGrowthByMonth(users);
    
    // Calcular crecimiento de eventos por mes
    const eventGrowth = this.calculateEventGrowthByMonth(events);
    
    // Calcular crecimiento de ingresos por mes
    const revenueGrowth = this.calculateRevenueGrowthByMonth(completedPayments);
    
    // Obtener los mejores organizadores
    const topOrganizers = this.getTopOrganizers(events, completedPayments);
    
    // Obtener distribución por categorías
    const categoriesDistribution = this.getCategoriesDistribution(events);

    return {
      usersCount: users.length,
      newUsersThisMonth,
      activeUsersThisMonth,
      eventsCount: events.length,
      newEventsThisMonth,
      upcomingEventsCount: upcomingEvents.length,
      totalRevenue,
      revenueThisMonth,
      currency,
      userGrowth,
      eventGrowth,
      revenueGrowth,
      topOrganizers,
      categoriesDistribution
    };
  }

  /**
   * Obtiene pagos para múltiples eventos
   */
  private async getPaymentsForEvents(eventIds: string[]): Promise<any[]> {
    // Implementación básica - en un caso real, el repositorio tendría un método para esto
    const paymentsPromises = eventIds.map(eventId => 
      this.paymentRepository.findByEventId(eventId)
    );
    
    const paymentsArrays = await Promise.all(paymentsPromises);
    return paymentsArrays.flat();
  }

  /**
   * Calcula el crecimiento de usuarios por mes
   */
  private calculateUserGrowthByMonth(users: any[]): { month: string; count: number }[] {
    const monthCounts = new Map<string, number>();
    
    users.forEach(user => {
      const date = new Date(user.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCounts.set(monthKey, (monthCounts.get(monthKey) || 0) + 1);
    });
    
    return Array.from(monthCounts.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  /**
   * Calcula el crecimiento de eventos por mes
   */
  private calculateEventGrowthByMonth(events: any[]): { month: string; count: number }[] {
    const monthCounts = new Map<string, number>();
    
    events.forEach(event => {
      const date = new Date(event.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCounts.set(monthKey, (monthCounts.get(monthKey) || 0) + 1);
    });
    
    return Array.from(monthCounts.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  /**
   * Calcula el crecimiento de ingresos por mes
   */
  private calculateRevenueGrowthByMonth(payments: any[]): { month: string; amount: number }[] {
    const monthlyRevenue = new Map<string, number>();
    
    payments.forEach(payment => {
      const date = new Date(payment.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenue.set(monthKey, (monthlyRevenue.get(monthKey) || 0) + payment.amount);
    });
    
    return Array.from(monthlyRevenue.entries())
      .map(([month, amount]) => ({ month, amount }))
      .sort((a, b) => a.month.localeCompare(b.month));
  }

  /**
   * Obtiene los mejores organizadores
   */
  private getTopOrganizers(events: any[], payments: any[]): {
    id: string;
    name: string;
    eventsCount: number;
    attendeesCount: number;
    revenue: number;
  }[] {
    // Agrupar eventos por organizador
    const eventsByOrganizer = events.reduce((acc, event) => {
      if (!acc[event.organizerId]) {
        acc[event.organizerId] = [];
      }
      acc[event.organizerId].push(event);
      return acc;
    }, {} as Record<string, any[]>);
    
    // Calcular métricas por organizador
    const organizerMetrics = Object.entries(eventsByOrganizer).map(([organizerId, organizerEvents]) => {
      const eventsCount = organizerEvents.length;
      
      // Calcular total de asistentes
      const attendeesCount = organizerEvents.reduce((sum, event) => 
        sum + (event.attendees?.length || 0), 0
      );
      
      // Obtener IDs de eventos de este organizador
      const eventIds = organizerEvents.map(event => event.id);
      
      // Filtrar pagos relacionados con eventos de este organizador
      const organizerPayments = payments.filter(payment => 
        eventIds.includes(payment.eventId) && payment.status === 'completed'
      );
      
      // Calcular ingresos totales
      const revenue = organizerPayments.reduce((sum, payment) => sum + payment.amount, 0);
      
      // Obtener nombre del organizador (del primer evento)
      const name = organizerEvents[0].organizerName || `Organizador ${organizerId}`;
      
      return { id: organizerId, name, eventsCount, attendeesCount, revenue };
    });
    
    // Ordenar organizadores por ingresos y limitar al número especificado
    return organizerMetrics
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, this.limit);
  }

  /**
   * Obtiene la distribución de eventos por categoría
   */
  private getCategoriesDistribution(events: any[]): {
    categoryId: string;
    name: string;
    eventsCount: number;
    attendeesCount: number;
  }[] {
    // Mapa para acumular datos por categoría
    const categoriesMap = new Map<string, {
      categoryId: string;
      name: string;
      eventsCount: number;
      attendeesCount: number;
    }>();
    
    // Procesar cada evento y sus categorías
    events.forEach(event => {
      if (event.categoryIds && Array.isArray(event.categoryIds)) {
        const attendeesCount = event.attendees?.length || 0;
        
        event.categoryIds.forEach((categoryId: string) => {
          const existingCategory = categoriesMap.get(categoryId);
          
          if (existingCategory) {
            existingCategory.eventsCount += 1;
            existingCategory.attendeesCount += attendeesCount;
          } else {
            // En un caso real, se obtendría el nombre de la categoría de un repositorio de categorías
            categoriesMap.set(categoryId, {
              categoryId,
              name: `Categoría ${categoryId}`, // Placeholder
              eventsCount: 1,
              attendeesCount
            });
          }
        });
      }
    });
    
    // Convertir el mapa a un array y ordenar por número de eventos
    return Array.from(categoriesMap.values())
      .sort((a, b) => b.eventsCount - a.eventsCount);
  }
} 