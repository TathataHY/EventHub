import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { EmailService, EmailOptions } from 'eventhub-application';

@Injectable()
export class NodemailerService implements EmailService {
  private transporter: nodemailer.Transporter;
  private defaultFrom: string;
  private templatesDir: string;
  private templates: Map<string, HandlebarsTemplateDelegate> = new Map();

  constructor(private configService: ConfigService) {
    // Configuración del servicio de correo
    this.defaultFrom = this.configService.get<string>('EMAIL_FROM', 'EventHub <noreply@eventhub.com>');
    this.templatesDir = this.configService.get<string>('EMAIL_TEMPLATES_DIR', path.join(process.cwd(), 'templates/email'));

    // Cargar y compilar plantillas
    this.loadTemplates();

    // Crear el transporter de nodemailer
    const mailConfig = {
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT', 587),
      secure: this.configService.get<string>('EMAIL_SECURE', 'false') === 'true',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    };

    // Comprobar si tenemos configuración SMTP válida
    if (!mailConfig.host || !mailConfig.auth.user) {
      console.warn('Configuración de correo incompleta. Se utilizará SMTP ethereal para pruebas.');
      // Crear cuenta de prueba de Ethereal (para desarrollo)
      this.createTestAccount();
    } else {
      this.transporter = nodemailer.createTransport(mailConfig);
    }
  }

  /**
   * Envía un correo electrónico
   * @param options Opciones del correo
   * @returns Promise que indica si se envió correctamente
   */
  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      // Asegurarse de que el transporter está configurado
      if (!this.transporter) {
        await this.createTestAccount();
      }

      // Configurar opciones del correo
      const mailOptions: nodemailer.SendMailOptions = {
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
        cc: options.cc,
        bcc: options.bcc,
        attachments: options.attachments,
        replyTo: options.replyTo,
      };

      // Enviar el correo
      const result = await this.transporter.sendMail(mailOptions);
      
      // Si es una cuenta de prueba, mostrar la URL para ver el correo
      if (result.ethereal) {
        console.log('URL de vista previa del correo (Ethereal): %s', nodemailer.getTestMessageUrl(result));
      }

      return true;
    } catch (error) {
      console.error('Error al enviar correo:', error);
      return false;
    }
  }

  /**
   * Envía un correo electrónico basado en una plantilla
   * @param templateId Identificador de la plantilla
   * @param to Destinatario(s)
   * @param data Datos para la plantilla
   * @param options Opciones adicionales
   * @returns Promise que indica si se envió correctamente
   */
  async sendTemplateEmail(
    templateId: string,
    to: string | string[],
    data: Record<string, any>,
    options?: Partial<EmailOptions>
  ): Promise<boolean> {
    try {
      // Obtener la plantilla compilada
      const template = this.templates.get(templateId);
      
      if (!template) {
        console.error(`Plantilla no encontrada: ${templateId}`);
        return false;
      }

      // Renderizar la plantilla con los datos
      const html = template(data);

      // Enviar el correo con la plantilla renderizada
      return await this.sendEmail({
        to,
        subject: options?.subject || `EventHub - ${this.getDefaultSubject(templateId)}`,
        html,
        ...options
      });
    } catch (error) {
      console.error(`Error al enviar correo con plantilla ${templateId}:`, error);
      return false;
    }
  }

  /**
   * Crea una cuenta de prueba en Ethereal para desarrollo
   */
  private async createTestAccount(): Promise<void> {
    try {
      // Crear cuenta de prueba
      const testAccount = await nodemailer.createTestAccount();
      
      // Crear transporter con la cuenta de prueba
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      console.log('Cuenta de prueba de correo configurada (Ethereal):', testAccount.user);
    } catch (error) {
      console.error('Error al crear cuenta de prueba:', error);
    }
  }

  /**
   * Carga y compila las plantillas de correo
   */
  private loadTemplates(): void {
    try {
      // Verificar si existe el directorio de plantillas
      if (!fs.existsSync(this.templatesDir)) {
        console.warn(`El directorio de plantillas no existe: ${this.templatesDir}`);
        this.createDefaultTemplates();
        return;
      }

      // Leer archivos de plantillas
      const files = fs.readdirSync(this.templatesDir);
      
      // Compilar cada plantilla
      for (const file of files) {
        if (file.endsWith('.hbs')) {
          const templateId = file.replace('.hbs', '');
          const templatePath = path.join(this.templatesDir, file);
          const templateContent = fs.readFileSync(templatePath, 'utf-8');
          const compiledTemplate = Handlebars.compile(templateContent);
          
          this.templates.set(templateId, compiledTemplate);
        }
      }

      console.log(`${this.templates.size} plantillas de correo cargadas.`);
    } catch (error) {
      console.error('Error al cargar plantillas:', error);
    }
  }

  /**
   * Crea plantillas por defecto si no existen
   */
  private createDefaultTemplates(): void {
    // Crear directorio de plantillas si no existe
    if (!fs.existsSync(this.templatesDir)) {
      fs.mkdirSync(this.templatesDir, { recursive: true });
    }

    // Definir plantillas predeterminadas
    const defaultTemplates = {
      'welcome': `
        <h1>Bienvenido a EventHub, {{name}}!</h1>
        <p>Gracias por registrarte en nuestra plataforma. Ahora puedes comenzar a explorar y crear eventos.</p>
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        <p>Saludos,<br>El equipo de EventHub</p>
      `,
      'event_confirmation': `
        <h1>¡Registro Confirmado!</h1>
        <p>Hola {{name}},</p>
        <p>Tu registro para el evento <strong>{{eventTitle}}</strong> ha sido confirmado.</p>
        <p><strong>Fecha:</strong> {{eventDate}}</p>
        <p><strong>Lugar:</strong> {{eventLocation}}</p>
        <p>Tu ticket estará disponible en tu cuenta de EventHub.</p>
        <p>¡Esperamos verte pronto!</p>
      `,
      'payment_confirmation': `
        <h1>Pago Confirmado</h1>
        <p>Hola {{name}},</p>
        <p>Tu pago por <strong>{{amount}} {{currency}}</strong> ha sido procesado correctamente.</p>
        <p><strong>Evento:</strong> {{eventTitle}}</p>
        <p><strong>Referencia de pago:</strong> {{paymentReference}}</p>
        <p>Puedes ver los detalles completos en tu cuenta de EventHub.</p>
        <p>Gracias por tu compra.</p>
      `,
      'event_reminder': `
        <h1>Recordatorio de Evento</h1>
        <p>Hola {{name}},</p>
        <p>Te recordamos que el evento <strong>{{eventTitle}}</strong> está próximo.</p>
        <p><strong>Fecha:</strong> {{eventDate}}</p>
        <p><strong>Lugar:</strong> {{eventLocation}}</p>
        <p>No olvides llevar tu ticket o ID para el acceso.</p>
        <p>¡Nos vemos allí!</p>
      `,
      'event_canceled': `
        <h1>Evento Cancelado</h1>
        <p>Hola {{name}},</p>
        <p>Lamentamos informarte que el evento <strong>{{eventTitle}}</strong> ha sido cancelado.</p>
        <p>Si realizaste algún pago, recibirás un reembolso en los próximos días.</p>
        <p>Disculpa las molestias ocasionadas.</p>
      `
    };

    // Guardar plantillas en el sistema de archivos
    for (const [id, content] of Object.entries(defaultTemplates)) {
      const filePath = path.join(this.templatesDir, `${id}.hbs`);
      fs.writeFileSync(filePath, content.trim());
      
      // Compilar y almacenar la plantilla
      const compiledTemplate = Handlebars.compile(content);
      this.templates.set(id, compiledTemplate);
    }

    console.log(`${Object.keys(defaultTemplates).length} plantillas predeterminadas creadas.`);
  }

  /**
   * Obtiene un asunto predeterminado según el tipo de plantilla
   * @param templateId ID de la plantilla
   * @returns Asunto predeterminado
   */
  private getDefaultSubject(templateId: string): string {
    const subjects = {
      'welcome': 'Bienvenido a EventHub',
      'event_confirmation': 'Confirmación de Evento',
      'payment_confirmation': 'Pago Confirmado',
      'event_reminder': 'Recordatorio de Evento',
      'event_canceled': 'Evento Cancelado',
    };

    return subjects[templateId] || 'Notificación de EventHub';
  }
} 