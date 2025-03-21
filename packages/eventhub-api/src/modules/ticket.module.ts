import { Module } from '@nestjs/common';
import { TicketController } from '../../controllers/ticket.controller';
import { 
  CreateTicketUseCase, 
  GetUserTicketsUseCase, 
  ValidateTicketUseCase 
} from 'eventhub-application';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketEntity } from 'eventhub-infrastructure/dist/entities/TicketEntity';
import { DomainModule } from './domain.module';
import { ITicketRepository } from 'eventhub-domain';
import { TicketRepositoryTypeORM, TransactionService } from 'eventhub-infrastructure';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketEntity]),
    DomainModule,
  ],
  controllers: [TicketController],
  providers: [
    // Repositorio
    {
      provide: ITicketRepository,
      useClass: TicketRepositoryTypeORM,
    },
    
    // Casos de uso
    {
      provide: CreateTicketUseCase,
      useFactory: (ticketRepo, eventRepo, transactionService) => 
        new CreateTicketUseCase(ticketRepo, eventRepo, transactionService),
      inject: [ITicketRepository, 'EventRepository', TransactionService],
    },
    {
      provide: GetUserTicketsUseCase,
      useFactory: (ticketRepo) => new GetUserTicketsUseCase(ticketRepo),
      inject: [ITicketRepository],
    },
    {
      provide: ValidateTicketUseCase,
      useFactory: (ticketRepo) => new ValidateTicketUseCase(ticketRepo),
      inject: [ITicketRepository],
    },
  ],
  exports: [
    ITicketRepository,
    CreateTicketUseCase,
    GetUserTicketsUseCase,
    ValidateTicketUseCase,
  ],
})
export class TicketModule {} 