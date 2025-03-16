import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { GetUserByIdUseCase } from 'eventhub-application';

/**
 * Payload del token JWT
 */
interface JwtPayload {
  sub: string;  // ID del usuario
  email: string;
}

/**
 * Estrategia para autenticación JWT en Passport
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private getUserByIdUseCase: GetUserByIdUseCase,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET', 'development_secret'),
    });
  }

  /**
   * Valida el payload del token y retorna los datos del usuario
   * @param payload Datos extraídos del token JWT
   * @returns Datos del usuario autenticado
   */
  async validate(payload: JwtPayload): Promise<any> {
    try {
      // Buscar el usuario por el ID (sub) del token
      const user = await this.getUserByIdUseCase.execute(payload.sub);
      
      // Si no existe, denegar acceso
      if (!user) {
        throw new UnauthorizedException('Usuario no válido o inactivo');
      }
      
      // Retornar el usuario para agregar a req.user
      return user;
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
} 