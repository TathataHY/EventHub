import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PaymentEntity } from '../entities/payment.entity';
import { TypeOrmPaymentRepository } from '../repositories/payment.repository';
import { ProcessPaymentUseCase } from '@eventhub/application/use-cases/payment/ProcessPaymentUseCase';
import { GetPaymentByIdUseCase } from '@eventhub/application/use-cases/payment/GetPaymentByIdUseCase';
import { GetUserPaymentsUseCase } from '@eventhub/application/use-cases/payment/GetUserPaymentsUseCase';
import { RefundPaymentUseCase } from '@eventhub/application/use-cases/payment/RefundPaymentUseCase';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity]),
    ConfigModule
  ],
  providers: [
    {
      provide: 'PaymentRepository',
      useClass: TypeOrmPaymentRepository
    },
    {
      provide: ProcessPaymentUseCase,
      useFactory: (paymentRepository) => {
        return new ProcessPaymentUseCase(paymentRepository);
      },
      inject: ['PaymentRepository']
    },
    {
      provide: GetPaymentByIdUseCase,
      useFactory: (paymentRepository) => {
        return new GetPaymentByIdUseCase(paymentRepository);
      },
      inject: ['PaymentRepository']
    },
    {
      provide: GetUserPaymentsUseCase,
      useFactory: (paymentRepository) => {
        return new GetUserPaymentsUseCase(paymentRepository);
      },
      inject: ['PaymentRepository']
    },
    {
      provide: RefundPaymentUseCase,
      useFactory: (paymentRepository) => {
        return new RefundPaymentUseCase(paymentRepository);
      },
      inject: ['PaymentRepository']
    }
  ],
  exports: [
    'PaymentRepository',
    ProcessPaymentUseCase,
    GetPaymentByIdUseCase,
    GetUserPaymentsUseCase,
    RefundPaymentUseCase
  ]
})
export class PaymentModule {} 