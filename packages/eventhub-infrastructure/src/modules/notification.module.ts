import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationEntity } from '../entities/notification.entity';
import { NotificationPreferenceEntity } from '../entities/notification-preference.entity';
import { TypeOrmNotificationRepository } from '../repositories/notification.repository';
import { TypeOrmNotificationPreferenceRepository } from '../repositories/notification-preference.repository';
import { NotificationService } from '../services/notification.service';

// Use cases
import {
  GetUserNotificationsUseCase,
  MarkNotificationReadUseCase,
  MarkAllNotificationsReadUseCase,
  GetUnreadCountUseCase,
  GetNotificationPreferenceUseCase,
  UpdateNotificationPreferenceUseCase,
  SendNotificationUseCase,
  TYPES
} from 'eventhub-application';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationEntity,
      NotificationPreferenceEntity
    ])
  ],
  providers: [
    // Repositorios
    {
      provide: TYPES.NotificationRepository,
      useClass: TypeOrmNotificationRepository
    },
    {
      provide: TYPES.NotificationPreferenceRepository,
      useClass: TypeOrmNotificationPreferenceRepository
    },
    
    // Servicios
    NotificationService,
    
    // Casos de uso
    {
      provide: GetUserNotificationsUseCase,
      useFactory: (notificationRepo) => new GetUserNotificationsUseCase(notificationRepo),
      inject: [TYPES.NotificationRepository]
    },
    {
      provide: MarkNotificationReadUseCase,
      useFactory: (notificationRepo) => new MarkNotificationReadUseCase(notificationRepo),
      inject: [TYPES.NotificationRepository]
    },
    {
      provide: MarkAllNotificationsReadUseCase,
      useFactory: (notificationRepo) => new MarkAllNotificationsReadUseCase(notificationRepo),
      inject: [TYPES.NotificationRepository]
    },
    {
      provide: GetUnreadCountUseCase,
      useFactory: (notificationRepo) => new GetUnreadCountUseCase(notificationRepo),
      inject: [TYPES.NotificationRepository]
    },
    {
      provide: GetNotificationPreferenceUseCase,
      useFactory: (prefRepo) => new GetNotificationPreferenceUseCase(prefRepo),
      inject: [TYPES.NotificationPreferenceRepository]
    },
    {
      provide: UpdateNotificationPreferenceUseCase,
      useFactory: (prefRepo) => new UpdateNotificationPreferenceUseCase(prefRepo),
      inject: [TYPES.NotificationPreferenceRepository]
    },
    {
      provide: SendNotificationUseCase,
      useFactory: (notificationRepo, notificationService) => 
        new SendNotificationUseCase(notificationRepo, notificationService),
      inject: [TYPES.NotificationRepository, NotificationService]
    }
  ],
  exports: [
    TYPES.NotificationRepository,
    TYPES.NotificationPreferenceRepository,
    GetUserNotificationsUseCase,
    MarkNotificationReadUseCase,
    MarkAllNotificationsReadUseCase,
    GetUnreadCountUseCase,
    GetNotificationPreferenceUseCase,
    UpdateNotificationPreferenceUseCase,
    SendNotificationUseCase
  ]
})
export class NotificationModule {} 