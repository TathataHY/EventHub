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
  UseGuards 
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
  UpdateEventUseCase 
} from 'eventhub-application';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

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
    private readonly cancelEventUseCase: CancelEventUseCase
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Crear un nuevo evento' })
  @ApiResponse({ status: 201, description: 'Evento creado', type: EventDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateEventDto })
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @User() user: JwtPayload
  ): Promise<EventDto> {
    try {
      return await this.createEventUseCase.execute(createEventDto, user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al crear el evento',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Obtener eventos filtrados' })
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
        organizerId,
        isActive,
        startDate,
        endDate,
        query,
        tags
      };

      return await this.getEventsUseCase.execute(
        filters,
        page ? Number(page) : 1,
        limit ? Number(limit) : 10
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener los eventos',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener evento por ID' })
  @ApiResponse({ status: 200, description: 'Evento encontrado', type: EventDto })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  @ApiParam({ name: 'id', type: String })
  async getEventById(@Param('id') id: string): Promise<EventDto> {
    try {
      return await this.getEventByIdUseCase.execute(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Evento no encontrado',
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar evento' })
  @ApiResponse({ status: 200, description: 'Evento actualizado', type: EventDto })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateEventDto })
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @User() user: JwtPayload
  ): Promise<EventDto> {
    try {
      return await this.updateEventUseCase.execute(id, updateEventDto, user.id);
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error.message.includes('organizador')) {
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(
        error.message || 'Error al actualizar el evento',
        HttpStatus.BAD_REQUEST
      );
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
      if (error.message.includes('no encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        error.message || 'Error al registrar asistente',
        HttpStatus.BAD_REQUEST
      );
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
      if (error.message.includes('no encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        error.message || 'Error al eliminar asistente',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancelar evento' })
  @ApiResponse({ status: 200, description: 'Evento cancelado', type: EventDto })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  @ApiResponse({ status: 403, description: 'No autorizado' })
  @ApiParam({ name: 'id', type: String })
  async cancelEvent(
    @Param('id') id: string,
    @User() user: JwtPayload
  ): Promise<EventDto> {
    try {
      return await this.cancelEventUseCase.execute(id, user.id);
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error.message.includes('organizador')) {
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(
        error.message || 'Error al cancelar el evento',
        HttpStatus.BAD_REQUEST
      );
    }
  }
} 