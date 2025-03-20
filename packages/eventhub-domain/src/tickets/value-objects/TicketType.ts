import { ValueObject } from '../../core/interfaces/ValueObject';

/**
 * Enumeración que define los tipos de tickets disponibles en el sistema
 * 
 * Cada tipo de ticket representa una categoría diferente con sus propias
 * características, precios y beneficios, permitiendo segmentar la oferta
 * de entradas para diferentes públicos y necesidades.
 */
export enum TicketTypeEnum {
  /** Entrada estándar sin beneficios adicionales, acceso básico al evento */
  GENERAL = 'GENERAL',
  
  /** Entrada premium con beneficios adicionales como ubicación preferencial, acceso a áreas exclusivas, etc. */
  VIP = 'VIP',
  
  /** Entrada con descuento especial por compra anticipada, disponible antes del inicio de ventas regular */
  EARLY_BIRD = 'EARLY_BIRD',
  
  /** Entrada con tarifa reducida para estudiantes, requiere verificación de credencial */
  STUDENT = 'STUDENT',
  
  /** Entrada con tarifa reducida para adultos mayores o personas de la tercera edad */
  SENIOR = 'SENIOR',
  
  /** Entrada con descuento para compras en volumen para grupos o equipos */
  GROUP = 'GROUP',
  
  /** Entrada con características o beneficios personalizados para casos especiales */
  SPECIAL = 'SPECIAL'
}

/**
 * Value Object que representa el tipo de un ticket
 * 
 * Encapsula la lógica relacionada con los diferentes tipos de tickets disponibles,
 * proporcionando métodos para validar, comparar y verificar características
 * específicas de cada tipo. Este objeto es inmutable y garantiza la integridad
 * de los datos relacionados con la categorización de tickets.
 * 
 * @implements {ValueObject<TicketTypeEnum>} Implementa la interfaz ValueObject con el tipo TicketTypeEnum
 */
export class TicketType implements ValueObject<TicketTypeEnum> {
  /**
   * Valor interno que almacena el tipo de ticket
   * @private Solo accesible dentro de la clase para garantizar inmutabilidad
   */
  private readonly _value: TicketTypeEnum;

  /**
   * Constructor privado de TicketType
   * 
   * Se utiliza el patrón de constructor privado con métodos factory para
   * asegurar que todos los objetos se creen correctamente validados.
   * 
   * @param value Valor del tipo de ticket (debe ser un valor válido del enum)
   * @private Solo accesible desde los métodos factory
   */
  private constructor(value: TicketTypeEnum) {
    this._value = value;
  }

  /**
   * Crea una nueva instancia de TicketType con el tipo especificado
   * 
   * Método factory principal para crear objetos TicketType.
   * 
   * @param value Valor del tipo de ticket desde la enumeración TicketTypeEnum
   * @returns Nueva instancia validada de TicketType
   * @throws Error si el valor proporcionado no es válido
   */
  static create(value: TicketTypeEnum | string): TicketType {
    // Si es string, convertir a enum
    if (typeof value === 'string') {
      if (!Object.values(TicketTypeEnum).includes(value as TicketTypeEnum)) {
        throw new Error(`Tipo de ticket inválido: ${value}`);
      }
      return new TicketType(value as TicketTypeEnum);
    }
    
    return new TicketType(value);
  }

  /**
   * Obtiene el valor del tipo de ticket
   * 
   * @returns El valor enum que representa el tipo de ticket
   */
  value(): TicketTypeEnum {
    return this._value;
  }

  /**
   * Compara si este tipo de ticket es igual a otro
   * 
   * Dos tipos de ticket son iguales si representan el mismo valor enum.
   * 
   * @param vo Otro value object para comparar
   * @returns true si ambos tipos son iguales
   */
  equals(vo: ValueObject<TicketTypeEnum>): boolean {
    if (!(vo instanceof TicketType)) {
      return false;
    }
    
    return this._value === vo.value();
  }

  /**
   * Convierte el tipo de ticket a su representación en string
   * 
   * Útil para mostrar el tipo en interfaces de usuario o logs.
   * 
   * @returns Representación en texto del tipo de ticket
   */
  toString(): string {
    return this._value;
  }

  /**
   * Verifica si es un ticket de tipo GENERAL
   * 
   * Los tickets generales son la opción estándar para la mayoría de eventos.
   * 
   * @returns true si es un ticket general
   */
  isGeneral(): boolean {
    return this._value === TicketTypeEnum.GENERAL;
  }

  /**
   * Verifica si es un ticket de tipo VIP
   * 
   * Los tickets VIP ofrecen beneficios premium y experiencias exclusivas.
   * 
   * @returns true si es un ticket VIP
   */
  isVIP(): boolean {
    return this._value === TicketTypeEnum.VIP;
  }

  /**
   * Verifica si es un ticket de tipo EARLY_BIRD
   * 
   * Estos tickets se venden antes del inicio oficial de ventas con descuentos especiales.
   * 
   * @returns true si es un ticket de preventa
   */
  isEarlyBird(): boolean {
    return this._value === TicketTypeEnum.EARLY_BIRD;
  }

  /**
   * Verifica si es un ticket de tipo STUDENT
   * 
   * Tickets con descuento para estudiantes que requieren verificación de identidad.
   * 
   * @returns true si es un ticket para estudiantes
   */
  isStudent(): boolean {
    return this._value === TicketTypeEnum.STUDENT;
  }

  /**
   * Verifica si es un ticket de tipo SENIOR
   * 
   * Tickets con descuento para personas mayores o de tercera edad.
   * 
   * @returns true si es un ticket para adultos mayores
   */
  isSenior(): boolean {
    return this._value === TicketTypeEnum.SENIOR;
  }

  /**
   * Verifica si es un ticket de tipo GROUP
   * 
   * Tickets para compras en volumen con descuentos por cantidad.
   * 
   * @returns true si es un ticket para grupos
   */
  isGroup(): boolean {
    return this._value === TicketTypeEnum.GROUP;
  }

  /**
   * Verifica si es un ticket de tipo SPECIAL
   * 
   * Tickets con características personalizadas o para casos especiales.
   * 
   * @returns true si es un ticket especial
   */
  isSpecial(): boolean {
    return this._value === TicketTypeEnum.SPECIAL;
  }
} 