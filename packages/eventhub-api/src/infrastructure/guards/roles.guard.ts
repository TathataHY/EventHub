import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Guard para restricción de acceso basado en roles
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Verifica si el usuario tiene los roles requeridos para acceder a la ruta
   * @param context Contexto de ejecución
   * @returns Si el usuario tiene permisos para acceder
   */
  canActivate(context: ExecutionContext): boolean {
    // Obtener los roles requeridos del decorador @Roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ]
    );

    // Si no hay roles requeridos, permitir acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Obtener el usuario desde el request
    const { user } = context.switchToHttp().getRequest();
    
    // Verificar si el usuario tiene alguno de los roles requeridos
    const hasRole = requiredRoles.includes(user.role);
    
    if (!hasRole) {
      throw new ForbiddenException('No tiene permisos para acceder a este recurso');
    }
    
    return true;
  }
} 