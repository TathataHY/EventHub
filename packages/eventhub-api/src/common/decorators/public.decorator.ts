import { SetMetadata } from '@nestjs/common';

/**
 * Clave para identificar si una ruta es pública
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorador para marcar una ruta como pública (no requiere autenticación)
 * Ejemplo: @Public()
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true); 