import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity, NotificationEntity, UserEntity } from '../typeorm/entities';
import { EventRepositoryImpl, NotificationRepositoryImpl, UserRepositoryImpl } from '../typeorm/repositories';

/**
 * Módulo que integra la capa de dominio con NestJS
 * Proporciona los repositorios implementados para ser inyectados en los casos de uso
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      EventEntity,
      NotificationEntity,
    ]),
  ],
  providers: [
    {
      provide: 'UserRepository',
      useClass: UserRepositoryImpl,
    },
    {
      provide: 'EventRepository',
      useClass: EventRepositoryImpl,
    },
    {
      provide: 'NotificationRepository',
      useClass: NotificationRepositoryImpl,
    },
  ],
  exports: [
    'UserRepository',
    'EventRepository',
    'NotificationRepository',
  ],
})
export class DomainModule {} 