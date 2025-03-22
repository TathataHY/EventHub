import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { 
  RegisterUserUseCase, 
  LoginUserUseCase, 
  GetUserDetailsUseCase,
  UpdateUserProfileUseCase,
  SendWelcomeEmailUseCase,
} from 'eventhub-application';
import { BcryptService } from '../services/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtService } from '../services/jwt.service';
import { AuthService } from 'eventhub-application';
import { PasswordService } from 'eventhub-application';
import { EmailModule } from './email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    ConfigModule,
    JwtModule,
    EmailModule,
  ],
  providers: [
    UserRepository,
    {
      provide: PasswordService,
      useClass: BcryptService,
    },
    {
      provide: AuthService,
      useClass: JwtService,
    },
    {
      provide: RegisterUserUseCase,
      useFactory: (userRepository, passwordService, sendWelcomeEmailUseCase) => {
        return new RegisterUserUseCase(userRepository, passwordService, sendWelcomeEmailUseCase);
      },
      inject: [UserRepository, PasswordService, SendWelcomeEmailUseCase],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (userRepository, passwordService, authService) => {
        return new LoginUserUseCase(userRepository, passwordService, authService);
      },
      inject: [UserRepository, PasswordService, AuthService],
    },
    {
      provide: GetUserDetailsUseCase,
      useFactory: (userRepository) => {
        return new GetUserDetailsUseCase(userRepository);
      },
      inject: [UserRepository],
    },
    {
      provide: UpdateUserProfileUseCase,
      useFactory: (userRepository) => {
        return new UpdateUserProfileUseCase(userRepository);
      },
      inject: [UserRepository],
    },
    {
      provide: SendWelcomeEmailUseCase,
      useFactory: (userRepository, emailService) => {
        return new SendWelcomeEmailUseCase(userRepository, emailService);
      },
      inject: [UserRepository, 'EmailService'],
    },
  ],
  exports: [
    UserRepository,
    RegisterUserUseCase,
    LoginUserUseCase,
    GetUserDetailsUseCase,
    UpdateUserProfileUseCase,
    SendWelcomeEmailUseCase,
  ],
})
export class UserModule {} 