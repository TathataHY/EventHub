import { Attendance } from '@eventhub/domain/dist/attendances/entities/Attendance';
import { Command } from '../../core/interfaces/Command';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { RegisterAttendanceDTO } from '../dtos/AttendanceDTO';
import { AttendanceRepository } from '@eventhub/domain/dist/attendances/repositories/AttendanceRepository';
import { AttendanceMapper } from '../mappers/AttendanceMapper';

export class RegisterAttendanceCommand implements Command<RegisterAttendanceDTO, Attendance> {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  /**
   * Ejecuta el comando para registrar una asistencia
   */
  async execute(data: RegisterAttendanceDTO): Promise<Attendance> {
    this.validateAttendanceData(data);
    
    const isRegistered = await this.attendanceRepository.isRegistered(data.eventId, data.userId);
    if (isRegistered) {
      throw new ValidationException('El usuario ya está registrado en este evento');
    }

    const attendance = AttendanceMapper.toDomain(data);
    return this.attendanceRepository.save(attendance);
  }

  /**
   * Valida los datos de asistencia
   */
  private validateAttendanceData(data: RegisterAttendanceDTO): void {
    if (!data.eventId) {
      throw new ValidationException('El ID del evento es requerido');
    }

    if (!data.userId) {
      throw new ValidationException('El ID del usuario es requerido');
    }

    if (data.notes && data.notes.length > 500) {
      throw new ValidationException('Las notas no pueden exceder los 500 caracteres');
    }
  }
} 