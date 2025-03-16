import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  EventCreateException,
  EventUpdateException,
  EventAttendanceException,
  UserCreateException,
  UserUpdateException,
  NotificationCreateException
} from 'eventhub-domain';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Error interno del servidor';
    
    // Manejar excepciones HTTP estándar
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? Array.isArray(exceptionResponse['message']) 
            ? exceptionResponse['message'][0]
            : exceptionResponse['message']
          : exception.message;
    }
    // Manejar excepciones de dominio
    else if (
      exception instanceof EventCreateException ||
      exception instanceof EventUpdateException ||
      exception instanceof UserCreateException ||
      exception instanceof UserUpdateException ||
      exception instanceof NotificationCreateException
    ) {
      status = HttpStatus.BAD_REQUEST;
      message = exception.message;
    }
    else if (exception instanceof EventAttendanceException) {
      status = HttpStatus.CONFLICT;
      message = exception.message;
    }
    
    // Formato de respuesta estándar para todas las excepciones
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message
    });
    
    // Registrar el error en consola
    console.error(`[${status}] ${message}`, exception);
  }
} 