import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpException, 
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException } from 'eventhub-application';

/**
 * Filtro para manejar excepciones HTTP y formatear la respuesta
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  /**
   * Método que se ejecuta cuando se captura una excepción
   * @param exception Excepción capturada
   * @param host Host de argumentos que contiene información de la solicitud
   */
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    let errorCode = 'INTERNAL_SERVER_ERROR';
    
    // Manejar excepciones HTTP estándar
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
        message = Array.isArray(exceptionResponse['message']) 
          ? exceptionResponse['message'][0]
          : exceptionResponse['message'];
      } else {
        message = exception.message;
      }
      
      errorCode = this.getErrorCodeFromStatus(status);
    }
    // Manejar excepciones de dominio
    else if (exception instanceof DomainException) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
      errorCode = exception.constructor.name.replace('Exception', '').toUpperCase();
    }
    // Manejar excepciones no controladas
    else if (exception instanceof Error) {
      message = exception.message;
      this.logger.error(`Error no controlado: ${exception.message}`, exception.stack);
    } else {
      this.logger.error(`Error desconocido: ${exception}`);
    }
    
    // Registrar información de la excepción
    this.logger.error(
      `Path: ${request.url} - Método: ${request.method} - Código: ${status} - Mensaje: ${message}`,
    );
    
    // Devolver respuesta formateada
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      errorCode,
    });
  }
  
  private getErrorCodeFromStatus(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return 'BAD_REQUEST';
      case HttpStatus.UNAUTHORIZED:
        return 'UNAUTHORIZED';
      case HttpStatus.FORBIDDEN:
        return 'FORBIDDEN';
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.CONFLICT:
        return 'CONFLICT';
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return 'UNPROCESSABLE_ENTITY';
      case HttpStatus.TOO_MANY_REQUESTS:
        return 'TOO_MANY_REQUESTS';
      default:
        return 'INTERNAL_SERVER_ERROR';
    }
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