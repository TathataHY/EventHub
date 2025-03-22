import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { UserRepository } from 'eventhub-domain';

/**
 * Guard para verificar que el usuario tiene los permisos requeridos
 */
@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userRepository: UserRepository
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ]
    );
    
    // Si no hay permisos requeridos, permite el acceso
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    // Si no hay usuario, deniega el acceso
    if (!user || !user.id) {
      return false;
    }
    
    // Buscar usuario con sus permisos
    const userEntity = await this.userRepository.findById(user.id);
    
    // Si no existe o no está activo, deniega el acceso
    if (!userEntity || !userEntity.isActive) {
      return false;
    }
    
    // Obtener permisos del usuario según su rol
    const userPermissions = this.getPermissionsByRole(userEntity.role.toString());
    
    // Verificar si el usuario tiene todos los permisos requeridos
    return requiredPermissions.every(permission => 
      userPermissions.includes(permission)
    );
  }
  
  /**
   * Obtiene los permisos asociados a un rol específico
   * Esta es una implementación básica, podría mejorarse con una tabla de permisos
   * @param role Rol del usuario
   * @returns Array con los permisos del rol
   */
  private getPermissionsByRole(role: string): string[] {
    // Definición básica de permisos por rol
    const permissionsByRole = {
      'ADMIN': [
        'users:manage', 'users:view', 
        'events:create', 'events:update', 'events:delete', 'events:view',
        'tickets:manage', 'tickets:view',
        'payments:manage', 'payments:view',
        'groups:manage', 'groups:view',
        'notifications:manage'
      ],
      'ORGANIZER': [
        'events:create', 'events:update', 'events:delete', 'events:view',
        'tickets:manage', 'tickets:view',
        'groups:manage', 'groups:view'
      ],
      'USER': [
        'events:view',
        'tickets:view',
        'groups:view'
      ]
    };
    
    // Retornar permisos del rol o array vacío si el rol no existe
    return permissionsByRole[role] || [];
  }
} 