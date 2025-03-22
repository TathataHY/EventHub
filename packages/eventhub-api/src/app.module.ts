import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Configuración
import { getTypeOrmConfig } from './config/typeorm/typeorm.config';
import { configValidationSchema } from './config/env/env-validation';

// Controladores
import {
  UserController,
  AuthController,
  EventController,
  PaymentController,
  CategoryController,
  CommentController,
  RatingController,
  SearchController,
  WebhookController,
  AnalyticsController,
  GroupController
} from './controllers';

// Filtros, Guards, Interceptores globales
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

// Servicios compartidos
import { JwtService, PasswordService, ExceptionHandlerService } from './common/services';
import { StripeWebhookService } from './infrastructure-layer/services';

/**
 * Módulo principal de la aplicación
 */
@Module({
  imports: [
    // Configuración de variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
      validationSchema: configValidationSchema,
    }),
    
    // Base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    
    // JWT para autenticación
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { 
          expiresIn: configService.get<string>('JWT_EXPIRES') || '1d' 
        },
      }),
    }),
    
    // Servir archivos estáticos
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
  ],
  controllers: [
    UserController,
    AuthController,
    EventController,
    PaymentController,
    CategoryController,
    CommentController,
    RatingController,
    SearchController,
    WebhookController,
    AnalyticsController,
    GroupController
  ],
  providers: [
    // Filtros globales
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    
    // Guards globales
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    
    // Interceptores globales
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    
    // Servicios compartidos
    JwtService,
    PasswordService,
    ExceptionHandlerService,
    StripeWebhookService,
  ],
})
export class AppModule {} 