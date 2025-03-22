import { Query } from '../../core/interfaces/Query';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { AttendanceSearchResultDTO } from '../dtos/AttendanceDTO';
import { AttendanceRepository } from '@eventhub/domain/dist/attendances/repositories/AttendanceRepository';
import { AttendanceMapper } from '../mappers/AttendanceMapper';

interface SearchAttendancesParams {
  page: number;
  limit: number;
  eventId?: string;
  userId?: string;
}

export class SearchAttendancesQuery implements Query<SearchAttendancesParams, AttendanceSearchResultDTO> {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  async execute(params: SearchAttendancesParams): Promise<AttendanceSearchResultDTO> {
    const { page, limit, eventId, userId } = params;

    this.validateParams(params);

    const result = await this.attendanceRepository.findWithPagination(page, limit, eventId, userId);

    return {
      attendances: AttendanceMapper.toDTOList(result.attendances),
      total: result.total,
      page,
      limit
    };
  }

  private validateParams(params: SearchAttendancesParams): void {
    if (params.page <= 0) {
      throw new ValidationException('La página debe ser mayor a 0');
    }

    if (params.limit <= 0) {
      throw new ValidationException('El límite debe ser mayor a 0');
    }

    if (params.limit > 100) {
      throw new ValidationException('El límite no puede ser mayor a 100');
    }
  }
} 