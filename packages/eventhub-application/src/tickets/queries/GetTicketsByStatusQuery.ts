import { Query } from '../../core/interfaces/Query';
import { TicketDTO } from '../dtos/TicketDTO';
import { TicketRepository } from '@eventhub/domain/dist/tickets/repositories/TicketRepository';
import { TicketMapper } from '../mappers/TicketMapper';

export class GetTicketsByStatusQuery implements Query<TicketDTO[]> {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly ticketMapper: TicketMapper,
    private readonly status: string
  ) {}

  async execute(): Promise<TicketDTO[]> {
    const tickets = await this.ticketRepository.findByStatus(this.status);
    return tickets.map(ticket => this.ticketMapper.toDTO(ticket));
  }
} 