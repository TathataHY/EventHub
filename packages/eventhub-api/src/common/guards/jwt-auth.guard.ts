import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { JwtService } from '../../infrastructure/services/jwt.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService
  ) {
    super();
  }

  /**
   * Verifica si la solicitud puede activar el handler
   * @param context Contexto de la ejecución
   * @returns Booleano indicando si se permite la ejecución
   */
  canActivate(context: ExecutionContext) {
    // Verificar si la ruta está marcada como pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      'isPublic',
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    if (isPublic) {
      return true;
    }

    // Continuar con la verificación normal del AuthGuard
    return super.canActivate(context);
  }

  /**
   * Maneja el error cuando la autenticación falla
   * @param error Error de autenticación
   */
  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw new UnauthorizedException('No autorizado');
    }
    return user;
  }
} 