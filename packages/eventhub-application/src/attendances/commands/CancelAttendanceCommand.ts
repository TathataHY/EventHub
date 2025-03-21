import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { AttendanceStatus } from '../dtos/AttendanceDTO';
import { AttendanceRepository } from '@eventhub/domain/dist/attendances/repositories/AttendanceRepository';

interface CancelAttendanceParams {
  eventId: string;
  userId: string;
}

export class CancelAttendanceCommand implements Command<CancelAttendanceParams, void> {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  /**
   * Ejecuta el comando para cancelar una asistencia
   */
  async execute(params: CancelAttendanceParams): Promise<void> {
    const { eventId, userId } = params;

    this.validateParams(params);

    // Verificar si el usuario está registrado para el evento
    const isRegistered = await this.attendanceRepository.isRegistered(eventId, userId);
    if (!isRegistered) {
      throw new NotFoundException('El usuario no está registrado para este evento');
    }

    // Verificar estado actual de la asistencia
    const currentStatus = await this.attendanceRepository.getAttendanceStatus(eventId, userId);
    
    if (currentStatus === AttendanceStatus.CANCELLED) {
      throw new ValidationException('La asistencia ya ha sido cancelada');
    }

    // Cancelar la asistencia
    await this.attendanceRepository.cancelAttendance(eventId, userId);
  }

  private validateParams(params: CancelAttendanceParams): void {
    if (!params.eventId) {
      throw new ValidationException('El ID del evento es requerido');
    }

    if (!params.userId) {
      throw new ValidationException('El ID del usuario es requerido');
    }
  }
} 