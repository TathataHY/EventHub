import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity } from '../entities/event.entity';
import { EventRepository } from '../repositories/event.repository';
import { 
  CreateEventUseCase,
  GetEventDetailsUseCase,
  GetEventsUseCase,
  UpdateEventUseCase,
  CancelEventUseCase,
  PublishEventUseCase,
  UploadEventImageUseCase,
  SearchEventsUseCase,
  AssignEventCategoriesUseCase,
} from 'eventhub-application';
import { UserModule } from './user.module';
import { StorageModule } from './storage.module';
import { CategoryModule } from './category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EventEntity]),
    UserModule,
    StorageModule,
    CategoryModule,
  ],
  providers: [
    EventRepository,
    {
      provide: CreateEventUseCase,
      useFactory: (eventRepository) => {
        return new CreateEventUseCase(eventRepository);
      },
      inject: [EventRepository],
    },
    {
      provide: GetEventDetailsUseCase,
      useFactory: (eventRepository) => {
        return new GetEventDetailsUseCase(eventRepository);
      },
      inject: [EventRepository],
    },
    {
      provide: GetEventsUseCase,
      useFactory: (eventRepository) => {
        return new GetEventsUseCase(eventRepository);
      },
      inject: [EventRepository],
    },
    {
      provide: UpdateEventUseCase,
      useFactory: (eventRepository) => {
        return new UpdateEventUseCase(eventRepository);
      },
      inject: [EventRepository],
    },
    {
      provide: CancelEventUseCase,
      useFactory: (eventRepository) => {
        return new CancelEventUseCase(eventRepository);
      },
      inject: [EventRepository],
    },
    {
      provide: PublishEventUseCase,
      useFactory: (eventRepository) => {
        return new PublishEventUseCase(eventRepository);
      },
      inject: [EventRepository],
    },
    {
      provide: UploadEventImageUseCase,
      useFactory: (eventRepository, storageService) => {
        return new UploadEventImageUseCase(eventRepository, storageService);
      },
      inject: [EventRepository, 'StorageService'],
    },
    {
      provide: SearchEventsUseCase,
      useFactory: (eventRepository) => {
        return new SearchEventsUseCase(eventRepository);
      },
      inject: [EventRepository],
    },
    {
      provide: AssignEventCategoriesUseCase,
      useFactory: (eventRepository, categoryRepository) => {
        return new AssignEventCategoriesUseCase(eventRepository, categoryRepository);
      },
      inject: [EventRepository, 'CategoryRepository'],
    },
  ],
  exports: [
    EventRepository,
    CreateEventUseCase,
    GetEventDetailsUseCase,
    GetEventsUseCase,
    UpdateEventUseCase,
    CancelEventUseCase,
    PublishEventUseCase,
    UploadEventImageUseCase,
    SearchEventsUseCase,
    AssignEventCategoriesUseCase,
  ],
})
export class EventModule {} 