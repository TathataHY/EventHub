import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Servicio para manejar operaciones con tokens JWT
 */
@Injectable()
export class JwtService {
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService
  ) {}

  /**
   * Genera un token JWT a partir de los datos del usuario
   * @param payload Datos del usuario para incluir en el token
   * @returns Token JWT generado
   */
  async generateToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.sign(payload);
  }

  /**
   * Verifica y decodifica un token JWT
   * @param token Token JWT a verificar
   * @returns Payload decodificado si es válido, null si no lo es
   */
  async verifyToken(token: string): Promise<JwtPayload | null> {
    try {
      return this.jwtService.verify<JwtPayload>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
    } catch (error) {
      return null;
    }
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