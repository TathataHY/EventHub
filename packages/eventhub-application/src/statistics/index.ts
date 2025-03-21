// Re-exportamos las interfaces de dominio
export {
  StatisticsRepository,
  SystemStatistics,
  UserStatistics,
  OrganizerStatistics,
  EventStatistics,
  SalesStatistics,
  LocationStatistics,
  CategoryStatistics
} from '@eventhub/domain/src/statistics/repositories/StatisticsRepository';

// DTOs
export * from './dtos/StatisticsDTO';

// Queries
export * from './queries/GetSystemStatisticsQuery';
export * from './queries/GetUserStatisticsQuery';
export * from './queries/GetOrganizerStatisticsQuery';
export * from './queries/GetEventStatisticsQuery';
export * from './queries/GetSalesStatisticsQuery';

// Services
export * from './services/StatisticsService';

// ... existing code ... 