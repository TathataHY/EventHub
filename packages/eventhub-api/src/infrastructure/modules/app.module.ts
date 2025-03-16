import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth.module';
import { EventModule } from './event.module';
import { NotificationModule } from './notification.module';
import { UserModule } from './user.module';
import { TestController } from '../controllers/test.controller';
import { HealthController } from '../controllers/health.controller';
import { ConfigurationService } from '../config/config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || 'password',
      database: process.env.DB_NAME || 'eventhub',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV !== 'production',
    }),
    AuthModule,
    UserModule,
    EventModule,
    NotificationModule,
  ],
  controllers: [TestController, HealthController],
  providers: [ConfigurationService],
})
export class AppModule {} 