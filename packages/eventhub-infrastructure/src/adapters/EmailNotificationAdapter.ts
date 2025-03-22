import { injectable } from 'inversify';
import nodemailer, { Transporter } from 'nodemailer';
import { Notification } from '../../../eventhub-domain/src/entities/Notification';
import { NotificationChannel } from '../../../eventhub-domain/src/value-objects/NotificationChannel';
import { INotificationChannelAdapter } from '../../../eventhub-application/src/adapters/INotificationChannelAdapter';
import { IUserRepository } from '../../../eventhub-domain/src/repositories/IUserRepository';

/**
 * Adaptador para enviar notificaciones por correo electrónico
 */
@injectable()
export class EmailNotificationAdapter implements INotificationChannelAdapter {
  private transporter: Transporter | null = null;
  private fromEmail: string = '';
  private fromName: string = '';
  private isInitialized: boolean = false;
  
  constructor(
    private userRepository: IUserRepository
  ) {}
  
  /**
   * Inicializa el adaptador con la configuración SMTP
   * @param config Configuración del servidor SMTP
   */
  initialize(config: EmailAdapterConfig): void {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure || false,
      auth: {
        user: config.username,
        pass: config.password
      }
    });
    
    this.fromEmail = config.fromEmail;
    this.fromName = config.fromName || 'EventHub';
    this.isInitialized = true;
  }
  
  /**
   * Verifica si el adaptador está configurado correctamente
   * @returns true si está configurado
   */
  isConfigured(): boolean {
    return this.isInitialized && !!this.transporter;
  }
  
  /**
   * Envía una notificación por correo electrónico
   * @param notification Notificación a enviar
   */
  async send(notification: Notification): Promise<void> {
    if (!this.isConfigured()) {
      throw new Error('El adaptador de correo electrónico no está configurado');
    }
    
    if (notification.channel !== NotificationChannel.EMAIL) {
      throw new Error(`Canal incorrecto: esperado ${NotificationChannel.EMAIL}, recibido ${notification.channel}`);
    }
    
    // Obtener el usuario destinatario para conseguir su email
    const user = await this.userRepository.findById(notification.userId);
    if (!user || !user.email) {
      throw new Error(`No se pudo encontrar el email del usuario ${notification.userId}`);
    }
    
    // Comprobar si hay contenido HTML
    const html = notification.html || this.convertToHtml(notification.message);
    
    // Enviar el correo
    try {
      await this.transporter!.sendMail({
        from: `"${this.fromName}" <${this.fromEmail}>`,
        to: user.email,
        subject: notification.title,
        text: notification.message,
        html: html
      });
    } catch (error) {
      throw new Error(`Error al enviar el correo: ${(error as Error).message}`);
    }
  }
  
  /**
   * Convierte un mensaje de texto plano a HTML básico
   * @param message Mensaje en texto plano
   * @returns Mensaje en formato HTML
   */
  private convertToHtml(message: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ddd;
              border-radius: 5px;
            }
            .footer {
              margin-top: 30px;
              font-size: 12px;
              color: #999;
              text-align: center;
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${message.replace(/\n/g, '<br>')}
            <div class="footer">
              <p>Este es un mensaje automático, por favor no responda a este correo.</p>
              <p>&copy; ${new Date().getFullYear()} EventHub. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

/**
 * Configuración para el adaptador de correo electrónico
 */
export interface EmailAdapterConfig {
  host: string;
  port: number;
  secure?: boolean;
  username: string;
  password: string;
  fromEmail: string;
  fromName?: string;
} 