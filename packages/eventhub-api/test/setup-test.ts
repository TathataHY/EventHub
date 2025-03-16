import { Test } from '@nestjs/testing';
import { TestModule } from '../src/infrastructure/testing/test.module';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../src/infrastructure/filters/http-exception.filter';
import * as dotenv from 'dotenv';

// Cargar variables de entorno para pruebas
dotenv.config({ path: '.env.test' });

// Tiempo máximo de espera para pruebas
jest.setTimeout(30000);

// Variable global para la aplicación de pruebas
let app: INestApplication;

// Configurar antes de todas las pruebas
beforeAll(async () => {
  // Crear módulo de prueba
  const moduleFixture = await Test.createTestingModule({
    imports: [TestModule],
  }).compile();

  // Crear aplicación NestJS
  app = moduleFixture.createNestApplication();
  
  // Configurar pipes, filters, etc.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  app.useGlobalFilters(new HttpExceptionFilter());
  app.setGlobalPrefix('api');
  
  // Iniciar aplicación
  await app.init();
  
  // Agregar la aplicación al objeto global para que esté disponible en todas las pruebas
  (global as any).app = app;
});

// Limpiar después de todas las pruebas
afterAll(async () => {
  if (app) {
    await app.close();
  }
}); 