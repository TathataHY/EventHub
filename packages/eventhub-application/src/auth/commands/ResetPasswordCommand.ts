import { Command } from '../../core/interfaces/Command';
import { ValidationException, NotFoundException } from '../../core/exceptions';
import { UserRepository } from '../../users/repositories/UserRepository';
import { TokenService } from '../services/TokenService';
import { HashService } from '../services/HashService';

/**
 * Comando para restablecer la contraseña de un usuario
 */
export class ResetPasswordCommand implements Command<boolean> {
  constructor(
    private readonly token: string,
    private readonly newPassword: string,
    private readonly userRepository: UserRepository,
    private readonly tokenService: TokenService,
    private readonly hashService: HashService
  ) {}

  /**
   * Ejecuta el comando para restablecer la contraseña
   * @returns Promise<boolean> Resultado de la operación
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el token o usuario no existen
   */
  async execute(): Promise<boolean> {
    // Validación básica
    if (!this.token || !this.token.trim()) {
      throw new ValidationException('El token de restablecimiento es requerido');
    }

    if (!this.newPassword || this.newPassword.length < 8) {
      throw new ValidationException('La nueva contraseña debe tener al menos 8 caracteres');
    }

    // Verificar requisitos adicionales de seguridad
    if (!/[A-Z]/.test(this.newPassword)) {
      throw new ValidationException('La contraseña debe contener al menos una letra mayúscula');
    }

    if (!/[a-z]/.test(this.newPassword)) {
      throw new ValidationException('La contraseña debe contener al menos una letra minúscula');
    }

    if (!/[0-9]/.test(this.newPassword)) {
      throw new ValidationException('La contraseña debe contener al menos un número');
    }

    // Verificar token
    try {
      const payload = this.tokenService.verifyPasswordResetToken(this.token);
      
      if (!payload || !payload.userId) {
        throw new ValidationException('Token de restablecimiento inválido');
      }

      // Buscar usuario
      const user = await this.userRepository.findById(payload.userId);
      
      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      // Verificar que el token sea el mismo que está guardado
      if (user.passwordResetToken !== this.token) {
        throw new ValidationException('Token de restablecimiento inválido o expirado');
      }

      // Verificar que el token no haya expirado
      if (!user.passwordResetExpires || user.passwordResetExpires < new Date()) {
        throw new ValidationException('El token de restablecimiento ha expirado');
      }

      // Hash de la nueva contraseña
      const hashedPassword = await this.hashService.hashPassword(this.newPassword);

      // Actualizar contraseña y limpiar token
      user.password = hashedPassword;
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      user.updatedAt = new Date();

      // Guardar usuario actualizado
      await this.userRepository.update(user);

      return true;
    } catch (error) {
      if (error instanceof ValidationException || error instanceof NotFoundException) {
        throw error;
      }
      throw new ValidationException('Error al restablecer la contraseña: ' + error.message);
    }
  }
} 