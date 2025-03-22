import { Command } from '../../core/interfaces/Command';
import { ValidationException } from '../../core/exceptions/ValidationException';
import { AuthenticationException } from '../../core/exceptions/AuthenticationException';
import { UserRepository } from '@eventhub/domain/dist/users/repositories/UserRepository';
import { HashService } from '../services/HashService';
import { TokenService } from '../services/TokenService';

/**
 * Resultado de la autenticación
 */
export interface AuthenticationResult {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

/**
 * Comando para autenticar un usuario
 */
export class AuthenticateUserCommand implements Command<AuthenticationResult> {
  constructor(
    private readonly email: string,
    private readonly password: string,
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService
  ) {}

  /**
   * Ejecuta el comando para autenticar un usuario
   * @returns Promise<AuthenticationResult> Resultado de la autenticación
   * @throws ValidationException si hay problemas de validación
   * @throws AuthenticationException si las credenciales son inválidas
   */
  async execute(): Promise<AuthenticationResult> {
    // Validación básica
    if (!this.email || !this.email.trim()) {
      throw new ValidationException('El correo electrónico es requerido');
    }

    if (!this.password || !this.password.trim()) {
      throw new ValidationException('La contraseña es requerida');
    }

    // Validar formato de correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new ValidationException('Formato de correo electrónico inválido');
    }

    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(this.email.toLowerCase().trim());

    if (!user) {
      // Para seguridad, usar el mismo mensaje para usuario no encontrado
      throw new AuthenticationException('Credenciales inválidas');
    }

    // Verificar si la cuenta está deshabilitada
    if (user.disabled) {
      throw new AuthenticationException('La cuenta ha sido deshabilitada. Contacta al soporte.');
    }

    // Verificar contraseña
    const isPasswordValid = await this.hashService.compare(this.password, user.password);

    if (!isPasswordValid) {
      throw new AuthenticationException('Credenciales inválidas');
    }

    // Actualizar último inicio de sesión
    await this.userRepository.update({
      ...user,
      lastLoginAt: new Date()
    });

    // Generar tokens
    const accessToken = this.tokenService.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    const refreshToken = this.tokenService.generateRefreshToken({
      userId: user.id
    });

    // Retornar resultado
    return {
      userId: user.id,
      accessToken,
      refreshToken,
      expiresIn: this.tokenService.getAccessTokenExpiresIn(),
      tokenType: 'Bearer'
    };
  }
} 