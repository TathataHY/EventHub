import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  HttpException, 
  HttpStatus, 
  Param, 
  Patch, 
  Post, 
  Query, 
  UseGuards, 
  Put, 
  UploadedFile, 
  UseInterceptors
} from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiTags, 
  ApiParam, 
  ApiQuery, 
  ApiBody 
} from '@nestjs/swagger';
import { 
  AddAttendeeUseCase, 
  CancelEventUseCase, 
  CreateEventDto, 
  CreateEventUseCase, 
  EventDto, 
  EventFilters, 
  GetEventByIdUseCase, 
  GetEventsUseCase, 
  RemoveAttendeeUseCase, 
  UpdateEventDto, 
  UpdateEventUseCase,
  UploadEventImageUseCase,
  NotFoundException,
  DomainException,
  EventMapper
} from 'eventhub-application';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { Roles } from '../common/decorators/roles.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { Public } from '../common/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExceptionHandlerService } from '../common/services/exception-handler.service';

// Definir el tipo JwtPayload para corregir errores
interface ExtendedJwtPayload extends JwtPayload {
  userId: string;
}

// Definir el tipo para Express.Multer.File
declare global {
  namespace Express {
    namespace Multer {
      interface File {
        buffer: Buffer;
        originalname: string;
        mimetype: string;
      }
    }
  }
}

@ApiTags('eventos')
@Controller('events')
export class EventController {
  constructor(
    private readonly createEventUseCase: CreateEventUseCase,
    private readonly updateEventUseCase: UpdateEventUseCase,
    private readonly getEventByIdUseCase: GetEventByIdUseCase,
    private readonly getEventsUseCase: GetEventsUseCase,
    private readonly addAttendeeUseCase: AddAttendeeUseCase,
    private readonly removeAttendeeUseCase: RemoveAttendeeUseCase,
    private readonly cancelEventUseCase: CancelEventUseCase,
    private readonly uploadEventImageUseCase: UploadEventImageUseCase,
    private readonly exceptionHandler: ExceptionHandlerService
  ) {}

  @Post()
  @Roles('ADMIN', 'ORGANIZER')
  @RequirePermissions('events:create')
  @ApiOperation({ summary: 'Crear un nuevo evento' })
  @ApiResponse({ status: 201, description: 'Evento creado', type: EventDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateEventDto })
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @User() user: ExtendedJwtPayload
  ): Promise<EventDto> {
    try {
      createEventDto.organizerId = user.userId;
      
      const event = await this.createEventUseCase.execute(createEventDto);
      return event;
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al crear el evento');
    }
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Obtener todos los eventos' })
  @ApiResponse({ status: 200, description: 'Lista de eventos' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'organizerId', required: false, type: String })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  @ApiQuery({ name: 'startDate', required: false, type: Date })
  @ApiQuery({ name: 'endDate', required: false, type: Date })
  @ApiQuery({ name: 'query', required: false, type: String })
  @ApiQuery({ name: 'tags', required: false, type: [String] })
  async getEvents(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('organizerId') organizerId?: string,
    @Query('isActive') isActive?: boolean,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @Query('query') query?: string,
    @Query('tags') tags?: string[]
  ) {
    try {
      const filters: EventFilters = {
        page: page || 1,
        limit: limit || 10,
        organizerId,
        isActive,
        startDate,
        endDate,
        query,
        tags
      };
      
      const result = await this.getEventsUseCase.execute(filters);
      return result;
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al buscar eventos');
    }
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener un evento por ID' })
  @ApiResponse({ status: 200, description: 'Evento obtenido correctamente' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiParam({ name: 'id', description: 'ID del evento' })
  async getEventById(@Param('id') id: string): Promise<EventDto> {
    try {
      const event = await this.getEventByIdUseCase.execute({ id });
      
      if (!event) {
        throw new NotFoundException('Evento', id);
      }
      
      return event;
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al obtener el evento');
    }
  }

  @Put(':id')
  @Roles('ADMIN', 'ORGANIZER')
  @RequirePermissions('events:update')
  @ApiOperation({ summary: 'Actualizar un evento' })
  @ApiResponse({ status: 200, description: 'Evento actualizado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Prohibido - No es el organizador' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiParam({ name: 'id', description: 'ID del evento a actualizar' })
  @ApiBody({ type: Object })
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @User() user: ExtendedJwtPayload
  ): Promise<EventDto> {
    try {
      // Agregar el ID al DTO
      const dto = { 
        ...updateEventDto, 
        id 
      };
      
      const event = await this.updateEventUseCase.execute(dto, user.userId);
      return event;
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al actualizar el evento');
    }
  }

  @Post(':id/attendees/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Registrar asistente a un evento' })
  @ApiResponse({ status: 200, description: 'Asistente registrado', type: EventDto })
  @ApiResponse({ status: 404, description: 'Evento o usuario no encontrado' })
  @ApiResponse({ status: 400, description: 'Error al registrar asistente' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'userId', type: String })
  async addAttendee(
    @Param('id') eventId: string,
    @Param('userId') userId: string
  ): Promise<EventDto> {
    try {
      return await this.addAttendeeUseCase.execute(eventId, userId);
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al registrar asistente');
    }
  }

  @Delete(':id/attendees/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Eliminar asistente de un evento' })
  @ApiResponse({ status: 200, description: 'Asistente eliminado', type: EventDto })
  @ApiResponse({ status: 404, description: 'Evento o usuario no encontrado' })
  @ApiResponse({ status: 400, description: 'Error al eliminar asistente' })
  @ApiParam({ name: 'id', type: String })
  @ApiParam({ name: 'userId', type: String })
  async removeAttendee(
    @Param('id') eventId: string,
    @Param('userId') userId: string
  ): Promise<EventDto> {
    try {
      return await this.removeAttendeeUseCase.execute(eventId, userId);
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al eliminar asistente');
    }
  }

  @Patch(':id/cancel')
  @Roles('ADMIN', 'ORGANIZER')
  @RequirePermissions('events:cancel')
  @ApiOperation({ summary: 'Cancelar un evento' })
  @ApiResponse({ status: 200, description: 'Evento cancelado', type: EventDto })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  @ApiResponse({ status: 403, description: 'No autorizado para cancelar este evento' })
  @ApiParam({ name: 'id', type: String })
  async cancelEvent(
    @Param('id') id: string,
    @User() user: ExtendedJwtPayload
  ): Promise<EventDto> {
    try {
      return await this.cancelEventUseCase.execute(id, user.userId);
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al cancelar el evento');
    }
  }

  @Post(':id/images')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: 'Subir imagen para un evento' })
  @ApiResponse({ status: 200, description: 'Imagen subida correctamente' })
  @ApiResponse({ status: 400, description: 'Error al subir la imagen' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Prohibido - No es el organizador' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  @ApiParam({ name: 'id', description: 'ID del evento' })
  async uploadEventImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @User() user: ExtendedJwtPayload
  ): Promise<EventDto> {
    try {
      return await this.uploadEventImageUseCase.execute({
        eventId: id,
        image: file.buffer,
        filename: file.originalname,
        mimetype: file.mimetype,
        userId: user.userId
      });
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al subir la imagen');
    }
  }
} 