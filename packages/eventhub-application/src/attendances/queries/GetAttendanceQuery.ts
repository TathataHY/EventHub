import { Query } from '../../core/interfaces/Query';
import { NotFoundException } from '../../core/exceptions/NotFoundException';
import { AttendanceDTO } from '../dtos/AttendanceDTO';
import { AttendanceRepository } from '@eventhub/domain/dist/attendances/repositories/AttendanceRepository';
import { AttendanceMapper } from '../mappers/AttendanceMapper';

export class GetAttendanceQuery implements Query<string, AttendanceDTO> {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  /**
   * Ejecuta la consulta para obtener una asistencia por ID
   */
  async execute(id: string): Promise<AttendanceDTO> {
    if (!id) {
      throw new Error('El ID de la asistencia es requerido');
    }

    const attendance = await this.attendanceRepository.findById(id);
    if (!attendance) {
      throw new NotFoundException(`Asistencia con ID ${id} no encontrada`);
    }

    return AttendanceMapper.toDTO(attendance);
  }
} 