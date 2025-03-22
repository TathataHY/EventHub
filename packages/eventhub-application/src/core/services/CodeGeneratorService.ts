/**
 * Interfaz para el servicio de generación de códigos
 */
export interface CodeGeneratorService {
  /**
   * Genera un código aleatorio con el formato especificado
   */
  generate(length?: number, prefix?: string): string;
} 