import { 
  Body, 
  Controller, 
  Get, 
  HttpException, 
  HttpStatus, 
  Param, 
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
  ProcessPaymentUseCase,
  PaymentDto,
  ProcessPaymentParams,
  CheckPaymentStatusUseCase,
  RefundPaymentUseCase
} from 'eventhub-application';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('pagos')
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly checkPaymentStatusUseCase: CheckPaymentStatusUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Iniciar un nuevo proceso de pago' })
  @ApiResponse({ status: 201, description: 'Pago iniciado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos de pago inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiBody({ type: Object })
  async createPayment(
    @Body() paymentData: Omit<ProcessPaymentParams, 'userId'>,
    @User() user: JwtPayload
  ) {
    try {
      const params: ProcessPaymentParams = {
        ...paymentData,
        userId: user.userId
      };
      
      const result = await this.processPaymentUseCase.execute(params);
      return result;
    } catch (error) {
      console.error('Error al crear pago:', error);
      throw new HttpException(
        error.message || 'Error al procesar el pago',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener información de un pago' })
  @ApiResponse({ status: 200, description: 'Pago obtenido correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiParam({ name: 'id', description: 'ID del pago' })
  async getPaymentStatus(
    @Param('id') id: string,
    @User() user: JwtPayload
  ): Promise<PaymentDto> {
    try {
      return await this.checkPaymentStatusUseCase.execute({ 
        paymentId: id, 
        userId: user.userId 
      });
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        error.message || 'Error al obtener estado del pago',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Post(':id/refund')
  @Roles('ADMIN', 'ORGANIZER')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Reembolsar un pago' })
  @ApiResponse({ status: 200, description: 'Pago reembolsado correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Prohibido - No tiene permisos' })
  @ApiResponse({ status: 404, description: 'Pago no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiParam({ name: 'id', description: 'ID del pago a reembolsar' })
  @ApiQuery({ name: 'amount', required: false, type: Number, description: 'Monto a reembolsar (parcial)' })
  async refundPayment(
    @Param('id') id: string,
    @Query('amount') amount?: number,
    @User() user: JwtPayload
  ) {
    try {
      const result = await this.refundPaymentUseCase.execute({
        paymentId: id,
        amount,
        refundedBy: user.userId
      });
      
      return result;
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      
      if (error.message.includes('permisos') || error.message.includes('autorizado')) {
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      }
      
      throw new HttpException(
        error.message || 'Error al procesar el reembolso',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('verify')
  @ApiOperation({ summary: 'Verificar el resultado de un pago (callback)' })
  @ApiResponse({ status: 200, description: 'Pago verificado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiQuery({ name: 'session_id', required: true, type: String, description: 'ID de la sesión de pago' })
  async verifyPayment(
    @Query('session_id') sessionId: string
  ) {
    try {
      const result = await this.checkPaymentStatusUseCase.execute({ 
        providerPaymentId: sessionId 
      });
      
      return result;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al verificar el pago',
        HttpStatus.BAD_REQUEST
      );
    }
  }
} 