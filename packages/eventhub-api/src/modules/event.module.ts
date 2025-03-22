import { Module } from '@nestjs/common';
import { EventController } from '../../controllers/event.controller';
import { DomainModule } from './domain.module';
import { CacheModule } from './cache.module';
import { 
  CreateEventUseCase, 
  GetEventsUseCase, 
  GetEventByIdUseCase,
  UpdateEventUseCase,
  CancelEventUseCase,
  AddAttendeeUseCase,
  RemoveAttendeeUseCase
} from 'eventhub-application';
import { CacheService } from 'eventhub-infrastructure';

/**
 * Módulo que integra los controladores de eventos con los casos de uso
 */
@Module({
  imports: [
    DomainModule,
    CacheModule,
  ],
  controllers: [EventController],
  providers: [
    // Casos de uso
    {
      provide: GetEventsUseCase,
      useFactory: (eventRepo, cacheService) => new GetEventsUseCase(eventRepo, cacheService),
      inject: ['EventRepository', CacheService],
    },
    {
      provide: GetEventByIdUseCase,
      useFactory: (eventRepo, cacheService) => new GetEventByIdUseCase(eventRepo, cacheService),
      inject: ['EventRepository', CacheService],
    },
    {
      provide: CreateEventUseCase,
      useFactory: (eventRepo) => new CreateEventUseCase(eventRepo),
      inject: ['EventRepository'],
    },
    {
      provide: UpdateEventUseCase,
      useFactory: (eventRepo, getByIdUseCase, getEventsUseCase, cacheService) => 
        new UpdateEventUseCase(eventRepo, getByIdUseCase, getEventsUseCase, cacheService),
      inject: ['EventRepository', GetEventByIdUseCase, GetEventsUseCase, CacheService],
    },
    {
      provide: CancelEventUseCase,
      useFactory: (eventRepo, getByIdUseCase, getEventsUseCase) => 
        new CancelEventUseCase(eventRepo, getByIdUseCase, getEventsUseCase),
      inject: ['EventRepository', GetEventByIdUseCase, GetEventsUseCase],
    },
    {
      provide: AddAttendeeUseCase,
      useFactory: (eventRepo, userRepo) => 
        new AddAttendeeUseCase(eventRepo, userRepo),
      inject: ['EventRepository', 'UserRepository'],
    },
    {
      provide: RemoveAttendeeUseCase,
      useFactory: (eventRepo) => new RemoveAttendeeUseCase(eventRepo),
      inject: ['EventRepository'],
    },
  ],
  exports: [
    GetEventsUseCase,
    GetEventByIdUseCase,
    CreateEventUseCase,
    UpdateEventUseCase,
    CancelEventUseCase,
    AddAttendeeUseCase,
    RemoveAttendeeUseCase,
  ],
})
export class EventModule {} 