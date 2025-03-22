/**
 * Interfaz para comandos en la aplicación
 * @typeParam P - Tipo del parámetro que recibe el comando
 * @typeParam R - Tipo del resultado que devuelve el comando
 */
export interface Command<P = any, R = void> {
  /**
   * Ejecuta el comando
   * @param params - Parámetros opcionales para el comando
   * @returns Una promesa que se resuelve con el resultado
   */
  execute(params?: P): Promise<R>;
}

/**
 * Comando sin parámetros
 * @template R - Tipo del resultado
 */
export interface CommandWithoutParams<R> {
  execute(): Promise<R>;
}

/**
 * Comando con un parámetro
 * @template P - Tipo del parámetro
 * @template R - Tipo del resultado
 */
export interface CommandWithParams<P, R> {
  execute(params: P): Promise<R>;
} 