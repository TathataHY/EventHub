import { Module } from '@nestjs/common';
import { ApplicationModule } from './application.module';
import { UserController } from '../controllers/user.controller';

/**
 * Módulo que integra los controladores de usuarios con los casos de uso
 */
@Module({
  imports: [ApplicationModule],
  controllers: [UserController],
  exports: []
})
export class UserModule {} 