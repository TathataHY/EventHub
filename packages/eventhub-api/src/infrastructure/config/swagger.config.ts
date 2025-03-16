import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

/**
 * Configura Swagger para documentación de API
 * Añade metadatos, tags y servidores disponibles
 */
export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('EventHub API')
    .setDescription('API para la gestión de eventos y notificaciones')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      description: 'Token JWT de autenticación',
      in: 'header',
    })
    // Tags para agrupar endpoints
    .addTag('Eventos', 'Operaciones relacionadas con eventos')
    .addTag('Usuarios', 'Operaciones relacionadas con usuarios')
    .addTag('Notificaciones', 'Operaciones relacionadas con notificaciones')
    .addTag('Autenticación', 'Operaciones relacionadas con autenticación')
    .addTag('Diagnóstico', 'Endpoints de diagnóstico y monitoreo')
    // Servidores disponibles
    .addServer('http://localhost:3000', 'Servidor local de desarrollo')
    .addServer('http://localhost:3001', 'Servidor local de pruebas')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Opciones adicionales para Swagger UI
  const options = {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showExtensions: true,
    },
  };

  SwaggerModule.setup('api/docs', app, document, options);
} 