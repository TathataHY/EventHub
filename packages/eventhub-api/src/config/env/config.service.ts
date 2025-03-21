import { Injectable } from '@nestjs/common';
import { EnvConfig, validateEnv } from './validation.schema';

/**
 * Servicio para acceder a configuraciones validadas
 */
@Injectable()
export class ConfigurationService {
  private readonly config: EnvConfig;

  constructor() {
    // Validar las variables de entorno al iniciar el servicio
    this.config = validateEnv();
  }

  /**
   * Obtiene una configuración específica de base de datos
   */
  get database() {
    return {
      host: this.config.DB_HOST,
      port: this.config.DB_PORT,
      username: this.config.DB_USERNAME,
      password: this.config.DB_PASSWORD,
      database: this.config.DB_NAME,
    };
  }

  /**
   * Obtiene configuración de JWT
   */
  get jwt() {
    return {
      secret: this.config.JWT_SECRET,
      expiresIn: this.config.JWT_EXPIRES_IN,
    };
  }

  /**
   * Obtiene configuración del servidor
   */
  get server() {
    return {
      port: this.config.PORT,
      environment: this.config.NODE_ENV,
      isDevelopment: this.config.NODE_ENV === 'development',
      isProduction: this.config.NODE_ENV === 'production',
      isTest: this.config.NODE_ENV === 'test',
    };
  }
} 