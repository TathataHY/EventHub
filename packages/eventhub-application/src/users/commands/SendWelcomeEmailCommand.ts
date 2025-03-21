import { UserRepository } from '@eventhub/domain/dist/users/repositories/UserRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException, ExternalServiceException } from '../../core/exceptions';
import { EmailService } from '../../core/services/EmailService';

/**
 * Comando para enviar un email de bienvenida a un usuario
 */
export class SendWelcomeEmailCommand implements Command<boolean> {
  constructor(
    private readonly userId: string,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService
  ) {}

  /**
   * Ejecuta el comando para enviar el email de bienvenida
   * @returns Promise<boolean> Resultado del envío
   * @throws NotFoundException si el usuario no existe
   * @throws ExternalServiceException si hay problemas con el servicio de email
   */
  async execute(): Promise<boolean> {
    // Obtener el usuario
    const user = await this.userRepository.findById(this.userId);
    if (!user) {
      throw new NotFoundException('Usuario', this.userId);
    }

    try {
      // Preparar datos para la plantilla
      const templateData = {
        userName: user.name,
        platformName: 'EventHub',
        loginUrl: `${process.env.APP_URL || 'https://eventhub.com'}/login`,
        helpUrl: `${process.env.APP_URL || 'https://eventhub.com'}/help`,
        year: new Date().getFullYear()
      };

      // Enviar email usando el servicio
      const result = await this.emailService.sendTemplateEmail(
        'welcome',
        templateData,
        {
          to: user.email,
          subject: '¡Bienvenido a EventHub!'
        }
      );

      return result;
    } catch (error) {
      throw new ExternalServiceException('Email', error.message);
    }
  }
} 