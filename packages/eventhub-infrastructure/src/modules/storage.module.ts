import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3StorageService } from '../services/s3-storage.service';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'StorageService',
      useClass: S3StorageService
    }
  ],
  exports: ['StorageService']
})
export class StorageModule {} 