import { ValueObject } from '../../core/interfaces/ValueObject';

/**
 * Propiedades de una dirección postal
 * 
 * Define la estructura de datos necesaria para representar
 * una dirección física completa con todos sus componentes.
 */
export interface AddressProps {
  /** Nombre de la calle o vía principal */
  street: string;
  
  /** Número de portal, vivienda o local (opcional) */
  number?: string;
  
  /** Ciudad o población */
  city: string;
  
  /** Estado, provincia o región administrativa */
  state: string;
  
  /** País */
  country: string;
  
  /** Código postal (opcional) */
  zipCode?: string;
  
  /** Información adicional como piso, puerta, escalera, etc. (opcional) */
  additionalInfo?: string;
}

/**
 * Value Object que representa una dirección postal
 * 
 * Encapsula la estructura y validación de una dirección física completa,
 * proporcionando métodos para comparar direcciones y formatearlas
 * de manera adecuada para su visualización.
 * 
 * Este objeto es inmutable para garantizar la integridad de los datos
 * relacionados con las ubicaciones de eventos y usuarios.
 * 
 * @implements {ValueObject<AddressProps>} Implementa la interfaz ValueObject
 */
export class Address implements ValueObject<AddressProps> {
  /** Nombre de la calle o vía principal */
  private readonly _street: string;
  
  /** Número de portal, vivienda o local (opcional) */
  private readonly _number?: string;
  
  /** Ciudad o población */
  private readonly _city: string;
  
  /** Estado, provincia o región administrativa */
  private readonly _state: string;
  
  /** País */
  private readonly _country: string;
  
  /** Código postal (opcional) */
  private readonly _zipCode?: string;
  
  /** Información adicional (opcional) */
  private readonly _additionalInfo?: string;

  /**
   * Constructor privado para Address
   * 
   * Se utiliza el patrón de constructor privado para garantizar que todas
   * las instancias se creen mediante el método factory create(), asegurando
   * así la validación de los datos.
   * 
   * @param props Propiedades de la dirección
   * @private Solo accesible desde los métodos factory
   */
  private constructor(props: AddressProps) {
    this._street = props.street;
    this._number = props.number;
    this._city = props.city;
    this._state = props.state;
    this._country = props.country;
    this._zipCode = props.zipCode;
    this._additionalInfo = props.additionalInfo;
  }

  /**
   * Crea una nueva instancia de Address validando los campos obligatorios
   * 
   * Verifica que los componentes esenciales de una dirección (calle, ciudad,
   * estado y país) estén presentes y no estén vacíos.
   * 
   * @param props Propiedades completas o parciales de la dirección
   * @returns Nueva instancia validada de Address
   * @throws Error si alguno de los campos requeridos está ausente o vacío
   */
  public static create(props: AddressProps): Address {
    if (!props.street || props.street.trim() === '') {
      throw new Error('La calle es obligatoria');
    }

    if (!props.city || props.city.trim() === '') {
      throw new Error('La ciudad es obligatoria');
    }

    if (!props.state || props.state.trim() === '') {
      throw new Error('La provincia/estado es obligatorio');
    }

    if (!props.country || props.country.trim() === '') {
      throw new Error('El país es obligatorio');
    }

    return new Address({
      ...props,
      street: props.street.trim(),
      number: props.number?.trim(),
      city: props.city.trim(),
      state: props.state.trim(),
      country: props.country.trim(),
      zipCode: props.zipCode?.trim(),
      additionalInfo: props.additionalInfo?.trim()
    });
  }

  /**
   * Obtiene el nombre de la calle
   * 
   * @returns Nombre de la calle o vía principal
   */
  get street(): string {
    return this._street;
  }

  /**
   * Obtiene el número de portal o vivienda
   * 
   * @returns Número de la dirección o undefined si no está definido
   */
  get number(): string | undefined {
    return this._number;
  }

  /**
   * Obtiene el nombre de la ciudad o población
   * 
   * @returns Nombre de la ciudad
   */
  get city(): string {
    return this._city;
  }

  /**
   * Obtiene el nombre del estado o provincia
   * 
   * @returns Nombre del estado, provincia o región
   */
  get state(): string {
    return this._state;
  }

  /**
   * Obtiene el nombre del país
   * 
   * @returns Nombre del país
   */
  get country(): string {
    return this._country;
  }

  /**
   * Obtiene el código postal
   * 
   * @returns Código postal o undefined si no está definido
   */
  get zipCode(): string | undefined {
    return this._zipCode;
  }

  /**
   * Obtiene la información adicional de la dirección
   * 
   * @returns Información adicional o undefined si no está definida
   */
  get additionalInfo(): string | undefined {
    return this._additionalInfo;
  }

  /**
   * Compara si esta dirección es igual a otra
   * 
   * Dos direcciones se consideran iguales si todos sus componentes
   * coinciden exactamente, incluyendo los opcionales.
   * 
   * @param valueObject Otra dirección para comparar
   * @returns true si ambas direcciones son idénticas
   */
  public equals(valueObject: ValueObject<AddressProps>): boolean {
    if (!(valueObject instanceof Address)) {
      return false;
    }
    
    return (
      this._street === valueObject._street &&
      this._number === valueObject._number &&
      this._city === valueObject._city &&
      this._state === valueObject._state &&
      this._country === valueObject._country &&
      this._zipCode === valueObject._zipCode &&
      this._additionalInfo === valueObject._additionalInfo
    );
  }

  /**
   * Genera una representación formateada de la dirección
   * 
   * Combina todos los componentes de la dirección en una cadena de texto
   * legible, siguiendo las convenciones habituales de formato.
   * 
   * @returns Cadena de texto con la dirección completa formateada
   */
  public getFormattedAddress(): string {
    const parts: string[] = [];
    
    // Calle y número
    if (this._number) {
      parts.push(`${this._street}, ${this._number}`);
    } else {
      parts.push(this._street);
    }
    
    // Información adicional
    if (this._additionalInfo) {
      parts.push(this._additionalInfo);
    }
    
    // Ciudad, código postal, estado y país
    let locationPart = this._city;
    if (this._zipCode) {
      locationPart += `, ${this._zipCode}`;
    }
    locationPart += `, ${this._state}, ${this._country}`;
    parts.push(locationPart);
    
    return parts.join('. ');
  }

  /**
   * Obtiene el valor de la dirección como un objeto simple
   * 
   * Implementación del método value() definido en la interfaz ValueObject.
   * 
   * @returns Objeto con todas las propiedades de la dirección
   */
  public value(): AddressProps {
    return {
      street: this._street,
      number: this._number,
      city: this._city,
      state: this._state,
      country: this._country,
      zipCode: this._zipCode,
      additionalInfo: this._additionalInfo
    };
  }
} 