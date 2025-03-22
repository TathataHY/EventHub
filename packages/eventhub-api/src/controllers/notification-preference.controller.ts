import { 
  Controller, 
  Get, 
  Put, 
  Body, 
  UseGuards,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiTags
} from '@nestjs/swagger';
import { 
  GetNotificationPreferenceUseCase,
  UpdateNotificationPreferenceUseCase,
  DomainException
} from 'eventhub-application';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@ApiTags('preferencias-notificaciones')
@Controller('notification-preferences')
export class NotificationPreferenceController {
  constructor(
    private readonly getNotificationPreferenceUseCase: GetNotificationPreferenceUseCase,
    private readonly updateNotificationPreferenceUseCase: UpdateNotificationPreferenceUseCase
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener preferencias de notificación del usuario actual' })
  @ApiResponse({ status: 200, description: 'Preferencias obtenidas correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async getPreferences(@User() user: JwtPayload) {
    try {
      const preferences = await this.getNotificationPreferenceUseCase.execute({ 
        userId: user.userId 
      });
      
      return preferences;
    } catch (error) {
      if (error instanceof DomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      
      console.error('Error en getPreferences:', error);
      throw new HttpException('Error al obtener preferencias de notificación', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar preferencias de notificación del usuario actual' })
  @ApiResponse({ status: 200, description: 'Preferencias actualizadas correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async updatePreferences(
    @User() user: JwtPayload,
    @Body() updateDto: { channelPreferences: any, typePreferences: any }
  ) {
    try {
      const updatedPreferences = await this.updateNotificationPreferenceUseCase.execute({
        userId: user.userId,
        preferences: updateDto
      });
      
      return updatedPreferences;
    } catch (error) {
      if (error instanceof DomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      
      console.error('Error en updatePreferences:', error);
      throw new HttpException('Error al actualizar preferencias de notificación', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 