import { Command } from '../../core/interfaces/Command';
import { UpdateTicketDTO } from '../dtos/UpdateTicketDTO';
import { TicketMapper } from '../mappers/TicketMapper';
import { TicketRepository } from '@eventhub/domain/dist/tickets/repositories/TicketRepository';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

export class UpdateTicketCommand implements Command {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly ticketMapper: TicketMapper,
    private readonly ticketId: string,
    private readonly ticketData: UpdateTicketDTO
  ) {}

  async execute(): Promise<void> {
    // Buscar el ticket existente
    const existingTicket = await this.ticketRepository.findById(this.ticketId);
    if (!existingTicket) {
      throw new NotFoundException(`Ticket con ID ${this.ticketId} no encontrado`);
    }

    // Validar datos de actualización
    this.validateTicketData();

    // Crear objeto de dominio actualizado
    const ticket = this.ticketMapper.toDomain({
      ...this.ticketMapper.toDTO(existingTicket),
      ...this.ticketData
    });

    // Guardar en repositorio
    await this.ticketRepository.save(ticket);
  }

  private validateTicketData(): void {
    // Solo validamos los campos que están presentes en la actualización

    if (this.ticketData.price !== undefined) {
      // Validar que el precio es un string válido con formato correcto (xx.xx EUR)
      const pricePattern = /^\d+(\.\d{1,2})?\s[A-Z]{3}$/;
      if (!pricePattern.test(this.ticketData.price)) {
        throw new ValidationException('El formato del precio es inválido. Debe ser "XX.XX CUR" (ej: "10.50 EUR")');
      }
    }

    if (this.ticketData.quantity !== undefined && this.ticketData.quantity <= 0) {
      throw new ValidationException('La cantidad debe ser mayor que 0');
    }

    if (this.ticketData.description !== undefined && this.ticketData.description.trim() === '') {
      throw new ValidationException('La descripción no puede estar vacía');
    }

    if (this.ticketData.type !== undefined && this.ticketData.type.trim() === '') {
      throw new ValidationException('El tipo de ticket no puede estar vacío');
    }
  }
} 