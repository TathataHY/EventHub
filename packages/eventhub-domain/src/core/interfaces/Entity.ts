/**
 * Interfaz base para entidades de dominio
 * Define propiedades comunes a todas las entidades
 * @template T Tipo del identificador
 */
export interface Entity<T> {
  /**
   * Identificador único de la entidad
   */
  readonly id: T;

  /**
   * Fecha de creación de la entidad
   */
  readonly createdAt: Date;

  /**
   * Fecha de última actualización de la entidad
   */
  readonly updatedAt: Date;

  /**
   * Indica si la entidad está activa
   */
  readonly isActive: boolean;

  /**
   * Compara si dos entidades son iguales por su identidad
   * @param entity Entidad a comparar
   * @returns true si las entidades son iguales
   */
  equals(entity: Entity<T>): boolean;
} 