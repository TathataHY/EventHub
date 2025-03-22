import { SetMetadata } from '@nestjs/common';

/**
 * Clave para identificar los permisos en los metadatos
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Decorador para asignar permisos requeridos a una ruta
 * @param permissions Lista de permisos requeridos
 * Ejemplo: @RequirePermissions('events:create', 'events:update')
 */
export const RequirePermissions = (...permissions: string[]) => 
  SetMetadata(PERMISSIONS_KEY, permissions); 