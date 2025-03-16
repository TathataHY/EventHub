import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpException, 
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Filtro para manejar excepciones HTTP y formatear la respuesta
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /**
   * Método que se ejecuta cuando se captura una excepción
   * @param exception Excepción capturada
   * @param host Host de argumentos que contiene información de la solicitud
   */
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const errorResponse = exception.getResponse();

    // Extraer mensaje y detalle de la excepción
    let message = 'Error interno del servidor';
    let detail = null;

    if (typeof errorResponse === 'string') {
      message = errorResponse;
    } else if (typeof errorResponse === 'object') {
      message = (errorResponse as any).message || message;
      detail = (errorResponse as any).error || null;
    }

    // Registrar el error en los logs
    this.logger.error(
      `${request.method} ${request.url} ${status} - ${message}`,
      exception.stack
    );

    // Responder con formato consistente
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      detail,
    });
  }
}

/**
 * Filtro para manejar todas las excepciones no HTTP
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  /**
   * Método que se ejecuta cuando se captura una excepción
   * @param exception Excepción capturada
   * @param host Host de argumentos que contiene información de la solicitud
   */
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Determinar el código de estado HTTP
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    // Determinar el mensaje de error
    let message = 'Error interno del servidor';
    if (exception.message) {
      message = exception.message;
    }

    // Registrar el error en los logs
    this.logger.error(
      `${request.method} ${request.url} ${status} - ${message}`,
      exception.stack
    );

    // Responder con formato consistente
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
      error: process.env.NODE_ENV === 'production' ? undefined : exception.stack,
    });
  }
} 