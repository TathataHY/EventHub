/**
 * Opciones para almacenamiento de archivos
 */
export interface StorageOptions {
  folder?: string;
  filename?: string;
  contentType?: string;
  isPublic?: boolean;
}

/**
 * Interfaz para el servicio de almacenamiento
 */
export interface StorageService {
  /**
   * Sube un archivo al almacenamiento
   */
  uploadFile(
    file: Buffer | string, 
    options?: StorageOptions
  ): Promise<string>;

  /**
   * Elimina un archivo del almacenamiento
   */
  deleteFile(fileUrl: string): Promise<boolean>;

  /**
   * Obtiene la URL de acceso público de un archivo
   */
  getPublicUrl(fileUrl: string): string;
} 