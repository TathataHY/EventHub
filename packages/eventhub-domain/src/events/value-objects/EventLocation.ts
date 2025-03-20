import { ValueObject } from '../../../core/interfaces/ValueObject';

/**
 * Value Object para representar la ubicación de un evento
 * Implementa la interfaz ValueObject para mantener consistencia
 */
export class EventLocation implements ValueObject<EventLocationProps> {
  private readonly _address: string;
  private readonly _city: string;
  private readonly _state: string | null;
  private readonly _country: string;
  private readonly _postalCode: string | null;
  private readonly _virtualEvent: boolean;
  private readonly _virtualUrl: string | null;
  private readonly _latitude: number | null;
  private readonly _longitude: number | null;

  /**
   * Constructor de EventLocation
   * @param props Propiedades de la ubicación
   * @throws Error si la ubicación no es válida
   */
  constructor(props: EventLocationProps) {
    this.validate(props);
    
    this._address = props.address;
    this._city = props.city;
    this._state = props.state || null;
    this._country = props.country;
    this._postalCode = props.postalCode || null;
    this._virtualEvent = props.virtualEvent || false;
    this._virtualUrl = props.virtualUrl || null;
    this._latitude = props.latitude || null;
    this._longitude = props.longitude || null;
  }

  /**
   * Obtiene el valor completo de la ubicación
   * @returns Objeto con las propiedades de la ubicación
   */
  value(): EventLocationProps {
    return {
      address: this._address,
      city: this._city,
      state: this._state,
      country: this._country,
      postalCode: this._postalCode,
      virtualEvent: this._virtualEvent,
      virtualUrl: this._virtualUrl,
      latitude: this._latitude,
      longitude: this._longitude
    };
  }

  /**
   * Compara si dos ubicaciones son iguales
   * @param vo Ubicación a comparar
   * @returns true si las ubicaciones son iguales
   */
  equals(vo: ValueObject<EventLocationProps>): boolean {
    const otherValue = vo.value();
    return (
      this._address === otherValue.address &&
      this._city === otherValue.city &&
      this._country === otherValue.country &&
      this._virtualEvent === otherValue.virtualEvent &&
      this._virtualUrl === otherValue.virtualUrl
    );
  }

  /**
   * Representación en string de la ubicación
   * @returns String representación de la ubicación
   */
  toString(): string {
    if (this._virtualEvent && this._virtualUrl) {
      return `Evento virtual: ${this._virtualUrl}`;
    }
    
    const parts = [this._address, this._city];
    if (this._state) parts.push(this._state);
    parts.push(this._country);
    if (this._postalCode) parts.push(this._postalCode);
    
    return parts.join(', ');
  }

  /**
   * Obtiene la dirección
   */
  get address(): string {
    return this._address;
  }

  /**
   * Obtiene la ciudad
   */
  get city(): string {
    return this._city;
  }

  /**
   * Obtiene el estado/provincia
   */
  get state(): string | null {
    return this._state;
  }

  /**
   * Obtiene el país
   */
  get country(): string {
    return this._country;
  }

  /**
   * Obtiene el código postal
   */
  get postalCode(): string | null {
    return this._postalCode;
  }

  /**
   * Indica si es un evento virtual
   */
  get isVirtual(): boolean {
    return this._virtualEvent;
  }

  /**
   * Obtiene la URL del evento virtual
   */
  get virtualUrl(): string | null {
    return this._virtualUrl;
  }

  /**
   * Obtiene la latitud para geolocalización
   */
  get latitude(): number | null {
    return this._latitude;
  }

  /**
   * Obtiene la longitud para geolocalización
   */
  get longitude(): number | null {
    return this._longitude;
  }

  /**
   * Valida los datos de la ubicación
   * @param props Propiedades a validar
   * @throws Error si los datos no son válidos
   */
  private validate(props: EventLocationProps): void {
    if (props.virtualEvent) {
      if (!props.virtualUrl) {
        throw new Error('Los eventos virtuales deben tener una URL');
      }
      
      // Validar formato de URL
      try {
        new URL(props.virtualUrl);
      } catch (error) {
        throw new Error('La URL del evento virtual no es válida');
      }
    } else {
      // Validaciones para ubicaciones físicas
      if (!props.address || props.address.trim().length === 0) {
        throw new Error('La dirección es requerida para eventos presenciales');
      }
      
      if (!props.city || props.city.trim().length === 0) {
        throw new Error('La ciudad es requerida para eventos presenciales');
      }
      
      if (!props.country || props.country.trim().length === 0) {
        throw new Error('El país es requerido para eventos presenciales');
      }
      
      // Validación de coordenadas si están presentes
      if (props.latitude !== undefined && props.longitude === undefined) {
        throw new Error('Si se especifica latitud, también se debe especificar longitud');
      }
      
      if (props.longitude !== undefined && props.latitude === undefined) {
        throw new Error('Si se especifica longitud, también se debe especificar latitud');
      }
      
      if (props.latitude !== undefined && (props.latitude < -90 || props.latitude > 90)) {
        throw new Error('La latitud debe estar entre -90 y 90 grados');
      }
      
      if (props.longitude !== undefined && (props.longitude < -180 || props.longitude > 180)) {
        throw new Error('La longitud debe estar entre -180 y 180 grados');
      }
    }
  }

  /**
   * Crea una ubicación para evento virtual
   * @param url URL del evento virtual
   * @returns Nueva instancia de EventLocation para evento virtual
   */
  static virtual(url: string): EventLocation {
    return new EventLocation({
      address: 'Virtual',
      city: 'Online',
      country: 'Global',
      virtualEvent: true,
      virtualUrl: url
    });
  }

  /**
   * Crea una ubicación con coordenadas
   * @param props Propiedades básicas de ubicación
   * @param latitude Latitud
   * @param longitude Longitud
   * @returns Nueva instancia de EventLocation con coordenadas
   */
  static withCoordinates(
    props: Omit<EventLocationProps, 'latitude' | 'longitude'>, 
    latitude: number, 
    longitude: number
  ): EventLocation {
    return new EventLocation({
      ...props,
      latitude,
      longitude
    });
  }
}

/**
 * Props para la ubicación de un evento
 */
export interface EventLocationProps {
  address: string;
  city: string;
  state?: string | null;
  country: string;
  postalCode?: string | null;
  virtualEvent?: boolean;
  virtualUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
} 