import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth
} from '@nestjs/swagger';
import {
  CreateEventUseCase,
  UpdateEventUseCase,
  GetEventByIdUseCase,
  GetEventsUseCase,
  AddAttendeeUseCase,
  RemoveAttendeeUseCase,
  CancelEventUseCase,
  CreateEventDto,
  UpdateEventDto,
  EventDto,
  EventFilters
} from 'eventhub-application';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';

@ApiTags('Eventos')
@Controller('api/events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
  @ApiOperation({ summary: 'Crear un nuevo evento' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Evento creado exitosamente',
    type: EventDto
  })
  async createEvent(@Body() createEventDto: CreateEventDto, @Request() req) {
    return await this.createEventUseCase.execute(createEventDto, req.user.id);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Obtener lista de eventos con filtros y paginación' })
  @ApiResponse({ 
    status: 200, 
    description: 'Lista de eventos',
    schema: {
      type: 'object',
      properties: {
        events: { 
          type: 'array',
          items: { 
            $ref: '#/components/schemas/EventDto' 
          } 
        },
        total: { 
          type: 'number',
          description: 'Total de eventos' 
        }
      }
    }
  })
  async getEvents(@Query() filters: EventFilters) {
    return await this.getEventsUseCase.execute(filters);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener un evento por su ID' })
  @ApiParam({ name: 'id', description: 'ID del evento' })
  @ApiResponse({ 
    status: 200, 
    description: 'Evento encontrado',
    type: EventDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Evento no encontrado' 
  })
  async getEventById(@Param('id') id: string) {
    return await this.getEventByIdUseCase.execute(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un evento' })
  @ApiParam({ name: 'id', description: 'ID del evento' })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Evento actualizado',
    type: EventDto
  })
  @ApiResponse({ 
    status: 403, 
    description: 'No tiene permiso para actualizar este evento' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Evento no encontrado' 
  })
  async updateEvent(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
    @Request() req
  ) {
    return await this.updateEventUseCase.execute(id, updateEventDto, req.user.id);
  }

  @Post(':id/attendees')
  @ApiOperation({ summary: 'Registrarse como asistente a un evento' })
  @ApiParam({ name: 'id', description: 'ID del evento' })
  @ApiResponse({ 
    status: 200, 
    description: 'Registro exitoso',
    type: EventDto
  })
  async addAttendee(@Param('id') eventId: string, @Request() req) {
    return await this.addAttendeeUseCase.execute(eventId, req.user.id);
  }

  @Delete(':id/attendees')
  @ApiOperation({ summary: 'Cancelar asistencia a un evento' })
  @ApiParam({ name: 'id', description: 'ID del evento' })
  @ApiResponse({ 
    status: 200, 
    description: 'Cancelación exitosa',
    type: EventDto
  })
  async removeAttendee(@Param('id') eventId: string, @Request() req) {
    return await this.removeAttendeeUseCase.execute(eventId, req.user.id);
  }

  @Put(':id/cancel')
  @ApiOperation({ summary: 'Cancelar un evento' })
  @ApiParam({ name: 'id', description: 'ID del evento' })
  @ApiResponse({ 
    status: 200, 
    description: 'Evento cancelado',
    type: EventDto
  })
  @ApiResponse({ 
    status: 403, 
    description: 'No tiene permiso para cancelar este evento' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Evento no encontrado' 
  })
  async cancelEvent(@Param('id') id: string, @Request() req) {
    return await this.cancelEventUseCase.execute(id, req.user.id);
  }
} 