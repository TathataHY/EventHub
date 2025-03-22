import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * Decorador que extrae la información del usuario del objeto Request.
 * Permite acceder al usuario autenticado en los controladores.
 * 
 * @param data Campo específico del usuario a extraer (opcional)
 * @param ctx Contexto de ejecución
 * @returns El usuario completo o un campo específico si se especifica en data
 * 
 * Ejemplos:
 * @User() user: JwtPayload
 * @User('userId') userId: string
 */
export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext): JwtPayload | string => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    
    return data ? user?.[data] : user;
  },
); 