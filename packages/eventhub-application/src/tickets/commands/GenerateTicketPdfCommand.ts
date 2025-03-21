import { Command } from '../../core/interfaces/Command';
import { TicketRepositoryAdapter } from '../adapters/TicketRepositoryAdapter';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { EventRepositoryAdapter } from '../../events/adapters/EventRepositoryAdapter';

/**
 * Respuesta del comando de generación de PDF
 */
interface PdfResult {
  buffer: Buffer;
  filename: string;
}

/**
 * Comando para generar un PDF para un ticket
 */
export class GenerateTicketPdfCommand implements Command<string, PdfResult> {
  constructor(
    private ticketRepository: TicketRepositoryAdapter,
    private eventRepository: EventRepositoryAdapter,
    private ticketId?: string
  ) {}

  /**
   * Ejecuta el comando para generar un PDF del ticket
   * @param ticketId ID del ticket, opcional si se proporcionó en el constructor
   * @returns Buffer con el PDF generado y nombre de archivo sugerido
   */
  async execute(ticketId?: string): Promise<PdfResult> {
    const targetTicketId = ticketId || this.ticketId;
    
    if (!targetTicketId) {
      throw new Error('Se requiere un ID de ticket para generar el PDF');
    }
    
    // Obtener el ticket
    const ticket = await this.ticketRepository.findById(targetTicketId);
    
    if (!ticket) {
      throw new ValidationException('El ticket no existe');
    }
    
    // Obtener información del evento
    const event = await this.eventRepository.findById(ticket.eventId);
    
    if (!event) {
      throw new ValidationException('El evento asociado al ticket no existe');
    }
    
    // Aquí se implementaría la lógica para generar el PDF
    // Esto podría implicar usar una biblioteca como PDFKit, jsPDF, etc.
    
    // En este ejemplo, simplemente simulamos la generación de un PDF
    const pdfBuffer = this.generatePdf(ticket, event);
    
    return {
      buffer: pdfBuffer,
      filename: `ticket_${ticket.code}.pdf`
    };
  }
  
  /**
   * Simula la generación de un PDF con los datos del ticket y evento
   * En una implementación real, se usaría una biblioteca para generar el PDF
   */
  private generatePdf(ticket: any, event: any): Buffer {
    // Simulación - aquí se implementaría la generación real del PDF
    const content = `
      TICKET: ${ticket.code}
      EVENTO: ${event.name}
      FECHA: ${new Date(event.startDate).toLocaleDateString()}
      HORA: ${new Date(event.startDate).toLocaleTimeString()}
      LUGAR: ${event.location || 'Por definir'}
      TIPO: ${ticket.type}
      SECCIÓN: ${ticket.section || 'General'}
      ASIENTO: ${ticket.seat || 'No asignado'}
      PRECIO: ${ticket.price} ${ticket.currency}
    `;
    
    // Simular un PDF como un buffer
    return Buffer.from(content);
  }
} 