import { Command } from '../../core/interfaces/Command';
import { ValidationException, ConflictException } from '../../core/exceptions';
import { UserRepository } from '../../users/repositories/UserRepository';
import { HashService } from '../services/HashService';
import { EmailService } from '../../notifications/services/EmailService';

/**
 * Resultado del registro de usuario
 */
export interface RegistrationResult {
  userId: string;
  email: string;
  verificationToken?: string;
  requiresVerification: boolean;
}

/**
 * Comando para registrar un nuevo usuario
 */
export class RegisterUserCommand implements Command<RegistrationResult> {
  constructor(
    private readonly email: string,
    private readonly password: string,
    private readonly name: string,
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly emailService: EmailService,
    private readonly requireEmailVerification: boolean = true
  ) {}

  /**
   * Ejecuta el comando para registrar un nuevo usuario
   * @returns Promise<RegistrationResult> Resultado del registro
   * @throws ValidationException si hay problemas de validación
   * @throws ConflictException si el correo ya está registrado
   */
  async execute(): Promise<RegistrationResult> {
    // Validación básica
    if (!this.email || !this.email.trim()) {
      throw new ValidationException('El correo electrónico es requerido');
    }

    if (!this.password || !this.password.trim()) {
      throw new ValidationException('La contraseña es requerida');
    }

    if (!this.name || !this.name.trim()) {
      throw new ValidationException('El nombre es requerido');
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new ValidationException('Formato de correo electrónico inválido');
    }

    // Validar complejidad de contraseña
    if (this.password.length < 8) {
      throw new ValidationException('La contraseña debe tener al menos 8 caracteres');
    }

    // Verificar que el correo no esté registrado
    const existingUser = await this.userRepository.findByEmail(this.email.toLowerCase().trim());
    if (existingUser) {
      throw new ConflictException('Este correo electrónico ya está registrado');
    }

    // Generar hash de la contraseña
    const hashedPassword = await this.hashService.hash(this.password);

    // Generar token de verificación si es requerido
    let verificationToken = undefined;
    if (this.requireEmailVerification) {
      verificationToken = this.generateVerificationToken();
    }

    // Crear usuario
    const newUser = {
      email: this.email.toLowerCase().trim(),
      password: hashedPassword,
      name: this.name.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
      verificationToken,
      isVerified: !this.requireEmailVerification,
      role: 'user' // Rol predeterminado
    };

    // Guardar usuario
    const userId = await this.userRepository.create(newUser);

    // Enviar correo de verificación si es requerido
    if (this.requireEmailVerification && verificationToken) {
      try {
        await this.emailService.sendVerificationEmail(newUser.email, newUser.name, verificationToken);
      } catch (error) {
        console.error('Error al enviar correo de verificación:', error);
        // No fallamos el registro si el correo no se envía,
        // pero podríamos registrar esto para reintento
      }
    }

    // Retornar resultado
    return {
      userId,
      email: newUser.email,
      verificationToken,
      requiresVerification: this.requireEmailVerification
    };
  }

  /**
   * Genera un token de verificación
   */
  private generateVerificationToken(): string {
    // Generar un token aleatorio de 32 caracteres (se podría mejorar usando una librería especializada)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }
} 