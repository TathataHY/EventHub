import { AttendanceDTO, RegisterAttendanceDTO, UpdateAttendanceDTO, AttendanceSearchResultDTO } from '../dtos/AttendanceDTO';
import { RegisterAttendanceCommand } from '../commands/RegisterAttendanceCommand';
import { UpdateAttendanceCommand } from '../commands/UpdateAttendanceCommand';
import { CheckInCommand } from '../commands/CheckInCommand';
import { CheckOutCommand } from '../commands/CheckOutCommand';
import { CancelAttendanceCommand } from '../commands/CancelAttendanceCommand';
import { GetAttendanceQuery } from '../queries/GetAttendanceQuery';
import { GetEventAttendancesQuery } from '../queries/GetEventAttendancesQuery';
import { GetUserAttendancesQuery } from '../queries/GetUserAttendancesQuery';
import { SearchAttendancesQuery } from '../queries/SearchAttendancesQuery';
import { AttendanceRepository } from '@eventhub/domain/dist/attendances/repositories/AttendanceRepository';
import { AttendanceMapper } from '../mappers/AttendanceMapper';

export class AttendanceService {
  private readonly registerAttendanceCommand: RegisterAttendanceCommand;
  private readonly updateAttendanceCommand: UpdateAttendanceCommand;
  private readonly checkInCommand: CheckInCommand;
  private readonly checkOutCommand: CheckOutCommand;
  private readonly cancelAttendanceCommand: CancelAttendanceCommand;
  private readonly getAttendanceQuery: GetAttendanceQuery;
  private readonly getEventAttendancesQuery: GetEventAttendancesQuery;
  private readonly getUserAttendancesQuery: GetUserAttendancesQuery;
  private readonly searchAttendancesQuery: SearchAttendancesQuery;

  constructor(private readonly attendanceRepository: AttendanceRepository) {
    this.registerAttendanceCommand = new RegisterAttendanceCommand(attendanceRepository);
    this.updateAttendanceCommand = new UpdateAttendanceCommand(attendanceRepository);
    this.checkInCommand = new CheckInCommand(attendanceRepository);
    this.checkOutCommand = new CheckOutCommand(attendanceRepository);
    this.cancelAttendanceCommand = new CancelAttendanceCommand(attendanceRepository);
    this.getAttendanceQuery = new GetAttendanceQuery(attendanceRepository);
    this.getEventAttendancesQuery = new GetEventAttendancesQuery(attendanceRepository);
    this.getUserAttendancesQuery = new GetUserAttendancesQuery(attendanceRepository);
    this.searchAttendancesQuery = new SearchAttendancesQuery(attendanceRepository);
  }

  /**
   * Registra una nueva asistencia
   */
  async registerAttendance(data: RegisterAttendanceDTO): Promise<AttendanceDTO> {
    const attendance = await this.registerAttendanceCommand.execute(data);
    return AttendanceMapper.toDTO(attendance);
  }

  /**
   * Actualiza una asistencia existente
   */
  async updateAttendance(id: string, data: UpdateAttendanceDTO): Promise<AttendanceDTO> {
    const attendance = await this.updateAttendanceCommand.execute({ id, data });
    return AttendanceMapper.toDTO(attendance);
  }

  /**
   * Registra el check-in de un usuario
   */
  async checkIn(eventId: string, userId: string): Promise<void> {
    await this.checkInCommand.execute({ eventId, userId });
  }

  /**
   * Registra el check-out de un usuario
   */
  async checkOut(eventId: string, userId: string): Promise<void> {
    await this.checkOutCommand.execute({ eventId, userId });
  }

  /**
   * Cancela una asistencia
   */
  async cancelAttendance(eventId: string, userId: string): Promise<void> {
    await this.cancelAttendanceCommand.execute({ eventId, userId });
  }

  /**
   * Obtiene una asistencia por ID
   */
  async getAttendance(id: string): Promise<AttendanceDTO> {
    return this.getAttendanceQuery.execute(id);
  }

  /**
   * Obtiene las asistencias de un evento
   */
  async getEventAttendances(eventId: string): Promise<AttendanceDTO[]> {
    return this.getEventAttendancesQuery.execute(eventId);
  }

  /**
   * Obtiene las asistencias de un usuario
   */
  async getUserAttendances(userId: string): Promise<AttendanceDTO[]> {
    return this.getUserAttendancesQuery.execute(userId);
  }

  /**
   * Busca asistencias
   */
  async searchAttendances(page: number, limit: number, eventId?: string, userId?: string): Promise<AttendanceSearchResultDTO> {
    return this.searchAttendancesQuery.execute({ page, limit, eventId, userId });
  }
} 