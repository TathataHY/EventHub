import { 
  SystemStatisticsDTO, 
  UserStatisticsDTO, 
  OrganizerStatisticsDTO, 
  EventStatisticsDTO, 
  SalesStatisticsDTO, 
  LocationStatisticsDTO, 
  CategoryStatisticsDTO 
} from '../dtos/StatisticsDTO';
import { GetSystemStatisticsQuery } from '../queries/GetSystemStatisticsQuery';
import { GetUserStatisticsQuery } from '../queries/GetUserStatisticsQuery';
import { GetOrganizerStatisticsQuery } from '../queries/GetOrganizerStatisticsQuery';
import { GetEventStatisticsQuery } from '../queries/GetEventStatisticsQuery';
import { GetSalesStatisticsQuery } from '../queries/GetSalesStatisticsQuery';
import { GetLocationStatisticsQuery } from '../queries/GetLocationStatisticsQuery';
import { GetCategoryStatisticsQuery } from '../queries/GetCategoryStatisticsQuery';
import { StatisticsRepository } from '@eventhub/domain/dist/statistics/repositories/StatisticsRepository';

export class StatisticsService {
  private readonly getSystemStatisticsQuery: GetSystemStatisticsQuery;
  private readonly getUserStatisticsQuery: GetUserStatisticsQuery;
  private readonly getOrganizerStatisticsQuery: GetOrganizerStatisticsQuery;
  private readonly getEventStatisticsQuery: GetEventStatisticsQuery;
  private readonly getSalesStatisticsQuery: GetSalesStatisticsQuery;
  private readonly getLocationStatisticsQuery: GetLocationStatisticsQuery;
  private readonly getCategoryStatisticsQuery: GetCategoryStatisticsQuery;

  constructor(private readonly statisticsRepository: StatisticsRepository) {
    this.getSystemStatisticsQuery = new GetSystemStatisticsQuery(statisticsRepository);
    this.getUserStatisticsQuery = new GetUserStatisticsQuery(statisticsRepository);
    this.getOrganizerStatisticsQuery = new GetOrganizerStatisticsQuery(statisticsRepository);
    this.getEventStatisticsQuery = new GetEventStatisticsQuery(statisticsRepository);
    this.getSalesStatisticsQuery = new GetSalesStatisticsQuery(statisticsRepository);
    this.getLocationStatisticsQuery = new GetLocationStatisticsQuery(statisticsRepository);
    this.getCategoryStatisticsQuery = new GetCategoryStatisticsQuery(statisticsRepository);
  }

  /**
   * Obtiene las estadísticas generales del sistema
   */
  async getSystemStatistics(): Promise<SystemStatisticsDTO> {
    return this.getSystemStatisticsQuery.execute();
  }

  /**
   * Obtiene las estadísticas de un usuario específico
   */
  async getUserStatistics(userId: string): Promise<UserStatisticsDTO> {
    return this.getUserStatisticsQuery.execute(userId);
  }

  /**
   * Obtiene las estadísticas de un organizador específico
   */
  async getOrganizerStatistics(organizerId: string): Promise<OrganizerStatisticsDTO> {
    return this.getOrganizerStatisticsQuery.execute(organizerId);
  }

  /**
   * Obtiene las estadísticas de un evento específico
   */
  async getEventStatistics(eventId: string): Promise<EventStatisticsDTO> {
    return this.getEventStatisticsQuery.execute(eventId);
  }

  /**
   * Obtiene las estadísticas de ventas por período
   */
  async getSalesStatistics(period: string, startDate?: Date, endDate?: Date): Promise<SalesStatisticsDTO> {
    return this.getSalesStatisticsQuery.execute({ period, startDate, endDate });
  }

  /**
   * Obtiene las estadísticas de ubicaciones
   */
  async getLocationStatistics(limit?: number): Promise<LocationStatisticsDTO> {
    return this.getLocationStatisticsQuery.execute(limit);
  }

  /**
   * Obtiene las estadísticas de categorías
   */
  async getCategoryStatistics(limit?: number): Promise<CategoryStatisticsDTO> {
    return this.getCategoryStatisticsQuery.execute(limit);
  }
} 