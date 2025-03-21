import { SetMetadata } from '@nestjs/common';

/**
 * Clave para identificar los roles en los metadatos
 */
export const ROLES_KEY = 'roles';

/**
 * Decorador para asignar roles a una ruta
 * @param roles Lista de roles permitidos
 * Ejemplo: @Roles('ADMIN', 'MODERATOR')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles); 