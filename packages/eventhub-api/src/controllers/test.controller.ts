import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('test')
@Controller('test')
export class TestController {
  
  @Get()
  @Public()
  @ApiOperation({ summary: 'Verificar que la API está funcionando' })
  @ApiResponse({ status: 200, description: 'API activa y funcionando' })
  healthCheck() {
    return {
      status: 'ok',
      message: 'API activa y funcionando',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development'
    };
  }
  
  @Get('version')
  @Public()
  @ApiOperation({ summary: 'Obtener la versión de la API' })
  @ApiResponse({ status: 200, description: 'Versión de la API' })
  getVersion() {
    return {
      version: '1.0.0',
      name: 'EventHub API',
      description: 'API para la plataforma de gestión de eventos EventHub',
      environment: process.env.NODE_ENV || 'development'
    };
  }
} 