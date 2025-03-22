import { Attendance } from '@eventhub/domain/dist/attendances/entities/Attendance';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { AttendanceStatus } from '../dtos/AttendanceDTO';
import { AttendanceRepository } from '@eventhub/domain/dist/attendances/repositories/AttendanceRepository';

interface CheckOutParams {
  eventId: string;
  userId: string;
}

export class CheckOutCommand implements Command<CheckOutParams, Attendance> {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  async execute(params: CheckOutParams): Promise<Attendance> {
    const { eventId, userId } = params;

    this.validateParams(params);

    // Verificar si el usuario está registrado para el evento
    const isRegistered = await this.attendanceRepository.isRegistered(eventId, userId);
    if (!isRegistered) {
      throw new NotFoundException('El usuario no está registrado para este evento');
    }

    // Verificar estado actual de la asistencia
    const currentStatus = await this.attendanceRepository.getAttendanceStatus(eventId, userId);
    
    if (currentStatus !== AttendanceStatus.CHECKED_IN) {
      throw new ValidationException('No se puede realizar check-out sin haber hecho check-in primero');
    }

    // Realizar el check-out
    await this.attendanceRepository.checkOut(eventId, userId);
    
    // Obtener la asistencia actualizada
    const attendances = await this.attendanceRepository.findByEventId(eventId);
    const attendance = attendances.find(a => a.userId === userId);
    
    if (!attendance) {
      throw new NotFoundException('No se pudo encontrar la asistencia después del check-out');
    }
    
    return attendance;
  }

  private validateParams(params: CheckOutParams): void {
    if (!params.eventId) {
      throw new ValidationException('El ID del evento es requerido');
    }

    if (!params.userId) {
      throw new ValidationException('El ID del usuario es requerido');
    }
  }
} 