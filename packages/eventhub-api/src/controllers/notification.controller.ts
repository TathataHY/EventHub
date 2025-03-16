import { 
  Controller, 
  Get, 
  HttpException, 
  HttpStatus, 
  Param, 
  Post, 
  Put, 
  Body, 
  UseGuards 
} from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiTags, 
  ApiParam 
} from '@nestjs/swagger';
import { 
  GetUnreadCountUseCase,
  GetUserNotificationsUseCase,
  MarkAllNotificationsReadUseCase,
  MarkNotificationReadUseCase
} from 'eventhub-application';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@ApiTags('notificaciones')
@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly getUserNotificationsUseCase: GetUserNotificationsUseCase,
    private readonly markNotificationReadUseCase: MarkNotificationReadUseCase,
    private readonly markAllNotificationsReadUseCase: MarkAllNotificationsReadUseCase,
    private readonly getUnreadCountUseCase: GetUnreadCountUseCase
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener notificaciones del usuario actual' })
  @ApiResponse({ status: 200, description: 'Lista de notificaciones' })
  async getUserNotifications(
    @User() user: JwtPayload
  ) {
    try {
      return await this.getUserNotificationsUseCase.execute(user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener las notificaciones',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('unread')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener el número de notificaciones no leídas' })
  @ApiResponse({ status: 200, description: 'Número de notificaciones no leídas' })
  async getUnreadCount(
    @User() user: JwtPayload
  ) {
    try {
      const count = await this.getUnreadCountUseCase.execute(user.id);
      return { count };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener el conteo de notificaciones',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  @ApiResponse({ status: 200, description: 'Notificación marcada como leída' })
  @ApiParam({ name: 'id', type: String })
  async markAsRead(
    @Param('id') id: string,
    @User() user: JwtPayload
  ) {
    try {
      const success = await this.markNotificationReadUseCase.execute(id, user.id);
      return { success, message: 'Notificación marcada como leída' };
    } catch (error) {
      if (error.message.includes('no encontrada')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error.message.includes('no pertenece')) {
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(
        error.message || 'Error al marcar la notificación como leída',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put('read-all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Marcar todas las notificaciones como leídas' })
  @ApiResponse({ status: 200, description: 'Todas las notificaciones marcadas como leídas' })
  async markAllAsRead(
    @User() user: JwtPayload
  ) {
    try {
      const count = await this.markAllNotificationsReadUseCase.execute(user.id);
      return { 
        success: true, 
        count,
        message: count > 0 
          ? `${count} notificaciones marcadas como leídas` 
          : 'No había notificaciones sin leer'
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al marcar las notificaciones como leídas',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 