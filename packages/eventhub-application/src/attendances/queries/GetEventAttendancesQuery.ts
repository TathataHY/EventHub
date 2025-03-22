import { Query } from '../../core/interfaces/Query';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { AttendanceDTO } from '../dtos/AttendanceDTO';
import { AttendanceRepository } from '@eventhub/domain/dist/attendances/repositories/AttendanceRepository';
import { AttendanceMapper } from '../mappers/AttendanceMapper';

export class GetEventAttendancesQuery implements Query<string, AttendanceDTO[]> {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  /**
   * Ejecuta la consulta para obtener las asistencias de un evento
   */
  async execute(eventId: string): Promise<AttendanceDTO[]> {
    if (!eventId) {
      throw new ValidationException('El ID del evento es requerido');
    }

    const attendances = await this.attendanceRepository.findByEventId(eventId);
    return AttendanceMapper.toDTOList(attendances);
  }
} 