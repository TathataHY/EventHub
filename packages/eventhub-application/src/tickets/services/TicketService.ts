import { CreateTicketDTO } from '../dtos/CreateTicketDTO';
import { UpdateTicketDTO } from '../dtos/UpdateTicketDTO';
import { TicketDTO } from '../dtos/TicketDTO';
import { CreateTicketCommand } from '../commands/CreateTicketCommand';
import { UpdateTicketCommand } from '../commands/UpdateTicketCommand';
import { DeleteTicketCommand } from '../commands/DeleteTicketCommand';
import { GetTicketQuery } from '../queries/GetTicketQuery';
import { GetTicketsByEventQuery } from '../queries/GetTicketsByEventQuery';
import { GetTicketsByStatusQuery } from '../queries/GetTicketsByStatusQuery';
import { GetTicketsByTypeQuery } from '../queries/GetTicketsByTypeQuery';
import { TicketRepository } from '@eventhub/domain/dist/tickets/repositories/TicketRepository';
import { TicketMapper } from '../mappers/TicketMapper';

export class TicketService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly ticketMapper: TicketMapper
  ) {}

  async createTicket(ticketData: CreateTicketDTO): Promise<void> {
    const command = new CreateTicketCommand(
      this.ticketRepository,
      this.ticketMapper,
      ticketData
    );
    await command.execute();
  }

  async updateTicket(ticketId: string, ticketData: UpdateTicketDTO): Promise<void> {
    const command = new UpdateTicketCommand(
      this.ticketRepository,
      this.ticketMapper,
      ticketId,
      ticketData
    );
    await command.execute();
  }

  async deleteTicket(ticketId: string): Promise<void> {
    const command = new DeleteTicketCommand(
      this.ticketRepository,
      ticketId
    );
    await command.execute();
  }

  async getTicket(ticketId: string): Promise<TicketDTO> {
    const query = new GetTicketQuery(
      this.ticketRepository,
      this.ticketMapper,
      ticketId
    );
    return await query.execute();
  }

  async getTicketsByEvent(eventId: string): Promise<TicketDTO[]> {
    const query = new GetTicketsByEventQuery(
      this.ticketRepository,
      this.ticketMapper,
      eventId
    );
    return await query.execute();
  }

  async getTicketsByStatus(status: string): Promise<TicketDTO[]> {
    const query = new GetTicketsByStatusQuery(
      this.ticketRepository,
      this.ticketMapper,
      status
    );
    return await query.execute();
  }

  async getTicketsByType(type: string): Promise<TicketDTO[]> {
    const query = new GetTicketsByTypeQuery(
      this.ticketRepository,
      this.ticketMapper,
      type
    );
    return await query.execute();
  }
} 