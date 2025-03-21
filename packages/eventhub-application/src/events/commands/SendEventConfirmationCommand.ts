import { EventRepository } from '../repositories/EventRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException, ExternalServiceException } from '../../core/exceptions';
import { EmailService } from '../../core/services/EmailService';
import { UserRepository } from '../../users/repositories/UserRepository';

/**
 * Comando para enviar confirmación de evento por email
 */
export class SendEventConfirmationCommand implements Command<boolean> {
  constructor(
    private readonly eventId: string,
    private readonly userId: string,
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService
  ) {}

  /**
   * Ejecuta el comando para enviar la confirmación del evento
   * @returns Promise<boolean> Resultado del envío
   * @throws NotFoundException si el evento o usuario no existen
   * @throws ExternalServiceException si hay problemas con el servicio de email
   */
  async execute(): Promise<boolean> {
    // Obtener el evento
    const event = await this.eventRepository.findById(this.eventId);
    if (!event) {
      throw new NotFoundException('Evento', this.eventId);
    }

    // Obtener el usuario
    const user = await this.userRepository.findById(this.userId);
    if (!user) {
      throw new NotFoundException('Usuario', this.userId);
    }

    try {
      // Verificar que el usuario es un asistente del evento
      const isAttendee = event.attendees?.some(attendee => attendee.id === this.userId);
      if (!isAttendee) {
        throw new NotFoundException('Asistente', `Usuario ${this.userId} no es asistente del evento ${this.eventId}`);
      }

      // Preparar datos para la plantilla
      const templateData = {
        userName: user.name,
        eventTitle: event.title,
        eventDescription: event.description,
        eventLocation: event.location,
        eventDate: new Date(event.startDate).toLocaleDateString('es-ES', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        eventTime: new Date(event.startDate).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        eventEndTime: event.endDate ? new Date(event.endDate).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        }) : null,
        eventImageUrl: event.imageUrl,
        eventUrl: `${process.env.APP_URL || 'https://eventhub.com'}/events/${event.id}`,
        organizerName: event.organizerName,
        year: new Date().getFullYear()
      };

      // Enviar email usando el servicio
      const result = await this.emailService.sendTemplateEmail(
        'event-confirmation',
        templateData,
        {
          to: user.email,
          subject: `¡Confirmación para ${event.title}!`
        }
      );

      return result;
    } catch (error) {
      throw new ExternalServiceException('Email', error.message);
    }
  }
} 