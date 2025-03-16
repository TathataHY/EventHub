/**
 * Excepción lanzada cuando ocurre un error al gestionar la asistencia a un evento
 */
export class EventAttendanceException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'EventAttendanceException';

    // Necesario para que instanceof funcione correctamente en TypeScript
    Object.setPrototypeOf(this, EventAttendanceException.prototype);
  }
} 