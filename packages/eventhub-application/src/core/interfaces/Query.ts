/**
 * Interfaz para consultas en la aplicación
 * @typeParam P - Tipo del parámetro que recibe la consulta
 * @typeParam R - Tipo del resultado que devuelve la consulta
 */
export interface Query<P = any, R = any> {
  /**
   * Ejecuta la consulta
   * @param params - Parámetros opcionales para la consulta
   * @returns Una promesa que se resuelve con el resultado
   */
  execute(params?: P): Promise<R>;
}

/**
 * Interfaz para consultas sin parámetros
 * @template R Tipo del resultado de la consulta
 */
export interface QueryWithoutParams<R> {
  execute(): Promise<R>;
}

/**
 * Interfaz para consultas con un parámetro
 * @template P Tipo del parámetro
 * @template R Tipo del resultado
 */
export interface QueryWithOneParam<P, R> {
  execute(param: P): Promise<R>;
}

/**
 * Interfaz para consultas con múltiples parámetros
 * @template P Tipo de los parámetros (objeto con propiedades)
 * @template R Tipo del resultado de la consulta
 */
export interface QueryWithMultiParams<P extends object, R> {
  execute(params: P): Promise<R>;
} 