import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  Request
} from '@nestjs/common';
import { 
  CreateCommentUseCase,
  GetEventCommentsUseCase,
  CommentDTO,
  CreateCommentDTO
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

// DTO usado para Swagger
class CreateCommentBody {
  content: string;
  parentId?: string;
}

@ApiTags('comments')
@Controller('events/:eventId/comments')
export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly getEventCommentsUseCase: GetEventCommentsUseCase,
    private readonly exceptionHandler: ExceptionHandlerService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un comentario para un evento' })
  @ApiParam({ name: 'eventId', description: 'ID del evento' })
  @ApiBody({ type: CreateCommentBody })
  @ApiResponse({ status: 201, description: 'Comentario creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  async createComment(
    @Param('eventId') eventId: string,
    @Body() commentBody: CreateCommentBody,
    @Request() req: any
  ): Promise<CommentDTO> {
    try {
      const createCommentDto: CreateCommentDTO = {
        eventId,
        userId: req.user.userId,
        content: commentBody.content,
        parentId: commentBody.parentId,
      };
      
      return await this.createCommentUseCase.execute(createCommentDto);
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al crear el comentario');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener comentarios de un evento' })
  @ApiParam({ name: 'eventId', description: 'ID del evento' })
  @ApiResponse({ status: 200, description: 'Lista de comentarios obtenida correctamente' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  async getEventComments(
    @Param('eventId') eventId: string
  ): Promise<CommentDTO[]> {
    try {
      return await this.getEventCommentsUseCase.execute({
        eventId,
        includeReplies: true
      });
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al obtener los comentarios');
    }
  }
} 