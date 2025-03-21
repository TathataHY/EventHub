import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity, NotificationEntity, UserEntity, TicketEntity, PaymentEntity } from 'eventhub-infrastructure';
import { EventRepositoryImpl, NotificationRepositoryImpl, UserRepositoryImpl } from '../typeorm/repositories';
import { TransactionService } from 'eventhub-infrastructure';

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
      TicketEntity,
      PaymentEntity
    ]),
  ],
  providers: [
    // Servicio de transacciones
    TransactionService,

    // Repositorios
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
    // Re-exportar TypeOrmModule para que otros módulos puedan usar las entidades
    TypeOrmModule,
    // Exportar el servicio de transacciones
    TransactionService,
    // Exportar repositorios
    'UserRepository',
    'EventRepository',
    'NotificationRepository',
  ],
})
export class DomainModule {} 