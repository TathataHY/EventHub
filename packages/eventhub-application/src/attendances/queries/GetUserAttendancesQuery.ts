import { Query } from '../../core/interfaces/Query';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { AttendanceDTO } from '../dtos/AttendanceDTO';
import { AttendanceRepository } from '@eventhub/domain/dist/attendances/repositories/AttendanceRepository';
import { AttendanceMapper } from '../mappers/AttendanceMapper';

export class GetUserAttendancesQuery implements Query<string, AttendanceDTO[]> {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  /**
   * Ejecuta la consulta para obtener las asistencias de un usuario
   */
  async execute(userId: string): Promise<AttendanceDTO[]> {
    if (!userId) {
      throw new ValidationException('El ID del usuario es requerido');
    }

    const attendances = await this.attendanceRepository.findByUserId(userId);
    return AttendanceMapper.toDTOList(attendances);
  }
} 