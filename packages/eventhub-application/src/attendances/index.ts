// Re-exporting domain entities and interfaces
import { 
  EventAttendeeRepository,
  EventAttendeeFilters,
  PaginationOptions
} from '@eventhub/domain/dist/attendances/repositories/EventAttendeeRepository';

// DTOs
export * from './dtos/AttendanceDTO';
export * from './dtos/AttendeeStatsDTO';

// Commands
export * from './commands/RegisterAttendanceCommand';
export * from './commands/CancelAttendanceCommand';
export * from './commands/CheckInAttendanceCommand';
export * from './commands/CheckOutAttendanceCommand';

// Queries
export * from './queries/GetAttendanceByUserAndEventQuery';
export * from './queries/GetAttendancesQuery';
export * from './queries/GetCheckInsQuery';
export * from './queries/GetAttendanceStatsQuery';

// Mappers
export * from './mappers/AttendanceMapper';

// Services
export * from './services/AttendanceService';

// Re-export from domain
export { 
  EventAttendeeRepository,
  EventAttendeeFilters,
  PaginationOptions
}; 