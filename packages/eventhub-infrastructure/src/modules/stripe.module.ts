import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripePaymentService } from '../services/stripe-payment.service';
import { StripeWebhookService } from '../services/stripe-webhook.service';

@Module({
  imports: [ConfigModule],
  providers: [StripePaymentService, StripeWebhookService],
  exports: [StripePaymentService, StripeWebhookService]
})
export class StripeModule {} 