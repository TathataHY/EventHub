import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../../core/interfaces/Entity';
import { PaymentStatus, PaymentStatusEnum } from '../value-objects/PaymentStatus';
import { PaymentProvider, PaymentProviderEnum } from '../value-objects/PaymentProvider';
import { PaymentCreateException } from '../exceptions/PaymentCreateException';
import { PaymentUpdateException } from '../exceptions/PaymentUpdateException';
import { Currency } from '../value-objects/Currency';
import { PaymentMethod } from '../value-objects/PaymentMethod';

/**
 * Entidad que representa un pago en el sistema
 * 
 * Encapsula toda la información y comportamiento relacionado con transacciones
 * financieras en la plataforma, manteniendo el historial y estado de cada pago.
 * @implements {Entity<string>}
 */
export class Payment implements Entity<string> {
  /** Identificador único del pago */
  readonly id: string;
  /** ID del usuario que realiza el pago */
  readonly userId: string;
  /** ID del evento asociado al pago */
  readonly eventId: string;
  /** Monto del pago en la moneda especificada */
  readonly amount: number;
  /** Código de la moneda (USD, EUR, MXN, etc.) */
  readonly currency: Currency;
  /** Estado actual del pago (pendiente, completado, etc.) */
  readonly status: PaymentStatus;
  /** Proveedor de servicios de pago utilizado */
  readonly provider: PaymentProvider;
  /** ID de la transacción en el sistema del proveedor */
  readonly providerPaymentId: string | null;
  /** Descripción o concepto del pago */
  readonly description: string | null;
  /** Datos adicionales asociados al pago */
  readonly metadata: Record<string, any>;
  /** Fecha de creación del pago */
  readonly createdAt: Date;
  /** Fecha de última actualización */
  readonly updatedAt: Date;
  /** Indica si el pago está activo */
  readonly isActive: boolean;
  /** Fecha de pago */
  readonly paymentDate: Date | null;
  /** Método de pago utilizado */
  readonly paymentMethod: PaymentMethod;

  /**
   * Constructor privado (patrón Factory)
   * @param props Propiedades completas del pago
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
    this.metadata = props.metadata || {};
    this.isActive = props.isActive !== undefined ? props.isActive : true;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.paymentDate = props.paymentDate;
    this.paymentMethod = props.paymentMethod;
  }

  /**
   * Crea un nuevo pago con validación de datos
   * 
   * @param props Propiedades para crear el pago
   * @returns Nueva instancia de Payment
   * @throws {PaymentCreateException} Si los datos son inválidos
   */
  static create(props: PaymentCreateProps): Payment {
    // Validaciones
    if (!props.userId) {
      throw new PaymentCreateException('El ID de usuario es requerido');
    }

    if (!props.eventId) {
      throw new PaymentCreateException('El ID de evento es requerido');
    }

    if (!props.amount || props.amount <= 0) {
      throw new PaymentCreateException('El monto debe ser un número positivo');
    }

    if (!props.currency) {
      throw new PaymentCreateException('La moneda es requerida');
    }

    // Normalizar provider si viene como string o enum
    let provider: PaymentProvider;
    if (typeof props.provider === 'string') {
      try {
        provider = PaymentProvider.fromValue(props.provider as PaymentProviderEnum);
      } catch (error) {
        throw new PaymentCreateException(`Proveedor de pago inválido: ${props.provider}`);
      }
    } else if (props.provider instanceof PaymentProvider) {
      provider = props.provider;
    } else {
      try {
        provider = PaymentProvider.fromValue(props.provider);
      } catch (error) {
        throw new PaymentCreateException(`Proveedor de pago inválido: ${props.provider}`);
      }
    }

    // Estado inicial (por defecto PENDING)
    let status: PaymentStatus;
    if (!props.status) {
      status = PaymentStatus.pending();
    } else if (typeof props.status === 'string') {
      try {
        status = PaymentStatus.fromValue(props.status as PaymentStatusEnum);
      } catch (error) {
        throw new PaymentCreateException(`Estado de pago inválido: ${props.status}`);
      }
    } else if (props.status instanceof PaymentStatus) {
      status = props.status;
    } else {
      try {
        status = PaymentStatus.fromValue(props.status);
      } catch (error) {
        throw new PaymentCreateException(`Estado de pago inválido: ${props.status}`);
      }
    }

    // Crear pago
    const now = new Date();
    return new Payment({
      id: props.id || uuidv4(),
      userId: props.userId,
      eventId: props.eventId,
      amount: props.amount,
      currency: props.currency,
      status,
      provider,
      providerPaymentId: props.providerPaymentId || null,
      description: props.description || null,
      metadata: props.metadata || null,
      createdAt: props.createdAt || now,
      updatedAt: props.updatedAt || now,
      paymentDate: props.paymentDate || null,
      paymentMethod: props.paymentMethod || PaymentMethod.unknown(),
      isActive: props.isActive !== undefined ? props.isActive : true
    });
  }

  /**
   * Reconstruye un pago desde persistencia
   * 
   * @param props Propiedades completas del pago
   * @returns Instancia de Payment reconstruida
   */
  static reconstitute(props: PaymentProps): Payment {
    return new Payment(props);
  }

  /**
   * Compara si este pago es igual a otra entidad
   * 
   * @param entity Otra entidad para comparar
   * @returns true si tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof Payment)) {
      return false;
    }
    
    return this.id === entity.id;
  }

  /**
   * Marca el pago como completado
   * 
   * @param providerPaymentId ID de la transacción en el sistema del proveedor
   * @returns Nueva instancia con el pago completado
   * @throws {PaymentUpdateException} Si el pago no puede ser completado
   */
  completePayment(providerPaymentId: string): Payment {
    if (!this.status.isPending()) {
      throw new PaymentUpdateException('Solo se pueden completar pagos pendientes');
    }

    if (!providerPaymentId) {
      throw new PaymentUpdateException('Se requiere el ID de pago del proveedor');
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
   * 
   * @param errorDetails Detalles opcionales sobre el error
   * @returns Nueva instancia con el pago fallido
   * @throws {PaymentUpdateException} Si el pago no puede ser marcado como fallido
   */
  failPayment(errorDetails?: Record<string, any>): Payment {
    if (!this.status.isPending()) {
      throw new PaymentUpdateException('Solo se pueden marcar como fallidos los pagos pendientes');
    }

    const metadata = {
      ...this.metadata,
      error: errorDetails || { message: 'Pago fallido' }
    };

    return new Payment({
      ...this.toObject(),
      status: PaymentStatus.failed(),
      metadata,
      updatedAt: new Date()
    });
  }

  /**
   * Marca el pago como reembolsado
   * 
   * @param reason Motivo opcional del reembolso
   * @returns Nueva instancia con el pago reembolsado
   * @throws {PaymentUpdateException} Si el pago no puede ser reembolsado
   */
  refundPayment(reason?: string): Payment {
    if (!this.status.isCompleted()) {
      throw new PaymentUpdateException('Solo se pueden reembolsar pagos completados');
    }

    const metadata = {
      ...this.metadata,
      refund: {
        reason: reason || 'Reembolso solicitado',
        date: new Date()
      }
    };

    return new Payment({
      ...this.toObject(),
      status: PaymentStatus.refunded(),
      metadata,
      updatedAt: new Date()
    });
  }

  /**
   * Cancela el pago mientras está pendiente
   * 
   * @returns Nueva instancia con el pago cancelado
   * @throws {PaymentUpdateException} Si el pago no puede ser cancelado
   */
  cancelPayment(): Payment {
    if (!this.status.isPending()) {
      throw new PaymentUpdateException('Solo se pueden cancelar pagos pendientes');
    }

    const metadata = {
      ...this.metadata,
      cancellation: {
        date: new Date()
      }
    };

    return new Payment({
      ...this.toObject(),
      status: PaymentStatus.cancelled(),
      metadata,
      updatedAt: new Date()
    });
  }

  /**
   * Actualiza los metadatos del pago
   * 
   * @param metadata Nuevos metadatos a añadir o actualizar
   * @returns Nueva instancia con los metadatos actualizados
   */
  updateMetadata(metadata: Record<string, any>): Payment {
    return new Payment({
      ...this.toObject(),
      metadata: { ...this.metadata, ...metadata },
      updatedAt: new Date()
    });
  }

  /**
   * Convierte la entidad a un objeto plano
   * 
   * @returns Objeto con todas las propiedades del pago
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
      updatedAt: this.updatedAt,
      paymentDate: this.paymentDate,
      paymentMethod: this.paymentMethod,
      isActive: this.isActive
    };
  }
}

/**
 * Propiedades completas de un pago
 */
export interface PaymentProps {
  /** Identificador único */
  id: string;
  /** ID del usuario que realiza el pago */
  userId: string;
  /** ID del evento asociado */
  eventId: string;
  /** Monto del pago */
  amount: number;
  /** Código de moneda */
  currency: Currency;
  /** Estado del pago */
  status: PaymentStatus;
  /** Proveedor de pago */
  provider: PaymentProvider;
  /** ID en el sistema del proveedor */
  providerPaymentId: string | null;
  /** Descripción o concepto */
  description: string | null;
  /** Datos adicionales */
  metadata: Record<string, any>;
  /** Fecha de creación */
  createdAt: Date;
  /** Fecha de última actualización */
  updatedAt: Date;
  /** Fecha de pago */
  paymentDate: Date | null;
  /** Método de pago */
  paymentMethod: PaymentMethod;
  /** Indica si el pago está activo */
  isActive: boolean;
}

/**
 * Propiedades para crear un nuevo pago
 */
export interface PaymentCreateProps {
  /** Identificador único (opcional) */
  id?: string;
  /** ID del usuario que realiza el pago */
  userId: string;
  /** ID del evento asociado */
  eventId: string;
  /** Monto del pago */
  amount: number;
  /** Código de moneda */
  currency: Currency;
  /** Estado inicial del pago (opcional) */
  status?: PaymentStatus | PaymentStatusEnum | string;
  /** Proveedor de servicios de pago */
  provider: PaymentProvider | PaymentProviderEnum | string;
  /** ID en el sistema del proveedor (opcional) */
  providerPaymentId?: string;
  /** Descripción o concepto (opcional) */
  description?: string;
  /** Datos adicionales (opcional) */
  metadata?: Record<string, any>;
  /** Fecha de creación (opcional) */
  createdAt?: Date;
  /** Fecha de última actualización (opcional) */
  updatedAt?: Date;
  /** Fecha de pago (opcional) */
  paymentDate?: Date;
  /** Método de pago (opcional) */
  paymentMethod?: PaymentMethod;
  /** Indica si el pago está activo (opcional) */
  isActive?: boolean;
} 