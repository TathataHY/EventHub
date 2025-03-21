import { Module } from '@nestjs/common';
import { DomainModule } from './domain.module';
import {
  AddAttendeeUseCase,
  CancelEventUseCase,
  CreateEventUseCase,
  CreateNotificationUseCase,
  CreateUserUseCase,
  GetEventsUseCase,
  GetEventByIdUseCase,
  LoginUseCase,
  GetUserByIdUseCase,
  GetUserNotificationsUseCase,
  MarkNotificationReadUseCase,
  RemoveAttendeeUseCase,
  UpdateEventUseCase,
  UpdateUserUseCase,
} from 'eventhub-application';
import { PasswordService } from '../services/password.service';
import { JwtService } from '../services/jwt.service';
import { 
  EventRepository, 
  UserRepository, 
  NotificationRepository,
  ITicketRepository
} from 'eventhub-domain';
import { 
  TypeOrmEventRepository, 
  TypeOrmUserRepository, 
  TypeOrmNotificationRepository,
  TicketRepositoryTypeORM
} from 'eventhub-infrastructure';

/**
 * Módulo que integra la capa de aplicación con NestJS
 * Proporciona los casos de uso para ser inyectados en los controladores
 */
@Module({
  imports: [DomainModule],
  providers: [
    // Servicios comunes
    PasswordService,
    JwtService,
    
    // Event use cases
    {
      provide: CreateEventUseCase,
      useFactory: (eventRepository) => new CreateEventUseCase(eventRepository),
      inject: ['EventRepository'],
    },
    {
      provide: UpdateEventUseCase,
      useFactory: (eventRepository) => new UpdateEventUseCase(eventRepository),
      inject: ['EventRepository'],
    },
    {
      provide: CancelEventUseCase,
      useFactory: (eventRepository) => new CancelEventUseCase(eventRepository),
      inject: ['EventRepository'],
    },
    {
      provide: GetEventByIdUseCase,
      useFactory: (eventRepository) => new GetEventByIdUseCase(eventRepository),
      inject: ['EventRepository'],
    },
    {
      provide: GetEventsUseCase,
      useFactory: (eventRepository) => new GetEventsUseCase(eventRepository),
      inject: ['EventRepository'],
    },
    {
      provide: AddAttendeeUseCase,
      useFactory: (eventRepository, userRepository) => 
        new AddAttendeeUseCase(eventRepository, userRepository),
      inject: ['EventRepository', 'UserRepository'],
    },
    {
      provide: RemoveAttendeeUseCase,
      useFactory: (eventRepository, userRepository) => 
        new RemoveAttendeeUseCase(eventRepository, userRepository),
      inject: ['EventRepository', 'UserRepository'],
    },
    
    // User use cases
    {
      provide: CreateUserUseCase,
      useFactory: (userRepository, passwordService) => 
        new CreateUserUseCase(userRepository, passwordService),
      inject: ['UserRepository', PasswordService],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (userRepository, passwordService) => 
        new UpdateUserUseCase(userRepository, passwordService),
      inject: ['UserRepository', PasswordService],
    },
    {
      provide: GetUserByIdUseCase,
      useFactory: (userRepository) => new GetUserByIdUseCase(userRepository),
      inject: ['UserRepository'],
    },
    {
      provide: LoginUseCase,
      useFactory: (userRepository, passwordService, jwtService) => 
        new LoginUseCase(userRepository, passwordService, jwtService),
      inject: ['UserRepository', PasswordService, JwtService],
    },
    
    // Notification use cases
    {
      provide: CreateNotificationUseCase,
      useFactory: (notificationRepository, userRepository) => 
        new CreateNotificationUseCase(notificationRepository, userRepository),
      inject: ['NotificationRepository', 'UserRepository'],
    },
    {
      provide: GetUserNotificationsUseCase,
      useFactory: (notificationRepository) => 
        new GetUserNotificationsUseCase(notificationRepository),
      inject: ['NotificationRepository'],
    },
    {
      provide: MarkNotificationReadUseCase,
      useFactory: (notificationRepository) => 
        new MarkNotificationReadUseCase(notificationRepository),
      inject: ['NotificationRepository'],
    },

    // Repositorios
    {
      provide: EventRepository,
      useClass: TypeOrmEventRepository,
    },
    {
      provide: UserRepository,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: NotificationRepository,
      useClass: TypeOrmNotificationRepository,
    },
    {
      provide: ITicketRepository,
      useClass: TicketRepositoryTypeORM,
    },
  ],
  exports: [
    // Servicios comunes
    PasswordService,
    JwtService,
    
    // Event use cases
    CreateEventUseCase,
    UpdateEventUseCase,
    CancelEventUseCase,
    GetEventByIdUseCase,
    GetEventsUseCase,
    AddAttendeeUseCase,
    RemoveAttendeeUseCase,
    
    // User use cases
    CreateUserUseCase,
    UpdateUserUseCase,
    GetUserByIdUseCase,
    LoginUseCase,
    
    // Notification use cases
    CreateNotificationUseCase,
    GetUserNotificationsUseCase,
    MarkNotificationReadUseCase,
  ],
})
export class ApplicationModule {} 