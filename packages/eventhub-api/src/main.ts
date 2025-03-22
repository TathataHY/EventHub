import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './infrastructure/modules';
import { HttpExceptionFilter } from './infrastructure/filters/http-exception.filter';
import { LoggingInterceptor } from './infrastructure/interceptors/logging.interceptor';
import { ConfigurationService } from './infrastructure/config/config.service';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  // Crear la aplicación NestJS con Express
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  
  // Obtener configuración
  const configServiceNest = app.get(ConfigurationService);
  const port = configService.get<number>('PORT', 3000);
  const isDev = configServiceNest.server.isDevelopment;
  
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

  // Middleware para parsear el cuerpo JSON estándar
  app.use(bodyParser.json());
  
  // Middleware especial para webhooks de Stripe (necesitamos el cuerpo sin procesar)
  app.use(
    '/api/webhooks/stripe',
    bodyParser.raw({ 
      type: 'application/json',
      verify: (req: any, res, buf) => {
        req.rawBody = buf;
      }
    })
  );

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('EventHub API')
    .setDescription('API para la plataforma de gestión de eventos EventHub')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Iniciar servidor
  await app.listen(port);
  console.log(`Aplicación iniciada en: http://localhost:${port}`);
  console.log(`Documentación disponible en: http://localhost:${port}/api/docs`);
}

bootstrap(); 