/**
 * Interfaz para el servicio de hash de contraseñas
 */
export interface HashService {
  /**
   * Crea un hash de una contraseña
   * @param password Contraseña en texto plano
   * @returns Hash de la contraseña
   */
  hash(password: string): Promise<string>;

  /**
   * Compara una contraseña en texto plano con un hash
   * @param password Contraseña en texto plano
   * @param hashedPassword Hash de contraseña almacenado
   * @returns True si la contraseña coincide con el hash, False en caso contrario
   */
  compare(password: string, hashedPassword: string): Promise<boolean>;
} 