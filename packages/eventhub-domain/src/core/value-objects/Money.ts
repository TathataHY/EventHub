import { ValueObject } from '../interfaces/ValueObject';

/**
 * Objeto de valor que representa un valor monetario
 * Implementa reglas de negocio relacionadas con valores monetarios
 */
export class Money implements ValueObject<number> {
  private readonly _amount: number;
  private readonly _currency: string;

  /**
   * Constructor privado para crear un objeto Money
   * @param amount Cantidad de dinero (positiva o cero)
   * @param currency Código de moneda (por defecto EUR)
   */
  private constructor(amount: number, currency: string = 'EUR') {
    this._amount = Math.round(amount * 100) / 100; // Redondear a 2 decimales
    this._currency = currency.toUpperCase();
  }

  /**
   * Crea una nueva instancia de Money
   * @param amount Cantidad de dinero
   * @param currency Código de moneda (opcional, por defecto EUR)
   * @returns Instancia de Money
   * @throws Error si el monto es negativo
   */
  static create(amount: number, currency: string = 'EUR'): Money {
    if (amount < 0) {
      throw new Error('El monto no puede ser negativo');
    }
    return new Money(amount, currency);
  }

  /**
   * Devuelve el valor numérico
   * @returns Cantidad de dinero como número
   */
  value(): number {
    return this._amount;
  }

  /**
   * Devuelve la moneda
   * @returns Código de moneda
   */
  currency(): string {
    return this._currency;
  }

  /**
   * Compara con otro objeto Money
   * @param vo Otro objeto Money para comparar
   * @returns true si son iguales, false si no
   */
  equals(vo: ValueObject<number>): boolean {
    if (!(vo instanceof Money)) {
      return false;
    }
    return this.value() === vo.value() && this.currency() === vo.currency();
  }

  /**
   * Convierte a string en formato monetario
   * @returns Representación del valor monetario (ej: "€100.00")
   */
  toString(): string {
    const formatter = new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: this._currency,
    });
    return formatter.format(this._amount);
  }

  /**
   * Suma otro valor monetario
   * @param money Valor monetario a sumar
   * @returns Nuevo objeto Money con la suma
   * @throws Error si las monedas son diferentes
   */
  add(money: Money): Money {
    if (this._currency !== money.currency()) {
      throw new Error('No se pueden sumar montos de diferentes monedas');
    }
    return Money.create(this._amount + money.value(), this._currency);
  }

  /**
   * Resta otro valor monetario
   * @param money Valor monetario a restar
   * @returns Nuevo objeto Money con la resta
   * @throws Error si las monedas son diferentes o si el resultado es negativo
   */
  subtract(money: Money): Money {
    if (this._currency !== money.currency()) {
      throw new Error('No se pueden restar montos de diferentes monedas');
    }
    const result = this._amount - money.value();
    if (result < 0) {
      throw new Error('El resultado de la resta no puede ser negativo');
    }
    return Money.create(result, this._currency);
  }

  /**
   * Multiplica por un factor
   * @param factor Factor de multiplicación
   * @returns Nuevo objeto Money con el resultado de la multiplicación
   */
  multiply(factor: number): Money {
    if (factor < 0) {
      throw new Error('El factor de multiplicación no puede ser negativo');
    }
    return Money.create(this._amount * factor, this._currency);
  }

  /**
   * Comprueba si este valor es mayor que otro
   * @param money Dinero a comparar
   * @returns true si es mayor, false si no
   */
  greaterThan(money: Money): boolean {
    this.ensureSameCurrency(money);
    return this._amount > money.value();
  }

  /**
   * Comprueba si este valor es menor que otro
   * @param money Dinero a comparar
   * @returns true si es menor, false si no
   */
  lessThan(money: Money): boolean {
    this.ensureSameCurrency(money);
    return this._amount < money.value();
  }

  /**
   * Verifica que la moneda sea la misma
   * @param money Objeto Money para comparar moneda
   * @throws Error si las monedas son diferentes
   */
  private ensureSameCurrency(money: Money): void {
    if (this._currency !== money.currency()) {
      throw new Error('No se pueden comparar montos de diferentes monedas');
    }
  }
} 