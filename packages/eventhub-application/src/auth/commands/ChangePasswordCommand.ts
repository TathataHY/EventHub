import { Command } from '../../core/interfaces/Command';
import { ValidationException, NotFoundException, UnauthorizedException } from '../../core/exceptions';
import { UserRepository } from '../../users/repositories/UserRepository';
import { HashService } from '../services/HashService';

/**
 * Comando para cambiar la contraseña de un usuario
 */
export class ChangePasswordCommand implements Command<boolean> {
  constructor(
    private readonly userId: string,
    private readonly currentPassword: string,
    private readonly newPassword: string,
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService
  ) {}

  /**
   * Ejecuta el comando para cambiar la contraseña
   * @returns Promise<boolean> Resultado de la operación
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si el usuario no existe
   * @throws UnauthorizedException si la contraseña actual es incorrecta
   */
  async execute(): Promise<boolean> {
    // Validación básica
    if (!this.userId) {
      throw new ValidationException('El ID de usuario es requerido');
    }

    if (!this.currentPassword) {
      throw new ValidationException('La contraseña actual es requerida');
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

    if (this.currentPassword === this.newPassword) {
      throw new ValidationException('La nueva contraseña debe ser diferente a la actual');
    }

    // Buscar usuario
    const user = await this.userRepository.findById(this.userId);
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Verificar si la cuenta está deshabilitada
    if (user.disabled) {
      throw new UnauthorizedException('La cuenta está deshabilitada');
    }

    // Verificar contraseña actual
    const isPasswordValid = await this.hashService.comparePasswords(
      this.currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('La contraseña actual es incorrecta');
    }

    // Hash de la nueva contraseña
    const hashedPassword = await this.hashService.hashPassword(this.newPassword);

    // Actualizar contraseña
    user.password = hashedPassword;
    user.updatedAt = new Date();

    // Guardar usuario actualizado
    await this.userRepository.save(user);

    return true;
  }
} 