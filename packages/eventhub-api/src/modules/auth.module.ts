import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import {
  User,
  UserRepository,
  TypeOrmUserRepository,
  JwtService,
  PasswordService,
  EmailService
} from 'eventhub-infrastructure';
import {
  LoginUseCase,
  RegisterUseCase,
  ValidateTokenUseCase,
  ChangePasswordUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase
} from 'eventhub-application';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { AuthController } from '../../controllers/auth.controller';
import { RolesGuard } from '../common/guards/roles.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';

/**
 * Módulo para la autenticación de usuarios
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '24h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Estrategia de autenticación
    JwtStrategy,
    
    // Guards
    RolesGuard,
    PermissionsGuard,
    
    // Servicios
    JwtService,
    PasswordService,
    EmailService,
    
    // Repositorios
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },
    
    // Casos de uso
    LoginUseCase,
    RegisterUseCase,
    ValidateTokenUseCase,
    ChangePasswordUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
  ],
  exports: [
    PassportModule,
    JwtStrategy,
    RolesGuard,
    PermissionsGuard,
    LoginUseCase,
    RegisterUseCase,
    ValidateTokenUseCase,
    ChangePasswordUseCase,
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    JwtService,
    PasswordService,
    EmailService,
  ],
})
export class AuthModule {} 