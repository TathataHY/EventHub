import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  Request
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';
import {
  GetUserNotificationsUseCase,
  MarkNotificationReadUseCase,
  MarkAllNotificationsReadUseCase,
  GetUnreadCountUseCase,
  GetNotificationPreferenceUseCase,
  UpdateNotificationPreferenceUseCase,
  NotificationDto,
  NotificationPreferenceDto,
  UpdateNotificationPreferenceDto
} from 'eventhub-application';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('Notificaciones')
@Controller('api/notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(
    private readonly getUserNotificationsUseCase: GetUserNotificationsUseCase,
    private readonly markNotificationReadUseCase: MarkNotificationReadUseCase,
    private readonly markAllNotificationsReadUseCase: MarkAllNotificationsReadUseCase,
    private readonly getUnreadCountUseCase: GetUnreadCountUseCase,
    private readonly getNotificationPreferenceUseCase: GetNotificationPreferenceUseCase,
    private readonly updateNotificationPreferenceUseCase: UpdateNotificationPreferenceUseCase
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener notificaciones del usuario' })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones',
    type: [NotificationDto]
  })
  async getNotifications(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('read') read?: boolean
  ) {
    const userId = req.user.id;
    return await this.getUserNotificationsUseCase.execute(userId, { page, limit, read });
  }

  @Get('unread/count')
  @ApiOperation({ summary: 'Obtener cantidad de notificaciones no leídas' })
  @ApiResponse({
    status: 200,
    description: 'Cantidad de notificaciones no leídas',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' }
      }
    }
  })
  async getUnreadCount(@Request() req) {
    const userId = req.user.id;
    return await this.getUnreadCountUseCase.execute(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  @ApiParam({ name: 'id', description: 'ID de la notificación' })
  @ApiResponse({
    status: 200,
    description: 'Notificación marcada como leída',
    type: NotificationDto
  })
  async markAsRead(@Param('id') id: string, @Request() req) {
    const userId = req.user.id;
    return await this.markNotificationReadUseCase.execute(id, userId);
  }

  @Patch('read/all')
  @ApiOperation({ summary: 'Marcar todas las notificaciones como leídas' })
  @ApiResponse({
    status: 200,
    description: 'Todas las notificaciones marcadas como leídas',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' }
      }
    }
  })
  async markAllAsRead(@Request() req) {
    const userId = req.user.id;
    return await this.markAllNotificationsReadUseCase.execute(userId);
  }

  @Get('preferences')
  @ApiOperation({ summary: 'Obtener preferencias de notificación' })
  @ApiResponse({
    status: 200,
    description: 'Preferencias de notificación',
    type: NotificationPreferenceDto
  })
  async getPreferences(@Request() req) {
    const userId = req.user.id;
    return await this.getNotificationPreferenceUseCase.execute(userId);
  }

  @Patch('preferences')
  @ApiOperation({ summary: 'Actualizar preferencias de notificación' })
  @ApiBody({ type: UpdateNotificationPreferenceDto })
  @ApiResponse({
    status: 200,
    description: 'Preferencias actualizadas',
    type: NotificationPreferenceDto
  })
  async updatePreferences(
    @Request() req,
    @Body() dto: UpdateNotificationPreferenceDto
  ) {
    const userId = req.user.id;
    return await this.updateNotificationPreferenceUseCase.execute(userId, dto);
  }
} 