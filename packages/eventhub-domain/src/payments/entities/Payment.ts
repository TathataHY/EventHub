import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../../../core/interfaces/Entity';
import { PaymentStatus, PaymentStatusEnum } from '../value-objects/PaymentStatus';
import { PaymentProvider, PaymentProviderEnum } from '../value-objects/PaymentProvider';
import { PaymentCreateException } from '../exceptions/PaymentCreateException';
import { PaymentUpdateException } from '../exceptions/PaymentUpdateException';

/**
 * Entidad de pago en el dominio
 * Implementa Entity para seguir el patrón común de entidades
 */
export class Payment implements Entity<string> {
  readonly id: string;
  readonly userId: string;
  readonly eventId: string;
  readonly amount: number;
  readonly currency: string;
  readonly status: PaymentStatus;
  readonly provider: PaymentProvider;
  readonly providerPaymentId: string | null;
  readonly description: string | null;
  readonly metadata: Record<string, any> | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  /**
   * Constructor privado de Payment
   * Se debe usar el método estático create() para crear instancias
   */
  private constructor(props: PaymentProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.eventId = props.eventId;
    this.amount = props.amount;
    this.currency = props.currency;
    this.status = props.status;
    this.provider = props.provider;
    this.providerPaymentId = props.providerPaymentId;
    this.description = props.description;
    this.metadata = props.metadata;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Crea un nuevo pago validando los datos
   * @param props Propiedades para crear el pago
   * @returns Nueva instancia de Payment
   * @throws PaymentCreateException si los datos no son válidos
   */
  static create(props: PaymentCreateProps): Payment {
    const id = props.id || uuidv4();
    
    // Validar userId
    if (!props.userId) {
      throw new PaymentCreateException('El ID del usuario es requerido');
    }

    // Validar eventId
    if (!props.eventId) {
      throw new PaymentCreateException('El ID del evento es requerido');
    }

    // Validar amount
    if (props.amount <= 0) {
      throw new PaymentCreateException('El monto del pago debe ser mayor a cero');
    }

    // Validar currency
    if (!props.currency) {
      throw new PaymentCreateException('La moneda del pago es requerida');
    }

    // Convertir o crear status
    let status: PaymentStatus;
    if (props.status instanceof PaymentStatus) {
      status = props.status;
    } else if (typeof props.status === 'string') {
      try {
        status = PaymentStatus.create(props.status);
      } catch (error) {
        throw new PaymentCreateException(`Estado inválido: ${error.message}`);
      }
    } else {
      status = PaymentStatus.pending();
    }

    // Convertir o crear provider
    let provider: PaymentProvider;
    if (props.provider instanceof PaymentProvider) {
      provider = props.provider;
    } else if (typeof props.provider === 'string') {
      try {
        provider = PaymentProvider.create(props.provider);
      } catch (error) {
        throw new PaymentCreateException(`Proveedor inválido: ${error.message}`);
      }
    } else {
      throw new PaymentCreateException('El proveedor de pago es requerido');
    }

    // Crear pago
    return new Payment({
      id,
      userId: props.userId,
      eventId: props.eventId,
      amount: props.amount,
      currency: props.currency,
      status,
      provider,
      providerPaymentId: props.providerPaymentId || null,
      description: props.description || null,
      metadata: props.metadata || null,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date()
    });
  }

  /**
   * Reconstruye un Payment desde almacenamiento (sin validaciones)
   * @param props Propiedades para reconstruir el pago
   * @returns Instancia de Payment reconstruida
   */
  static reconstitute(props: PaymentProps): Payment {
    return new Payment(props);
  }

  /**
   * Compara si dos entidades Payment son iguales por su identidad
   * @param entity Entidad a comparar
   * @returns true si las entidades tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof Payment)) {
      return false;
    }
    
    return this.id === entity.id;
  }

  /**
   * Marca el pago como completado
   * @param providerPaymentId ID del pago en el proveedor
   * @returns Pago completado
   * @throws PaymentUpdateException si el pago no puede ser completado
   */
  completePayment(providerPaymentId: string): Payment {
    if (this.status.isCompleted()) {
      throw new PaymentUpdateException('El pago ya está marcado como completado');
    }

    if (this.status.isRefunded()) {
      throw new PaymentUpdateException('No se puede completar un pago reembolsado');
    }

    return new Payment({
      ...this.toObject(),
      status: PaymentStatus.completed(),
      providerPaymentId,
      updatedAt: new Date()
    });
  }

  /**
   * Marca el pago como fallido
   * @param errorDetails Detalles del error (opcional)
   * @returns Pago fallido
   * @throws PaymentUpdateException si el pago no puede ser marcado como fallido
   */
  failPayment(errorDetails?: Record<string, any>): Payment {
    if (this.status.isCompleted()) {
      throw new PaymentUpdateException('No se puede marcar como fallido un pago completado');
    }

    const newMetadata = errorDetails ? {
      ...this.metadata,
      error: errorDetails
    } : this.metadata;

    return new Payment({
      ...this.toObject(),
      status: PaymentStatus.failed(),
      metadata: newMetadata,
      updatedAt: new Date()
    });
  }

  /**
   * Reembolsa el pago
   * @param reason Motivo del reembolso (opcional)
   * @returns Pago reembolsado
   * @throws PaymentUpdateException si el pago no puede ser reembolsado
   */
  refundPayment(reason?: string): Payment {
    if (!this.status.isCompleted()) {
      throw new PaymentUpdateException('Solo se pueden reembolsar pagos completados');
    }

    const newMetadata = reason ? {
      ...this.metadata,
      refundReason: reason
    } : this.metadata;

    return new Payment({
      ...this.toObject(),
      status: PaymentStatus.refunded(),
      metadata: newMetadata,
      updatedAt: new Date()
    });
  }

  /**
   * Cancela el pago
   * @returns Pago cancelado
   * @throws PaymentUpdateException si el pago no puede ser cancelado
   */
  cancelPayment(): Payment {
    if (this.status.isCompleted()) {
      throw new PaymentUpdateException('No se puede cancelar un pago completado');
    }

    if (this.status.isRefunded()) {
      throw new PaymentUpdateException('No se puede cancelar un pago reembolsado');
    }

    return new Payment({
      ...this.toObject(),
      status: PaymentStatus.cancelled(),
      updatedAt: new Date()
    });
  }

  /**
   * Actualiza los metadatos del pago
   * @param metadata Nuevos metadatos
   * @returns Pago con metadatos actualizados
   */
  updateMetadata(metadata: Record<string, any>): Payment {
    return new Payment({
      ...this.toObject(),
      metadata: {
        ...this.metadata,
        ...metadata
      },
      updatedAt: new Date()
    });
  }

  /**
   * Convierte la entidad a un objeto plano
   * @returns Objeto plano con las propiedades del pago
   */
  toObject(): PaymentProps {
    return {
      id: this.id,
      userId: this.userId,
      eventId: this.eventId,
      amount: this.amount,
      currency: this.currency,
      status: this.status,
      provider: this.provider,
      providerPaymentId: this.providerPaymentId,
      description: this.description,
      metadata: this.metadata,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * Props para reconstruir un pago existente
 */
export interface PaymentProps {
  id: string;
  userId: string;
  eventId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: PaymentProvider;
  providerPaymentId: string | null;
  description: string | null;
  metadata: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Props para crear un nuevo pago
 */
export interface PaymentCreateProps {
  id?: string;
  userId: string;
  eventId: string;
  amount: number;
  currency: string;
  status?: PaymentStatus | PaymentStatusEnum | string;
  provider: PaymentProvider | PaymentProviderEnum | string;
  providerPaymentId?: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
} 