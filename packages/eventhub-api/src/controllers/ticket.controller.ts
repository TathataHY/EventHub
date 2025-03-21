import { Controller, Post, Get, Body, Param, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { 
  CreateTicketDto, 
  CreateTicketUseCase, 
  ValidateTicketUseCase,
  GetUserTicketsUseCase,
  TicketDto,
  DomainException
} from '@eventhub/application';
import { User } from '../common/decorators/user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Tickets')
@Controller('tickets')
export class TicketController {
  constructor(
    private readonly createTicketUseCase: CreateTicketUseCase,
    private readonly validateTicketUseCase: ValidateTicketUseCase,
    private readonly getUserTicketsUseCase: GetUserTicketsUseCase
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo ticket' })
  @ApiResponse({ status: 201, description: 'Ticket creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Capacidad del evento excedida' })
  @ApiResponse({ status: 404, description: 'Evento no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiBody({ type: Object })
  async createTicket(
    @Body() createTicketDto: CreateTicketDto,
    @User() user: JwtPayload
  ) {
    try {
      // Asignar el ID del usuario al DTO
      const ticketData = {
        ...createTicketDto,
        userId: user.userId
      };
      
      const ticket = await this.createTicketUseCase.execute(ticketData);
      return ticket;
    } catch (error) {
      if (error instanceof DomainException) {
        // Mapear errores específicos del dominio a códigos HTTP apropiados
        if (error.message.includes('capacidad')) {
          throw new HttpException(error.message, HttpStatus.FORBIDDEN);
        } else if (error.message.includes('no encontrado')) {
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        } else {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }
      
      console.error('Error en createTicket:', error);
      throw new HttpException('Error al crear el ticket', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('validate/:code')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validar un ticket por su código' })
  @ApiParam({ name: 'code', description: 'Código del ticket' })
  @ApiResponse({ status: 200, description: 'Resultado de la validación' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async validateTicket(
    @Param('code') code: string
  ) {
    return await this.validateTicketUseCase.execute(code);
  }

  @Post('validate/:code/use')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Marcar un ticket como usado' })
  @ApiParam({ name: 'code', description: 'Código del ticket' })
  @ApiResponse({ status: 200, description: 'Ticket marcado como usado' })
  @ApiResponse({ status: 400, description: 'Error en el procesamiento' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async useTicket(
    @Param('code') code: string
  ) {
    return await this.validateTicketUseCase.markAsUsed(code);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener tickets del usuario actual' })
  @ApiQuery({ name: 'onlyValid', description: 'Solo mostrar tickets válidos', required: false, type: Boolean })
  @ApiQuery({ name: 'page', description: 'Número de página', required: false, type: Number })
  @ApiQuery({ name: 'perPage', description: 'Elementos por página', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Lista de tickets' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getUserTickets(
    @Req() request: any,
    @Query('onlyValid') onlyValid?: boolean,
    @Query('page') page?: number,
    @Query('perPage') perPage?: number
  ) {
    const userId = request.user.userId;
    return await this.getUserTicketsUseCase.execute(
      userId,
      onlyValid === 'true',
      page ? parseInt(page as any, 10) : undefined,
      perPage ? parseInt(perPage as any, 10) : undefined
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener detalles de un ticket' })
  @ApiParam({ name: 'id', description: 'ID del ticket' })
  @ApiResponse({ status: 200, description: 'Detalles del ticket' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
  async getTicket(
    @Param('id') id: string
  ) {
    // Este endpoint requeriría un caso de uso adicional
    // para obtener un ticket específico. Por ahora, devolvemos un mensaje.
    return { message: `Endpoint para obtener ticket con ID ${id} pendiente de implementación` };
  }

  @Get('my-tickets')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener tickets del usuario actual' })
  @ApiResponse({ status: 200, description: 'Lista de tickets obtenida correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMyTickets(
    @User() user: JwtPayload,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    try {
      const options = {
        userId: user.userId,
        page: page || 1,
        perPage: limit || 10
      };
      
      const result = await this.getUserTicketsUseCase.execute(options);
      return result;
    } catch (error) {
      if (error instanceof DomainException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      }
      
      console.error('Error en getMyTickets:', error);
      throw new HttpException('Error al obtener los tickets', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post(':code/validate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'ORGANIZER')
  @ApiOperation({ summary: 'Validar un ticket por su código' })
  @ApiResponse({ status: 200, description: 'Ticket validado correctamente' })
  @ApiResponse({ status: 400, description: 'Código de ticket inválido' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos para validar tickets' })
  @ApiResponse({ status: 404, description: 'Ticket no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiParam({ name: 'code', description: 'Código único del ticket' })
  async validateTicketAdmin(
    @Param('code') code: string,
    @User() user: JwtPayload
  ) {
    try {
      const result = await this.validateTicketUseCase.execute({ 
        code, 
        validatorId: user.userId 
      });
      
      return { 
        success: true, 
        message: 'Ticket validado correctamente',
        ticket: result
      };
    } catch (error) {
      if (error instanceof DomainException) {
        if (error.message.includes('no encontrado')) {
          throw new HttpException(error.message, HttpStatus.NOT_FOUND);
        } else if (error.message.includes('ya ha sido usado') || error.message.includes('expirado')) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        } else {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
      }
      
      console.error('Error en validateTicket:', error);
      throw new HttpException('Error al validar el ticket', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 