import { Command } from '../../core/interfaces/Command';
import { TicketRepository } from '@eventhub/domain/dist/tickets/repositories/TicketRepository';
import { NotFoundException } from '../../core/exceptions/NotFoundException';
import { TicketRepositoryAdapter } from '../adapters/TicketRepositoryAdapter';

export class DeleteTicketCommand implements Command {
  private readonly ticketAdapter: TicketRepositoryAdapter;

  constructor(
    ticketRepository: TicketRepository,
    private readonly ticketId: string
  ) {
    this.ticketAdapter = new TicketRepositoryAdapter(ticketRepository);
  }

  async execute(): Promise<void> {
    const ticket = await this.ticketAdapter.findTicketById(this.ticketId);
    if (!ticket) {
      throw new NotFoundException(`Ticket con ID ${this.ticketId} no encontrado`);
    }

    await this.ticketAdapter.deleteTicket(this.ticketId);
  }
} 