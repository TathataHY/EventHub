import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationGateway } from '../common/gateways/notification.gateway';
import { JwtService } from '../common/services/jwt.service';

/**
 * Módulo que integra los gateways de websocket
 */
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'secretKey'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '1d'),
        },
      }),
    }),
  ],
  providers: [NotificationGateway, JwtService],
  exports: [NotificationGateway],
})
export class WebsocketModule {} 