import { 
  Controller, 
  Get, 
  HttpException, 
  HttpStatus, 
  Param, 
  Post, 
  Put, 
  Body, 
  UseGuards,
  Query
} from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiTags, 
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { 
  GetUnreadCountUseCase,
  GetUserNotificationsUseCase,
  MarkAllNotificationsReadUseCase,
  MarkNotificationReadUseCase,
  DomainException,
  NotificationQueryOptions
} from 'eventhub-application';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { NotificationMapper } from '../infrastructure/mappers/NotificationMapper';

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
  @ApiResponse({ status: 200, description: 'Notificaciones obtenidas correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'isRead', required: false, type: Boolean })
  @ApiQuery({ name: 'type', required: false, type: String })
  async getUserNotifications(
    @User() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('isRead') isRead?: boolean,
    @Query('type') type?: string
  ) {
    try {
      const options: NotificationQueryOptions = {
        page: page || 1,
        limit: limit || 20,
        isRead,
        type
      };
      
      const notifications = await this.getUserNotificationsUseCase.execute({ 
        userId: user.userId,
        options
      });
      
      return notifications;
    } catch (error) {
      if (error instanceof DomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      
      console.error('Error en getUserNotifications:', error);
      throw new HttpException('Error al obtener las notificaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('unread')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener número de notificaciones no leídas' })
  @ApiResponse({ status: 200, description: 'Contador obtenido correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async getUnreadCount(
    @User() user: JwtPayload
  ) {
    try {
      const count = await this.getUnreadCountUseCase.execute({ userId: user.userId });
      return { count };
    } catch (error) {
      if (error instanceof DomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      
      console.error('Error en getUnreadCount:', error);
      throw new HttpException('Error al obtener el contador de notificaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id/read')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Marcar una notificación como leída' })
  @ApiResponse({ status: 200, description: 'Notificación marcada como leída correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Notificación no encontrada' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiParam({ name: 'id', description: 'ID de la notificación' })
  async markAsRead(
    @Param('id') id: string,
    @User() user: JwtPayload
  ) {
    try {
      await this.markNotificationReadUseCase.execute({ 
        notificationId: id, 
        userId: user.userId 
      });
      
      return { success: true, message: 'Notificación marcada como leída' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      if (error instanceof DomainException) {
        if (error.message.includes('no encontrada')) {
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        }
        
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      
      console.error('Error en markAsRead:', error);
      throw new HttpException('Error al marcar la notificación como leída', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put('read-all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Marcar todas las notificaciones como leídas' })
  @ApiResponse({ status: 200, description: 'Notificaciones marcadas como leídas correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async markAllAsRead(
    @User() user: JwtPayload
  ) {
    try {
      const count = await this.markAllNotificationsReadUseCase.execute({ userId: user.userId });
      return { success: true, message: `${count} notificaciones marcadas como leídas` };
    } catch (error) {
      if (error instanceof DomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      
      console.error('Error en markAllAsRead:', error);
      throw new HttpException('Error al marcar las notificaciones como leídas', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 