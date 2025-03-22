import { Attendance } from '@eventhub/domain/dist/attendances/entities/Attendance';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { UpdateAttendanceDTO } from '../dtos/AttendanceDTO';
import { AttendanceRepository } from '@eventhub/domain/dist/attendances/repositories/AttendanceRepository';

interface UpdateAttendanceParams {
  id: string;
  data: UpdateAttendanceDTO;
}

export class UpdateAttendanceCommand implements Command<UpdateAttendanceParams, Attendance> {
  constructor(private readonly attendanceRepository: AttendanceRepository) {}

  /**
   * Ejecuta el comando para actualizar una asistencia
   */
  async execute(params: UpdateAttendanceParams): Promise<Attendance> {
    const { id, data } = params;

    // Validar los datos
    this.validateUpdateData(data);

    // Obtener la asistencia existente
    const attendance = await this.attendanceRepository.findById(id);
    if (!attendance) {
      throw new NotFoundException(`Asistencia con ID ${id} no encontrada`);
    }

    // Actualizar campos
    if (data.status !== undefined) {
      attendance.status = data.status;
    }

    if (data.notes !== undefined) {
      attendance.notes = data.notes;
    }

    attendance.updatedAt = new Date();

    // Guardar los cambios
    return this.attendanceRepository.save(attendance);
  }

  /**
   * Valida los datos de actualización
   */
  private validateUpdateData(data: UpdateAttendanceDTO): void {
    // Si se proporcionan notas, validar longitud
    if (data.notes && data.notes.length > 500) {
      throw new ValidationException('Las notas no pueden exceder los 500 caracteres');
    }
  }
} 