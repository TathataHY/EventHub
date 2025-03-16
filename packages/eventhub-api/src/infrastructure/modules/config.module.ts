import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule, ConfigService } from '@nestjs/config';
import { ConfigurationService } from '../config/config.service';

/**
 * Módulo de configuración que utiliza validación de esquema
 * y proporciona acceso a valores validados
 */
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true,
      envFilePath: ['.env', '.env.local', `.env.${process.env.NODE_ENV}`],
    }),
  ],
  providers: [
    ConfigService,
    ConfigurationService,
  ],
  exports: [
    ConfigService,
    ConfigurationService,
  ],
})
export class ConfigModule {} 