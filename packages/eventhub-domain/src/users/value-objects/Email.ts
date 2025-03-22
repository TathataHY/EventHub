import { ValueObject } from '../../core/interfaces/ValueObject';

/**
 * Value Object para representar una dirección de email
 * Encapsula la validación y formato de un email
 */
export class Email implements ValueObject<string> {
  private readonly _value: string;

  /**
   * Constructor privado de Email
   * Se deben usar los métodos estáticos para crear instancias
   */
  private constructor(email: string) {
    this._value = email.toLowerCase();
  }

  /**
   * Crea una nueva instancia de Email validando su formato
   * @param email La dirección de email a validar
   * @returns Instancia de Email
   * @throws Error si el email no tiene un formato válido
   */
  public static create(email: string): Email {
    if (!email || email.trim().length === 0) {
      throw new Error('El email no puede estar vacío');
    }

    email = email.trim().toLowerCase();
    
    // Validar formato de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      throw new Error('El formato del email no es válido');
    }

    return new Email(email);
  }

  /**
   * Obtiene el valor del email
   * @returns Valor del email
   */
  public value(): string {
    return this._value;
  }

  /**
   * Compara si este email es igual a otro
   * @param other Otro email para comparar
   * @returns true si los emails son iguales
   */
  public equals(other: ValueObject<string>): boolean {
    if (!(other instanceof Email)) {
      return false;
    }
    
    return this._value === other.value();
  }

  /**
   * Obtiene el dominio del email (parte después de @)
   * @returns Dominio del email
   */
  public getDomain(): string {
    return this._value.split('@')[1];
  }

  /**
   * Obtiene el nombre de usuario del email (parte antes de @)
   * @returns Nombre de usuario del email
   */
  public getUsername(): string {
    return this._value.split('@')[0];
  }

  /**
   * Verifica si el email es de un dominio específico
   * @param domain Dominio a verificar
   * @returns true si el email pertenece al dominio
   */
  public isFromDomain(domain: string): boolean {
    return this.getDomain().toLowerCase() === domain.toLowerCase();
  }

  /**
   * Convierte el email a string
   * @returns Representación string del email
   */
  public toString(): string {
    return this._value;
  }
} 