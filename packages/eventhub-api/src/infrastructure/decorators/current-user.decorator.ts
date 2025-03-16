import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorador que extrae la información del usuario del objeto Request.
 * Esto permite acceder al usuario autenticado en los controladores.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
); 