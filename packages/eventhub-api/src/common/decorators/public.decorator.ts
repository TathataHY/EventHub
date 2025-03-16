import { SetMetadata } from '@nestjs/common';

/**
 * Decorador para marcar rutas como públicas (no requieren autenticación)
 * Uso: @Public()
 */
export const Public = () => SetMetadata('isPublic', true); 