import { Controller, Get } from '@nestjs/common';
import { Public } from '../decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConfigurationService } from '../config/config.service';

@ApiTags('Diagnóstico')
@Controller('health')
export class HealthController {
  constructor(private readonly configService: ConfigurationService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Verificar estado del sistema' })
  @ApiResponse({
    status: 200,
    description: 'Sistema funcionando correctamente',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        timestamp: { type: 'string', example: '2023-08-28T15:30:45Z' },
        version: { type: 'string', example: '1.0.0' },
        environment: { type: 'string', example: 'development' },
        services: {
          type: 'object',
          properties: {
            api: { type: 'string', example: 'up' },
            database: { type: 'string', example: 'up' },
          }
        }
      }
    }
  })
  check() {
    // Obtener información del entorno
    const environment = this.configService.server.environment;
    
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment,
      services: {
        api: 'up',
        database: 'up'
      }
    };
  }
} 