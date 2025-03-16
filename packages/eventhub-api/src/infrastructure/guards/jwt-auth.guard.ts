import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Guard de autenticación JWT
 * Extiende la funcionalidad de AuthGuard para permitir 
 * rutas públicas usando el decorador @Public()
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Determina si la ruta es accesible
   * @param context Contexto de ejecución
   * @returns Si la ruta es pública o el usuario está autenticado
   */
  canActivate(context: ExecutionContext) {
    // Verificar si la ruta está marcada como pública
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ]
    );

    // Si es pública, permitir acceso sin verificación
    if (isPublic) {
      return true;
    }

    // Para rutas protegidas, usar el comportamiento estándar del AuthGuard
    return super.canActivate(context);
  }

  /**
   * Maneja errores de autenticación
   * @param err Error original
   */
  handleRequest(err: any, user: any) {
    // Si hay un error o no se encontró el usuario, lanzar excepción
    if (err || !user) {
      throw err || new UnauthorizedException('No autorizado');
    }
    
    return user;
  }
} 