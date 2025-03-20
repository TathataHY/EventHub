/**
 * Interfaz base para Value Objects (Objetos de Valor)
 * Los Value Objects son inmutables y se comparan por su valor, no por su identidad
 * @template T Tipo del valor encapsulado
 */
export interface ValueObject<T> {
  /**
   * Obtiene el valor encapsulado
   * @returns Valor encapsulado
   */
  value(): T;

  /**
   * Compara si dos objetos de valor son iguales
   * @param vo Value Object a comparar
   * @returns true si los objetos son iguales en valor
   */
  equals(vo: ValueObject<T>): boolean;

  /**
   * Representación en string del Value Object
   * @returns Representación textual
   */
  toString(): string;
} 