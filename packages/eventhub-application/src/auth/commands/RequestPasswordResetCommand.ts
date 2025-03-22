import { Command } from '../../core/interfaces/Command';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { UserRepository } from '@eventhub/domain/dist/users/repositories/UserRepository';
import { EmailService } from '../../core/services/EmailService';
import { TokenService } from '../services/TokenService';

/**
 * Comando para solicitar un restablecimiento de contraseña
 */
export class RequestPasswordResetCommand implements Command<boolean> {
  constructor(
    private readonly email: string,
    private readonly userRepository: UserRepository,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService
  ) {}

  /**
   * Ejecuta el comando para solicitar un restablecimiento de contraseña
   * @returns Promise<boolean> Resultado de la operación
   * @throws ValidationException si hay problemas de validación
   */
  async execute(): Promise<boolean> {
    // Validación básica
    if (!this.email || !this.email.trim()) {
      throw new ValidationException('El correo electrónico es requerido');
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new ValidationException('Formato de correo electrónico inválido');
    }

    // Normalizar email
    const normalizedEmail = this.email.toLowerCase().trim();

    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(normalizedEmail);

    // Si no se encuentra el usuario, no revelamos esta información por seguridad
    // pero retornamos true como si el proceso hubiera sido exitoso
    if (!user) {
      return true;
    }

    // Verificar si la cuenta está deshabilitada
    if (user.disabled) {
      // Por seguridad, no revelamos que la cuenta está deshabilitada
      return true;
    }

    // Generar token de restablecimiento
    const resetToken = this.tokenService.generatePasswordResetToken({
      userId: user.id,
      email: user.email
    });

    // Guardar token en el usuario
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 3600000); // 1 hora
    user.updatedAt = new Date();

    await this.userRepository.update(user);

    // Enviar correo con instrucciones
    try {
      await this.emailService.sendPasswordResetEmail(
        user.email,
        user.name || 'Usuario',
        resetToken
      );
    } catch (error) {
      console.error('Error al enviar correo de restablecimiento:', error);
      // No fallamos el proceso si el correo no se envía,
      // pero podríamos registrar esto para reintento
    }

    return true;
  }
} 