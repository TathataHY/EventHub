import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NodemailerService } from '../services/nodemailer.service';
import { EmailService } from 'eventhub-application';

@Module({
  imports: [
    ConfigModule,
  ],
  providers: [
    {
      provide: EmailService,
      useClass: NodemailerService,
    },
  ],
  exports: [
    EmailService,
  ],
})
export class EmailModule {} 