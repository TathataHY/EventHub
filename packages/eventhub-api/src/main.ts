import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './infrastructure/modules';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import { LoggingInterceptor } from './infrastructure/interceptors/logging.interceptor';
import { ConfigurationService } from './infrastructure/config/config.service';
import { setupSwagger } from './infrastructure/config/swagger.config';

async function bootstrap() {
  // Crear aplicación NestJS
  const app = await NestFactory.create(AppModule);
  
  // Obtener configuración
  const configService = app.get(ConfigurationService);
  const port = configService.server.port;
  const isDev = configService.server.isDevelopment;
  
  // Configuración global de validación de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Interceptores globales
  app.useGlobalInterceptors(new LoggingInterceptor());
  
  // Filtros de excepciones globales
  app.useGlobalFilters(new HttpExceptionFilter());

  // Configuración de CORS
  app.enableCors();

  // Configuración de prefijo global para la API
  app.setGlobalPrefix('api');

  // Configuración de Swagger con opciones extendidas
  setupSwagger(app);

  // Iniciar servidor
  await app.listen(port);
  console.log(`Aplicación iniciada en: http://localhost:${port}`);
  console.log(`Documentación disponible en: http://localhost:${port}/api/docs`);
}

bootstrap(); 