import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, ip } = request;
    const userAgent = request.get('user-agent') || 'unknown';
    
    const now = Date.now();
    const requestId = `${method}-${url}-${now}`;

    // Registrar la solicitud entrante
    this.logger.log(
      `[${requestId}] ${method} ${url} - Body: ${JSON.stringify(body)} - IP: ${ip} - User-Agent: ${userAgent}`
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          // Registrar respuesta exitosa
          const responseTime = Date.now() - now;
          this.logger.log(
            `[${requestId}] Completado en ${responseTime}ms - Respuesta: ${
              typeof data === 'object' ? 'objeto' : data
            }`
          );
        },
        error: (error) => {
          // Registrar error
          const responseTime = Date.now() - now;
          this.logger.error(
            `[${requestId}] Error en ${responseTime}ms - ${error.message}`,
            error.stack
          );
        },
      })
    );
  }
} 