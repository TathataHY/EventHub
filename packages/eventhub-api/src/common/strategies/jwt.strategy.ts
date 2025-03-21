import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from 'eventhub-domain';

/**
 * Estrategia de autenticación con JWT para Passport
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  /**
   * Valida el payload del token JWT y devuelve el usuario autenticado
   * @param payload Datos del payload del token
   * @returns Datos del usuario autenticado
   */
  async validate(payload: any) {
    const user = await this.userRepository.findById(payload.id);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role.toString(),
    };
  }
} 