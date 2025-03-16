import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';

// Entidades de infraestructura
import { 
  UserEntity, 
  EventEntity, 
  NotificationEntity,
  NotificationPreferenceEntity 
} from 'eventhub-infrastructure';

// Módulos de la nueva arquitectura
import { DomainModule } from './infrastructure/modules/domain.module';
import { ApplicationModule } from './infrastructure/modules/application.module';
import { EventModule } from './infrastructure/modules/event.module';
import { UserModule } from './infrastructure/modules/user.module';
import { NotificationModule } from './infrastructure/modules/notification.module';
import { AuthModule } from './infrastructure/modules/auth.module';
import { WebsocketModule } from './infrastructure/modules/websocket.module';

// Controladores
import { TestController } from './infrastructure/controllers/test.controller';

/**
 * Módulo principal de la aplicación
 */
@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Configuración de JWT
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'development_secret'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1d'),
        },
      }),
      inject: [ConfigService],
    }),
    
    // Configuración de TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'root'),
        database: configService.get('DB_DATABASE', 'eventhub'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: configService.get('DB_SYNC', 'false') === 'true',
        logging: configService.get('DB_LOGGING', 'false') === 'true',
      }),
    }),
    
    // Módulos de la aplicación
    DomainModule,
    ApplicationModule,
    EventModule,
    UserModule,
    NotificationModule,
    AuthModule,
    WebsocketModule,
  ],
  controllers: [
    TestController
  ],
  providers: [
    // Configurar JwtAuthGuard como guardia global
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {} 