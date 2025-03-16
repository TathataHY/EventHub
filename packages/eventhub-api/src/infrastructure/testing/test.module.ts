import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ApplicationModule } from '../modules/application.module';
import { DomainModule } from '../modules/domain.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity, NotificationEntity, UserEntity } from '../typeorm/entities';

/**
 * Módulo específico para pruebas de QA
 * Configura una base de datos de prueba y carga los repositorios necesarios
 */
@Module({
  imports: [
    // Configuración para entorno de pruebas
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.test',
    }),
    
    // Base de datos de prueba
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'eventhub_test',
      entities: [UserEntity, EventEntity, NotificationEntity],
      synchronize: true, // Solo para pruebas
      dropSchema: true, // Recrear schema en cada ejecución de pruebas
    }),
    
    // Módulos de la aplicación
    DomainModule,
    ApplicationModule,
  ],
})
export class TestModule {} 