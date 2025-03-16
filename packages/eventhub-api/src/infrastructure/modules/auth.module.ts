import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AuthController } from '../controllers/auth.controller';
import { ApplicationModule } from './application.module';
import { DomainModule } from './domain.module';

/**
 * Módulo para la autenticación de usuarios
 */
@Module({
  imports: [
    // Importar PassportModule para autenticación
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // Configurar JwtModule para generar y validar tokens
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'development_secret'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '24h'),
        },
      }),
    }),
    
    // Módulos requeridos para acceder a casos de uso y repositorios
    ApplicationModule,
  ],
  controllers: [AuthController],
  providers: [JwtStrategy],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {} 