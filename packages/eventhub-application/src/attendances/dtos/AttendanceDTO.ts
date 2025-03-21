/**
 * DTO para representar una asistencia
 */
export interface AttendanceDTO {
    id: string;
    eventId: string;
    userId: string;
    status: AttendanceStatus;
    checkInTime?: Date;
    checkOutTime?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  /**
   * Estados posibles de una asistencia
   */
  export enum AttendanceStatus {
    REGISTERED = 'REGISTERED',
    CHECKED_IN = 'CHECKED_IN',
    CHECKED_OUT = 'CHECKED_OUT',
    CANCELLED = 'CANCELLED'
  }
  
  /**
   * DTO para registrar una asistencia
   */
  export interface RegisterAttendanceDTO {
    eventId: string;
    userId: string;
    notes?: string;
  }
  
  /**
   * DTO para actualizar una asistencia
   */
  export interface UpdateAttendanceDTO {
    status?: AttendanceStatus;
    notes?: string;
  }
  
  /**
   * DTO para la respuesta de búsqueda de asistencias
   */
  export interface AttendanceSearchResultDTO {
    attendances: AttendanceDTO[];
    total: number;
    page: number;
    limit: number;
}