import { Module } from '@nestjs/common';
import { GetEventStatisticsUseCase } from '@eventhub/application/use-cases/analytics/GetEventStatisticsUseCase';
import { GetOrganizerDashboardUseCase } from '@eventhub/application/use-cases/analytics/GetOrganizerDashboardUseCase';
import { GetAdminDashboardUseCase } from '@eventhub/application/use-cases/analytics/GetAdminDashboardUseCase';
import { EventModule } from './event.module';
import { UserModule } from './user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { TypeOrmPaymentRepository } from '../repositories/payment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    EventModule,
    UserModule
  ],
  providers: [
    {
      provide: 'PaymentRepository',
      useClass: TypeOrmPaymentRepository
    },
    {
      provide: GetEventStatisticsUseCase,
      useFactory: (eventRepository, ticketRepository, paymentRepository, ratingRepository) => {
        return new GetEventStatisticsUseCase(
          eventRepository,
          ticketRepository,
          paymentRepository,
          ratingRepository
        );
      },
      inject: ['EventRepository', 'TicketRepository', 'PaymentRepository', 'RatingRepository']
    },
    {
      provide: GetOrganizerDashboardUseCase,
      useFactory: (eventRepository, ticketRepository, paymentRepository) => {
        return new GetOrganizerDashboardUseCase(
          eventRepository,
          ticketRepository,
          paymentRepository
        );
      },
      inject: ['EventRepository', 'TicketRepository', 'PaymentRepository']
    },
    {
      provide: GetAdminDashboardUseCase,
      useFactory: (eventRepository, userRepository, ticketRepository, paymentRepository) => {
        return new GetAdminDashboardUseCase(
          eventRepository,
          userRepository,
          ticketRepository,
          paymentRepository
        );
      },
      inject: ['EventRepository', 'UserRepository', 'TicketRepository', 'PaymentRepository']
    }
  ],
  exports: [
    GetEventStatisticsUseCase,
    GetOrganizerDashboardUseCase,
    GetAdminDashboardUseCase
  ]
})
export class AnalyticsModule {} 