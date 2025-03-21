import { Command } from '../../core/interfaces/Command';
import { TicketRepositoryAdapter } from '../adapters/TicketRepositoryAdapter';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { EmailService } from '../../core/services/EmailService';
import { UserRepositoryAdapter } from '../../users/adapters/UserRepositoryAdapter';
import { EventRepositoryAdapter } from '../../events/adapters/EventRepositoryAdapter';
import { GenerateTicketPdfCommand } from './GenerateTicketPdfCommand';

/**
 * Parámetros para enviar un ticket por email
 */
interface SendTicketParams {
  ticketId: string;
  email?: string;  // Email opcional (si no se proporciona, se usa el del usuario)
}

/**
 * Comando para enviar un ticket por email
 */
export class SendTicketByEmailCommand implements Command<SendTicketParams, boolean> {
  constructor(
    private ticketRepository: TicketRepositoryAdapter,
    private userRepository: UserRepositoryAdapter,
    private eventRepository: EventRepositoryAdapter,
    private emailService: EmailService,
    private pdfGenerator: GenerateTicketPdfCommand,
    private ticketId?: string,
    private email?: string
  ) {}

  /**
   * Ejecuta el comando para enviar el ticket por email
   * @param params Parámetros con el ID del ticket y email opcional
   * @returns true si el email se envió correctamente
   */
  async execute(params?: SendTicketParams): Promise<boolean> {
    const ticketId = params?.ticketId || this.ticketId;
    const overrideEmail = params?.email || this.email;
    
    if (!ticketId) {
      throw new Error('Se requiere un ID de ticket para enviarlo por email');
    }
    
    // Obtener el ticket
    const ticket = await this.ticketRepository.findById(ticketId);
    
    if (!ticket) {
      throw new ValidationException('El ticket no existe');
    }
    
    // Obtener información del evento
    const event = await this.eventRepository.findById(ticket.eventId);
    
    if (!event) {
      throw new ValidationException('El evento asociado al ticket no existe');
    }
    
    // Obtener información del usuario para enviar el email
    const user = await this.userRepository.findById(ticket.userId);
    
    if (!user && !overrideEmail) {
      throw new ValidationException('No se encontró un usuario válido para enviar el ticket');
    }
    
    // Determinar el email de destino
    const emailTo = overrideEmail || user.email;
    
    if (!emailTo) {
      throw new ValidationException('No se proporcionó un email válido para enviar el ticket');
    }
    
    // Generar el PDF del ticket
    const pdfResult = await this.pdfGenerator.execute(ticketId);
    
    // Preparar y enviar el email
    try {
      await this.emailService.send({
        to: emailTo,
        subject: `Tu entrada para ${event.name}`,
        text: `Adjunto encontrarás tu entrada para el evento ${event.name} que se realizará el ${new Date(event.startDate).toLocaleDateString()}.`,
        html: `
          <h1>Tu entrada para ${event.name}</h1>
          <p>¡Gracias por tu compra!</p>
          <p>Adjunto encontrarás tu entrada para el evento que se realizará el ${new Date(event.startDate).toLocaleDateString()}.</p>
          <p>Recuerda presentar este ticket impreso o en tu dispositivo móvil para ingresar al evento.</p>
          <p>Código de ticket: <strong>${ticket.code}</strong></p>
        `,
        attachments: [
          {
            filename: pdfResult.filename,
            content: pdfResult.buffer
          }
        ]
      });
      
      return true;
    } catch (error) {
      console.error('Error al enviar el ticket por email:', error);
      throw new Error('No se pudo enviar el ticket por email');
    }
  }
} 