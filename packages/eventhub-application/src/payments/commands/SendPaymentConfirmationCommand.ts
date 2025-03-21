import { Command } from '../../core/interfaces/Command';
import { NotFoundException, ExternalServiceException } from '../../core/exceptions';
import { EmailService } from '../../core/services/EmailService';
import { PaymentRepositoryAdapter } from '../adapters/PaymentRepositoryAdapter';
import { UserRepositoryAdapter } from '../../users/adapters/UserRepositoryAdapter';

/**
 * Comando para enviar una confirmación de pago por email
 */
export class SendPaymentConfirmationCommand implements Command<boolean> {
  constructor(
    private readonly paymentId: string,
    private readonly paymentRepository: PaymentRepositoryAdapter,
    private readonly eventRepository: any, // EventRepositoryAdapter
    private readonly userRepository: UserRepositoryAdapter,
    private readonly emailService: EmailService
  ) {}

  /**
   * Ejecuta el comando para enviar la confirmación de pago
   * @returns Promise<boolean> Resultado del envío
   * @throws NotFoundException si el pago, evento o usuario no existen
   * @throws ExternalServiceException si hay problemas con el servicio de email
   */
  async execute(): Promise<boolean> {
    // Obtener el pago
    const payment = await this.paymentRepository.findById(this.paymentId);
    if (!payment) {
      throw new NotFoundException('Pago', this.paymentId);
    }

    // Obtener el evento relacionado
    const event = await this.eventRepository.findById(payment.eventId);
    if (!event) {
      throw new NotFoundException('Evento', payment.eventId);
    }

    // Obtener el usuario que realizó el pago
    const user = await this.userRepository.findUserById(payment.userId);
    if (!user) {
      throw new NotFoundException('Usuario', payment.userId);
    }

    try {
      // Formatear precio para mostrar
      const formattedAmount = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: payment.currency
      }).format(payment.amount);

      // Preparar datos para la plantilla
      const templateData = {
        userName: user.name,
        eventTitle: event.title,
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
        paymentId: payment.id,
        paymentAmount: formattedAmount,
        paymentDate: new Date(payment.updatedAt || payment.createdAt).toLocaleDateString('es-ES'),
        invoiceUrl: `${process.env.APP_URL || 'https://eventhub.com'}/invoices/${payment.id}`,
        year: new Date().getFullYear()
      };

      // Enviar email usando el servicio
      const result = await this.emailService.sendTemplateEmail(
        'payment-confirmation',
        templateData,
        {
          to: user.email,
          subject: `Confirmación de pago para ${event.title}`
        }
      );

      // Registrar el envío en los metadatos del pago
      const updatedPayment = {
        ...payment,
        metadata: {
          ...payment.metadata,
          confirmationEmailSent: new Date().toISOString()
        }
      };
      
      await this.paymentRepository.save(updatedPayment);

      return result;
    } catch (error) {
      throw new ExternalServiceException('Email', error.message);
    }
  }
} 