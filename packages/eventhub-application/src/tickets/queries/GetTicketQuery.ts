import { Query } from '../../core/interfaces/Query';
import { TicketDTO } from '../dtos/TicketDTO';
import { TicketRepository } from '@eventhub/domain/dist/tickets/repositories/TicketRepository';
import { TicketMapper } from '../mappers/TicketMapper';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

export class GetTicketQuery implements Query<TicketDTO> {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly ticketMapper: TicketMapper,
    private readonly ticketId: string
  ) {}

  async execute(): Promise<TicketDTO> {
    const ticket = await this.ticketRepository.findById(this.ticketId);
    
    if (!ticket) {
      throw new NotFoundException(`Ticket con ID ${this.ticketId} no encontrado`);
    }
    
    return this.ticketMapper.toDTO(ticket);
  }
} 