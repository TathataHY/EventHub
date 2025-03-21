import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { DomainException, ValidationException, NotFoundException, ForbiddenException, UnauthorizedException } from 'eventhub-application';

/**
 * Servicio para manejar excepciones de manera consistente en toda la aplicación
 */
@Injectable()
export class ExceptionHandlerService {
  private readonly logger = new Logger(ExceptionHandlerService.name);

  /**
   * Maneja una excepción y devuelve una respuesta apropiada
   * @param error El error capturado
   * @param defaultMessage Mensaje por defecto si no se puede determinar el error
   * @returns Objeto con el mensaje de error y otros datos relevantes
   */
  handleException(error: any, defaultMessage: string = 'Ha ocurrido un error'): any {
    this.logger.error(`Error: ${error.message || error}`);
    
    // Si ya es una HttpException, la devolvemos directamente
    if (error instanceof HttpException) {
      throw error;
    }
    
    // Determinamos el status code basado en el mensaje de error
    const statusCode = this.determineStatusCode(error);
    
    // Construimos el mensaje de error
    const message = error.message || defaultMessage;
    
    // Lanzamos una nueva excepción HTTP
    throw new HttpException(
      {
        statusCode,
        message,
        error: 'Error',
        timestamp: new Date().toISOString(),
      },
      statusCode
    );
  }

  /**
   * Determina el código de estado HTTP basado en el mensaje de error
   * @param error El error original
   * @returns Código de estado HTTP
   */
  private determineStatusCode(error: any): HttpStatus {
    const errorMessage = (error.message || '').toLowerCase();
    
    // No encontrado
    if (
      errorMessage.includes('no encontrado') || 
      errorMessage.includes('not found')
    ) {
      return HttpStatus.NOT_FOUND;
    }
    
    // No autorizado
    if (
      errorMessage.includes('no autorizado') || 
      errorMessage.includes('unauthorized') || 
      errorMessage.includes('credentials')
    ) {
      return HttpStatus.UNAUTHORIZED;
    }
    
    // Prohibido
    if (
      errorMessage.includes('prohibido') || 
      errorMessage.includes('forbidden') || 
      errorMessage.includes('permisos')
    ) {
      return HttpStatus.FORBIDDEN;
    }
    
    // Conflicto (p.ej. duplicado)
    if (
      errorMessage.includes('duplicado') || 
      errorMessage.includes('duplicate') || 
      errorMessage.includes('conflict') || 
      errorMessage.includes('existe')
    ) {
      return HttpStatus.CONFLICT;
    }
    
    // Bad Request por defecto
    return HttpStatus.BAD_REQUEST;
  }

  /**
   * Analiza el mensaje de error para determinar el código HTTP adecuado
   * @param errorMessage Mensaje de error
   * @returns Código HTTP apropiado basado en el mensaje
   */
  getHttpStatusFromMessage(errorMessage: string): HttpStatus {
    const lowerMessage = errorMessage.toLowerCase();
    
    if (lowerMessage.includes('no encontrado') || lowerMessage.includes('not found')) {
      return HttpStatus.NOT_FOUND;
    }
    
    if (lowerMessage.includes('no autorizado') || lowerMessage.includes('unauthorized')) {
      return HttpStatus.UNAUTHORIZED;
    }
    
    if (lowerMessage.includes('prohibido') || lowerMessage.includes('forbidden') ||
        lowerMessage.includes('permisos') || lowerMessage.includes('permission')) {
      return HttpStatus.FORBIDDEN;
    }
    
    if (lowerMessage.includes('validación') || lowerMessage.includes('validation') ||
        lowerMessage.includes('inválido') || lowerMessage.includes('invalid')) {
      return HttpStatus.BAD_REQUEST;
    }
    
    return HttpStatus.INTERNAL_SERVER_ERROR;
  }
} 