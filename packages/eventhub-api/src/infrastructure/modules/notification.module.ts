import { Module } from '@nestjs/common';
import { ApplicationModule } from './application.module';
import { NotificationController } from '../controllers/notification.controller';

/**
 * Módulo que integra los controladores de notificaciones con los casos de uso
 */
@Module({
  imports: [ApplicationModule],
  controllers: [NotificationController],
  exports: []
})
export class NotificationModule {} 