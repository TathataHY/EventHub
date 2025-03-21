/**
 * Opciones para la generación de códigos QR
 */
export interface QrCodeOptions {
  width?: number;
  height?: number;
  margin?: number;
  color?: {
    dark: string;
    light: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

/**
 * Interfaz para el servicio de generación de códigos QR
 */
export interface QrCodeService {
  /**
   * Genera un código QR para el contenido especificado
   */
  generateQrCode(content: string, options?: QrCodeOptions): Promise<string>;
} 