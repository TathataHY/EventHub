import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * Servicio para manejo de tokens JWT
 */
@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Genera un token JWT para el usuario
   * @param payload Datos del usuario a incluir en el token
   * @returns Token JWT generado
   */
  generateToken(payload: {
    id: string;
    name: string;
    email: string;
    role: string;
  }): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '24h'
    });
  }

  /**
   * Verifica un token JWT
   * @param token Token JWT a verificar
   * @returns Payload si el token es válido, null si no lo es
   */
  verifyToken(token: string): {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null {
    try {
      return this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET')
      });
    } catch (error) {
      return null;
    }
  }
} 