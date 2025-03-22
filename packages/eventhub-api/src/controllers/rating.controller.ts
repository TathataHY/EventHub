import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  Delete,
  Put
} from '@nestjs/common';
import { 
  CreateRatingUseCase,
  GetEventRatingsUseCase,
  GetUserRatingUseCase,
  UpdateRatingUseCase,
  DeleteRatingUseCase,
  RatingDTO,
  CreateRatingDTO,
  UpdateRatingDTO,
  EventRatingsSummaryDTO,
  GetEventRatingsRequestDTO,
  GetUserRatingRequestDTO,
  UpdateRatingRequestDTO,
  DeleteRatingRequestDTO
} from 'eventhub-application';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { 
  ApiTags, 
  ApiOperation, 
  ApiParam, 
  ApiResponse, 
  ApiBearerAuth,
  ApiBody 
} from '@nestjs/swagger';
import { ExceptionHandlerService } from '../common/services/exception-handler.service';

// DTO para Swagger
class CreateRatingBody {
  score: number;
  review?: string;
}

class UpdateRatingBody {
  score?: number;
  review?: string;
}

@ApiTags('ratings')
@Controller('events/:eventId/ratings')
export class RatingController {
  constructor(
    private readonly createRatingUseCase: CreateRatingUseCase,
    private readonly getEventRatingsUseCase: GetEventRatingsUseCase,
    private readonly getUserRatingUseCase: GetUserRatingUseCase,
    private readonly updateRatingUseCase: UpdateRatingUseCase,
    private readonly deleteRatingUseCase: DeleteRatingUseCase,
    private readonly exceptionHandler: ExceptionHandlerService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear o actualizar una valoración para un evento' })
  @ApiParam({ name: 'eventId', description: 'ID del evento' })
  @ApiBody({ type: CreateRatingBody })
  @ApiResponse({ status: 201, description: 'Valoración creada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  async createRating(
    @Param('eventId') eventId: string,
    @Body() body: CreateRatingBody,
    @Request() req: any
  ): Promise<RatingDTO> {
    try {
      const dto: CreateRatingDTO = {
        eventId,
        userId: req.user.userId,
        score: body.score,
        review: body.review
      };
      
      return await this.createRatingUseCase.execute(dto);
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al crear la valoración');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener valoraciones de un evento' })
  @ApiParam({ name: 'eventId', description: 'ID del evento' })
  @ApiResponse({ status: 200, description: 'Resumen de valoraciones obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  async getEventRatings(
    @Param('eventId') eventId: string
  ): Promise<EventRatingsSummaryDTO> {
    try {
      const dto: GetEventRatingsRequestDTO = { eventId };
      return await this.getEventRatingsUseCase.execute(dto);
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al obtener las valoraciones');
    }
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener la valoración del usuario actual para un evento' })
  @ApiParam({ name: 'eventId', description: 'ID del evento' })
  @ApiResponse({ status: 200, description: 'Valoración obtenida correctamente' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  async getUserRating(
    @Param('eventId') eventId: string,
    @Request() req: any
  ): Promise<RatingDTO | null> {
    try {
      const dto: GetUserRatingRequestDTO = {
        eventId,
        userId: req.user.userId
      };
      
      return await this.getUserRatingUseCase.execute(dto);
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al obtener la valoración del usuario');
    }
  }

  @Put(':ratingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar una valoración' })
  @ApiParam({ name: 'eventId', description: 'ID del evento' })
  @ApiParam({ name: 'ratingId', description: 'ID de la valoración' })
  @ApiBody({ type: UpdateRatingBody })
  @ApiResponse({ status: 200, description: 'Valoración actualizada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido' })
  @ApiResponse({ status: 404, description: 'Valoración no encontrada' })
  async updateRating(
    @Param('ratingId') ratingId: string,
    @Body() body: UpdateRatingBody,
    @Request() req: any
  ): Promise<RatingDTO> {
    try {
      const dto: UpdateRatingRequestDTO = {
        id: ratingId,
        userId: req.user.userId,
        data: body
      };
      
      return await this.updateRatingUseCase.execute(dto);
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al actualizar la valoración');
    }
  }

  @Delete(':ratingId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar una valoración' })
  @ApiParam({ name: 'eventId', description: 'ID del evento' })
  @ApiParam({ name: 'ratingId', description: 'ID de la valoración' })
  @ApiResponse({ status: 200, description: 'Valoración eliminada correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido' })
  @ApiResponse({ status: 404, description: 'Valoración no encontrada' })
  async deleteRating(
    @Param('ratingId') ratingId: string,
    @Request() req: any
  ): Promise<void> {
    try {
      const dto: DeleteRatingRequestDTO = {
        id: ratingId,
        userId: req.user.userId
      };
      
      await this.deleteRatingUseCase.execute(dto);
    } catch (error) {
      this.exceptionHandler.handleException(error, 'Error al eliminar la valoración');
    }
  }
} 