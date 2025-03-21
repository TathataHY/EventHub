/**
 * Interfaz para el servicio de gestión de contraseñas
 */
export interface PasswordService {
  /**
   * Genera un hash seguro para una contraseña
   */
  hashPassword(password: string): Promise<string>;
  
  /**
   * Verifica si una contraseña coincide con un hash
   */
  comparePassword(password: string, hash: string): Promise<boolean>;
  
  /**
   * Genera una contraseña aleatoria segura
   */
  generateRandomPassword(length?: number): string;
} 