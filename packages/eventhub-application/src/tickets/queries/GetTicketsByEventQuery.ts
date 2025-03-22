import { Query } from '../../core/interfaces/Query';
import { TicketDTO } from '../dtos/TicketDTO';
import { TicketRepository } from '@eventhub/domain/dist/tickets/repositories/TicketRepository';
import { TicketMapper } from '../mappers/TicketMapper';
import { Event } from '@eventhub/domain/dist/events/entities/Event';

export class GetTicketsByEventQuery implements Query<TicketDTO[]> {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly ticketMapper: TicketMapper,
    private readonly eventId: string
  ) {}

  async execute(): Promise<TicketDTO[]> {
    const eventRef = { id: this.eventId } as Event;
    const tickets = await this.ticketRepository.findByEvent(eventRef);
    return tickets.map(ticket => this.ticketMapper.toDTO(ticket));
  }
} 