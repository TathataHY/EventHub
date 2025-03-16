import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserDto } from 'eventhub-application';

/**
 * Interfaz para el payload del token JWT
 */
export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Servicio para la gestión de tokens JWT
 */
@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Genera un token JWT para el usuario autenticado
   * @param user Datos del usuario
   * @returns Token JWT
   */
  generateToken(user: UserDto): string {
    const payload = {
      sub: user.id,  // ID del usuario como subject
      email: user.email,
      name: user.name,
      role: user.role
    };

    return this.jwtService.sign(payload);
  }

  /**
   * Verifica y decodifica un token JWT
   * @param token Token a verificar
   * @returns Payload del token
   */
  verifyToken(token: string): any {
    return this.jwtService.verify(token);
  }

  /**
   * Decodifica un token JWT sin verificar su validez
   * @param token Token JWT a decodificar
   * @returns La carga útil decodificada
   */
  decodeToken(token: string): JwtPayload {
    return this.jwtService.decode(token) as JwtPayload;
  }
} 