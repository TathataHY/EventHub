import { 
  Controller, 
  Post, 
  Headers, 
  Body, 
  RawBodyRequest, 
  Req, 
  HttpException, 
  HttpStatus, 
  UseGuards,
  Logger
} from '@nestjs/common';
import { Request } from 'express';
import { StripeWebhookService } from '../infrastructure-layer/services/stripe-webhook.service';
import { Public } from '../common/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhookController {
  private readonly logger = new Logger(WebhookController.name);

  constructor(private readonly stripeWebhookService: StripeWebhookService) {}

  @Public()
  @Post('stripe')
  @ApiOperation({ summary: 'Recibe eventos de webhook de Stripe' })
  @ApiResponse({ status: 200, description: 'Webhook procesado correctamente' })
  @ApiResponse({ status: 400, description: 'Error al procesar el webhook' })
  async handleStripeWebhook(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string,
  ) {
    try {
      if (!signature) {
        throw new HttpException('Falta la firma de Stripe', HttpStatus.BAD_REQUEST);
      }

      // El cuerpo de la petición debe estar disponible como raw body
      if (!request.rawBody) {
        throw new HttpException('No se pudo leer el cuerpo de la petición', HttpStatus.BAD_REQUEST);
      }

      const result = await this.stripeWebhookService.handleWebhookEvent(
        request.rawBody,
        signature
      );

      if (!result.success) {
        this.logger.error(`Error en webhook de Stripe: ${result.message}`);
        throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
      }

      return { received: true, message: result.message };
    } catch (error) {
      this.logger.error(`Error al procesar webhook: ${error.message}`);
      throw new HttpException(
        `Error al procesar webhook: ${error.message}`,
        HttpStatus.BAD_REQUEST
      );
    }
  }
}

/**
 * Nota: Para que Stripe pueda verificar la firma del webhook, 
 * necesitamos acceder al cuerpo de la solicitud sin procesar (raw body).
 * En NestJS, esto requiere configuración adicional en main.ts:
 * 
 * app.use(
 *   bodyParser.raw({ 
 *     type: 'application/json',
 *     verify: (req: any, res, buf) => {
 *       req.rawBody = buf;
 *     }
 *   })
 * );
 */ 