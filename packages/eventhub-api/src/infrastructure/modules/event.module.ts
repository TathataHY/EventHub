import { Module } from '@nestjs/common';
import { EventController } from '../controllers/event.controller';
import { ApplicationModule } from './application.module';
import { DomainModule } from './domain.module';

/**
 * Módulo que integra los controladores de eventos con los casos de uso
 */
@Module({
  imports: [
    DomainModule,
    ApplicationModule
  ],
  controllers: [EventController],
  exports: []
})
export class EventModule {} 