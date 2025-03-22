import { Module, Global } from '@nestjs/common';
import { CacheService } from 'eventhub-infrastructure';

/**
 * Módulo global para proveer el servicio de caché a toda la aplicación
 */
@Global()
@Module({
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {} 