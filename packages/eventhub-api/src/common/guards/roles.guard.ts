import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

/**
 * Guard para verificar que el usuario tiene el rol requerido
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
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Si no hay roles requeridos, permite el acceso
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    // Si no hay usuario o no tiene rol, deniega el acceso
    if (!user || !user.role) {
      return false;
    }
    
    // Verifica si el rol del usuario está en la lista de roles requeridos
    return requiredRoles.includes(user.role);
  }
} 