import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

/**
 * Servicio para envío de emails
 */
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    // Configurar el transporter de nodemailer
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST'),
      port: this.configService.get<number>('EMAIL_PORT'),
      secure: this.configService.get<boolean>('EMAIL_SECURE'),
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASSWORD'),
      },
    });
  }

  /**
   * Envía un email de bienvenida
   * @param email Dirección de correo del destinatario
   * @param name Nombre del destinatario
   */
  async sendWelcome(email: string, name: string): Promise<void> {
    const appUrl = this.configService.get<string>('APP_URL');
    const appName = this.configService.get<string>('APP_NAME');
    
    await this.transporter.sendMail({
      from: `"${appName}" <${this.configService.get<string>('EMAIL_FROM')}>`,
      to: email,
      subject: `¡Bienvenido a ${appName}!`,
      html: `
        <h1>¡Hola ${name}!</h1>
        <p>Gracias por registrarte en ${appName}.</p>
        <p>Puedes comenzar a utilizar la plataforma ingresando a <a href="${appUrl}">${appUrl}</a>.</p>
        <p>Saludos,<br>El equipo de ${appName}</p>
      `
    });
  }

  /**
   * Envía un email para recuperación de contraseña
   * @param email Dirección de correo del destinatario
   * @param name Nombre del destinatario
   * @param token Token de recuperación
   */
  async sendPasswordReset(
    email: string,
    name: string,
    token: string
  ): Promise<void> {
    const appUrl = this.configService.get<string>('APP_URL');
    const appName = this.configService.get<string>('APP_NAME');
    const resetUrl = `${appUrl}/reset-password?token=${token}`;
    
    await this.transporter.sendMail({
      from: `"${appName}" <${this.configService.get<string>('EMAIL_FROM')}>`,
      to: email,
      subject: `Recuperación de contraseña - ${appName}`,
      html: `
        <h1>¡Hola ${name}!</h1>
        <p>Has solicitado recuperar tu contraseña en ${appName}.</p>
        <p>Para crear una nueva contraseña, haz clic en el siguiente enlace:</p>
        <p><a href="${resetUrl}">Recuperar contraseña</a></p>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste recuperar tu contraseña, puedes ignorar este correo.</p>
        <p>Saludos,<br>El equipo de ${appName}</p>
      `
    });
  }
} 