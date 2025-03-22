import { ValueObject } from '../../core/interfaces/ValueObject';

/**
 * Enum para los tipos de moneda soportados
 */
export enum CurrencyEnum {
  USD = 'USD',  // Dólar estadounidense
  EUR = 'EUR',  // Euro
  MXN = 'MXN',  // Peso mexicano
  COP = 'COP',  // Peso colombiano
  BRL = 'BRL',  // Real brasileño
  ARS = 'ARS',  // Peso argentino
  CLP = 'CLP',  // Peso chileno
  PEN = 'PEN',  // Sol peruano
  UYU = 'UYU',  // Peso uruguayo
  OTHER = 'OTHER' // Otro no especificado
}

/**
 * Value Object para monedas
 */
export class Currency implements ValueObject<CurrencyEnum> {
  private readonly _value: CurrencyEnum;

  private constructor(currency: CurrencyEnum) {
    this._value = currency;
  }

  /**
   * Crea una moneda a partir de un string
   */
  public static fromString(currency: string): Currency {
    const upperCurrency = currency.toUpperCase();
    
    if (Object.values(CurrencyEnum).includes(upperCurrency as CurrencyEnum)) {
      return new Currency(upperCurrency as CurrencyEnum);
    }
    
    return Currency.other();
  }

  /**
   * Crea una instancia de moneda USD
   */
  public static usd(): Currency {
    return new Currency(CurrencyEnum.USD);
  }

  /**
   * Crea una instancia de moneda EUR
   */
  public static eur(): Currency {
    return new Currency(CurrencyEnum.EUR);
  }

  /**
   * Crea una instancia de moneda MXN
   */
  public static mxn(): Currency {
    return new Currency(CurrencyEnum.MXN);
  }

  /**
   * Crea una instancia de otra moneda
   */
  public static other(): Currency {
    return new Currency(CurrencyEnum.OTHER);
  }

  /**
   * Devuelve el valor de la moneda
   */
  public value(): CurrencyEnum {
    return this._value;
  }

  /**
   * Compara con otro ValueObject
   */
  public equals(vo: ValueObject<CurrencyEnum>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    
    return this.value() === vo.value();
  }

  /**
   * Devuelve el símbolo de la moneda
   */
  public getSymbol(): string {
    switch (this._value) {
      case CurrencyEnum.USD:
        return '$';
      case CurrencyEnum.EUR:
        return '€';
      case CurrencyEnum.MXN:
        return '$';
      case CurrencyEnum.COP:
        return '$';
      case CurrencyEnum.BRL:
        return 'R$';
      case CurrencyEnum.ARS:
        return '$';
      case CurrencyEnum.CLP:
        return '$';
      case CurrencyEnum.PEN:
        return 'S/';
      case CurrencyEnum.UYU:
        return '$U';
      default:
        return '';
    }
  }

  /**
   * Devuelve la representación como string
   */
  public toString(): string {
    return this._value;
  }
} 