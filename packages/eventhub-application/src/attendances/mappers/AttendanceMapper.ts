import { Attendance } from '@eventhub/domain/dist/attendances/entities/Attendance';
import { AttendanceDTO, AttendanceStatus, RegisterAttendanceDTO } from '../dtos/AttendanceDTO';

export class AttendanceMapper {
  /**
   * Convierte una entidad de dominio en un DTO
   */
  static toDTO(domain: Attendance): AttendanceDTO {
    return {
      id: domain.id,
      eventId: domain.eventId,
      userId: domain.userId,
      status: domain.status as AttendanceStatus,
      checkInTime: domain.checkInTime,
      checkOutTime: domain.checkOutTime,
      notes: domain.notes,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    };
  }

  /**
   * Convierte una lista de entidades de dominio en DTOs
   */
  static toDTOList(domains: Attendance[]): AttendanceDTO[] {
    return domains.map(domain => this.toDTO(domain));
  }

  /**
   * Convierte un DTO de registro en una entidad de dominio
   */
  static toDomain(dto: RegisterAttendanceDTO): Attendance {
    return {
      id: '', // El ID será generado por el repositorio
      eventId: dto.eventId,
      userId: dto.userId,
      status: AttendanceStatus.REGISTERED,
      notes: dto.notes,
      checkInTime: undefined,
      checkOutTime: undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
} 