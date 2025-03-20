import { ValueObject } from '../../core/interfaces/ValueObject';

/**
 * Propiedades de las coordenadas geográficas
 * 
 * Define la estructura de datos para representar un punto
 * geográfico mediante sus coordenadas de latitud y longitud.
 */
export interface CoordinatesProps {
  /** 
   * Latitud en grados decimales (-90 a 90)
   * Valores positivos indican norte del Ecuador, negativos indican sur
   */
  latitude: number;
  
  /** 
   * Longitud en grados decimales (-180 a 180)
   * Valores positivos indican este del Meridiano de Greenwich, negativos indican oeste
   */
  longitude: number;
}

/**
 * Value Object que representa coordenadas geográficas
 * 
 * Encapsula las coordenadas de latitud y longitud de un punto geográfico,
 * proporcionando validación y funcionalidades relacionadas con la ubicación,
 * como cálculo de distancias y generación de URLs para mapas.
 * 
 * Este objeto es inmutable para garantizar la integridad de los datos geográficos.
 * 
 * @implements {ValueObject<CoordinatesProps>} Implementa la interfaz ValueObject
 */
export class Coordinates implements ValueObject<CoordinatesProps> {
  /** Valor de latitud en grados decimales (-90 a 90) */
  private readonly _latitude: number;
  
  /** Valor de longitud en grados decimales (-180 a 180) */
  private readonly _longitude: number;

  /**
   * Constructor privado para Coordinates
   * 
   * Se utiliza el patrón de constructor privado para garantizar que todas
   * las instancias se creen mediante el método factory create(), asegurando
   * así la validación de los datos.
   * 
   * @param props Propiedades de las coordenadas 
   * @private Solo accesible desde los métodos factory
   */
  private constructor(props: CoordinatesProps) {
    this._latitude = props.latitude;
    this._longitude = props.longitude;
  }

  /**
   * Crea una nueva instancia de Coordinates validando los rangos permitidos
   * 
   * Verifica que los valores de latitud y longitud estén dentro de los
   * rangos válidos para coordenadas geográficas en el planeta Tierra.
   * 
   * @param props Propiedades de latitud y longitud en grados decimales
   * @returns Nueva instancia validada de Coordinates
   * @throws Error si la latitud o longitud están fuera de los rangos permitidos
   */
  public static create(props: CoordinatesProps): Coordinates {
    if (props.latitude < -90 || props.latitude > 90) {
      throw new Error('La latitud debe estar entre -90 y 90 grados');
    }

    if (props.longitude < -180 || props.longitude > 180) {
      throw new Error('La longitud debe estar entre -180 y 180 grados');
    }

    return new Coordinates({
      latitude: props.latitude,
      longitude: props.longitude
    });
  }

  /**
   * Obtiene el valor de latitud
   * 
   * @returns Latitud en grados decimales
   */
  get latitude(): number {
    return this._latitude;
  }

  /**
   * Obtiene el valor de longitud
   * 
   * @returns Longitud en grados decimales
   */
  get longitude(): number {
    return this._longitude;
  }

  /**
   * Compara si estas coordenadas son iguales a otras
   * 
   * Realiza una comparación con una pequeña tolerancia para manejar
   * la imprecisión inherente a los números de punto flotante.
   * 
   * @param valueObject Otro objeto de coordenadas para comparar
   * @returns true si ambas coordenadas representan aproximadamente la misma ubicación
   */
  public equals(valueObject: ValueObject<CoordinatesProps>): boolean {
    if (!(valueObject instanceof Coordinates)) {
      return false;
    }
    
    // Usando una pequeña tolerancia para comparación de números de punto flotante
    const EPSILON = 0.0000001;
    return (
      Math.abs(this._latitude - valueObject._latitude) < EPSILON &&
      Math.abs(this._longitude - valueObject._longitude) < EPSILON
    );
  }

  /**
   * Calcula la distancia entre dos puntos geográficos en kilómetros
   * 
   * Utiliza la fórmula de Haversine para calcular la distancia sobre la
   * superficie terrestre (considerada como esfera) entre dos coordenadas.
   * 
   * @param other Coordenadas del punto de destino
   * @returns Distancia en kilómetros
   */
  public distanceTo(other: Coordinates): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRadians(other.latitude - this._latitude);
    const dLon = this.toRadians(other.longitude - this._longitude);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(this._latitude)) * 
      Math.cos(this.toRadians(other.latitude)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
  }

  /**
   * Convierte grados a radianes
   * 
   * Método auxiliar para los cálculos trigonométricos en la fórmula de Haversine.
   * 
   * @param degrees Ángulo en grados
   * @returns Ángulo en radianes
   * @private Método de uso interno
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Genera una URL para abrir estas coordenadas en Google Maps
   * 
   * Útil para proporcionar enlaces externos a visualizar la ubicación.
   * 
   * @returns URL de Google Maps que apunta a estas coordenadas
   */
  public getGoogleMapsUrl(): string {
    return `https://maps.google.com/?q=${this._latitude},${this._longitude}`;
  }

  /**
   * Obtiene el valor de las coordenadas como un objeto simple
   * 
   * Implementación del método value() definido en la interfaz ValueObject.
   * 
   * @returns Objeto con las propiedades latitude y longitude
   */
  public value(): CoordinatesProps {
    return {
      latitude: this._latitude,
      longitude: this._longitude
    };
  }
} 