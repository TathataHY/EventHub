/**
 * Opciones para el envío de correos electrónicos
 */
export interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

/**
 * Interfaz para el servicio de correo electrónico
 */
export interface EmailService {
  /**
   * Envía un correo electrónico
   */
  sendEmail(options: EmailOptions): Promise<boolean>;

  /**
   * Envía un correo electrónico utilizando una plantilla
   */
  sendTemplateEmail(
    templateName: string,
    data: Record<string, any>,
    options: Omit<EmailOptions, 'text' | 'html'>
  ): Promise<boolean>;
} 