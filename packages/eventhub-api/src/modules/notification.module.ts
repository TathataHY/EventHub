import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationGateway } from '../common/gateways/notification.gateway';

/**
 * Módulo para la gestión de notificaciones
 */
@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [],
  providers: [NotificationGateway],
})
export class NotificationModule {} 