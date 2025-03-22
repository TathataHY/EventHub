import { Query } from '../../core/interfaces/Query';
import { TicketRepositoryAdapter } from '../adapters/TicketRepositoryAdapter';
import { TicketMapper } from '../mappers/TicketMapper';
import { TicketDTO } from '../dtos/TicketDTO';

/**
 * Consulta para obtener todos los tickets comprados por un usuario
 */
export class GetTicketsByUserQuery implements Query<string, TicketDTO[]> {
  constructor(
    private ticketRepository: TicketRepositoryAdapter,
    private ticketMapper: TicketMapper,
    private userId?: string
  ) {}

  /**
   * Ejecuta la consulta para obtener tickets de un usuario
   * @param userId ID del usuario, opcional si se proporcionó en el constructor
   * @returns Lista de tickets del usuario
   */
  async execute(userId?: string): Promise<TicketDTO[]> {
    const targetUserId = userId || this.userId;
    
    if (!targetUserId) {
      throw new Error('Se requiere un ID de usuario para obtener sus tickets');
    }
    
    // Obtener tickets del usuario
    const tickets = await this.ticketRepository.findByUser(targetUserId);
    
    // Si no se encontraron tickets, devolver lista vacía
    if (!tickets || tickets.length === 0) {
      return [];
    }
    
    // Convertir a DTOs y devolver
    return tickets.map(ticket => this.ticketMapper.toDTO(ticket));
  }
} 