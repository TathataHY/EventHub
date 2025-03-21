import { Command } from '../../core/interfaces/Command';
import { TicketRepository } from '@eventhub/domain/dist/tickets/repositories/TicketRepository';
import { CreateTicketDTO } from '../dtos/CreateTicketDTO';
import { Ticket } from '@eventhub/domain/dist/tickets/entities/Ticket';
import { TicketDTO } from '../dtos/TicketDTO';
import { TicketMapper } from '../mappers/TicketMapper';
import { ValidationException } from '../../core/exceptions/ValidationException';

export class CreateTicketCommand implements Command<TicketDTO> {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly ticketMapper: TicketMapper,
    private readonly ticketData: CreateTicketDTO
  ) {}

  async execute(): Promise<TicketDTO> {
    this.validateTicketData();
    const ticket = this.ticketMapper.toDomain(this.ticketData);
    await this.ticketRepository.save(ticket);
    return this.ticketMapper.toDTO(ticket);
  }

  private validateTicketData(): void {
    if (!this.ticketData.eventId) {
      throw new ValidationException('El ID del evento es requerido');
    }

    if (!this.ticketData.type) {
      throw new ValidationException('El tipo de ticket es requerido');
    }

    if (!this.ticketData.description) {
      throw new ValidationException('La descripción del ticket es requerida');
    }

    if (!this.ticketData.price) {
      throw new ValidationException('El precio es requerido');
    }

    // Validar que el precio es un string válido con formato correcto (xx.xx EUR)
    const pricePattern = /^\d+(\.\d{1,2})?\s[A-Z]{3}$/;
    if (!pricePattern.test(this.ticketData.price)) {
      throw new ValidationException('El formato del precio es inválido. Debe ser "XX.XX CUR" (ej: "10.50 EUR")');
    }

    if (this.ticketData.quantity <= 0) {
      throw new ValidationException('La cantidad debe ser mayor que 0');
    }
  }
} 