import { Injectable } from '@nestjs/common';
import { UserRepository } from 'eventhub-domain';
import { LoginDto } from '../../dtos/auth/LoginDto';

/**
 * Servicio para manejo de contraseñas
 */
interface PasswordService {
  compare(plainPassword: string, hashedPassword: string): Promise<boolean>;
}

/**
 * Servicio para manejo de JWT
 */
interface JwtService {
  generateToken(payload: {
    id: string;
    name: string;
    email: string;
    role: string;
  }): string;
}

/**
 * Caso de uso para iniciar sesión
 */
@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Ejecuta el caso de uso de login
   * @param loginDto DTO con credenciales de login
   * @returns Token JWT y datos básicos del usuario si el login es exitoso
   */
  async execute(loginDto: LoginDto): Promise<{
    access_token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  }> {
    // Buscar usuario por email
    const user = await this.userRepository.findByEmail(loginDto.email);
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }
    
    // Verificar contraseña
    const passwordMatches = await this.passwordService.compare(
      loginDto.password,
      user.password
    );
    
    if (!passwordMatches) {
      throw new Error('Credenciales inválidas');
    }
    
    // Verificar que el usuario esté activo
    if (!user.isActive) {
      throw new Error('Cuenta deshabilitada');
    }
    
    // Generar token
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.toString()
    };
    
    const token = this.jwtService.generateToken(payload);
    
    // Retornar token y datos del usuario
    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.toString()
      }
    };
  }
} 