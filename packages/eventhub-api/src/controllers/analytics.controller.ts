import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { GetEventStatisticsUseCase, EventStatistics } from '@eventhub/application/use-cases/analytics/GetEventStatisticsUseCase';
import { GetOrganizerDashboardUseCase, OrganizerDashboard } from '@eventhub/application/use-cases/analytics/GetOrganizerDashboardUseCase';
import { GetAdminDashboardUseCase, AdminDashboard } from '@eventhub/application/use-cases/analytics/GetAdminDashboardUseCase';

@ApiTags('Analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AnalyticsController {
  constructor(
    private readonly getEventStatisticsUseCase: GetEventStatisticsUseCase,
    private readonly getOrganizerDashboardUseCase: GetOrganizerDashboardUseCase,
    private readonly getAdminDashboardUseCase: GetAdminDashboardUseCase
  ) {}

  @Get('events/:id/statistics')
  @ApiOperation({ summary: 'Obtener estadísticas de un evento' })
  @ApiParam({ name: 'id', description: 'ID del evento' })
  @ApiResponse({ status: 200, description: 'Estadísticas del evento obtenidas exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado para ver estas estadísticas' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  @Roles('organizer', 'admin')
  async getEventStatistics(
    @Param('id') eventId: string,
    @Request() req: any
  ): Promise<EventStatistics> {
    return this.getEventStatisticsUseCase.execute({
      eventId,
      organizerId: req.user.id
    });
  }

  @Get('organizer/dashboard')
  @ApiOperation({ summary: 'Obtener panel de control del organizador' })
  @ApiQuery({ name: 'period', required: false, enum: ['week', 'month', 'year', 'all'] })
  @ApiResponse({ status: 200, description: 'Panel de control obtenido exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @Roles('organizer')
  async getOrganizerDashboard(
    @Query('period') period: 'week' | 'month' | 'year' | 'all' = 'month',
    @Request() req: any
  ): Promise<OrganizerDashboard> {
    return this.getOrganizerDashboardUseCase.execute({
      organizerId: req.user.id,
      period
    });
  }

  @Get('admin/dashboard')
  @ApiOperation({ summary: 'Obtener panel de control del administrador' })
  @ApiQuery({ name: 'period', required: false, enum: ['week', 'month', 'year', 'all'] })
  @ApiResponse({ status: 200, description: 'Panel de control obtenido exitosamente' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @Roles('admin')
  async getAdminDashboard(
    @Query('period') period: 'week' | 'month' | 'year' | 'all' = 'month'
  ): Promise<AdminDashboard> {
    return this.getAdminDashboardUseCase.execute({ period });
  }
} 