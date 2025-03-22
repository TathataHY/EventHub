import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { StorageService, StorageOptions } from 'eventhub-application';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class S3StorageService implements StorageService {
  private s3Client: S3;
  private options: StorageOptions;

  constructor(private configService: ConfigService) {
    this.options = {
      bucket: this.configService.get<string>('AWS_S3_BUCKET', ''),
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', ''),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY', ''),
      endpoint: this.configService.get<string>('AWS_ENDPOINT', undefined),
      basePath: this.configService.get<string>('AWS_S3_BASE_PATH', ''),
      publicUrl: this.configService.get<string>('AWS_S3_PUBLIC_URL', '')
    };

    if (!this.options.bucket) {
      console.warn('AWS_S3_BUCKET no está definido. El servicio de almacenamiento no funcionará correctamente.');
    }

    this.s3Client = new S3({
      region: this.options.region,
      credentials: this.options.accessKeyId && this.options.secretAccessKey 
        ? {
            accessKeyId: this.options.accessKeyId,
            secretAccessKey: this.options.secretAccessKey,
          }
        : undefined,
      endpoint: this.options.endpoint
    });
  }

  /**
   * Sube un archivo a S3
   * @param file Buffer del archivo
   * @param path Ruta dentro del bucket
   * @param mimetype Tipo MIME del archivo
   * @param metadata Metadatos (opcional)
   * @returns URL pública del archivo
   */
  async uploadFile(
    file: Buffer | NodeJS.ReadableStream, 
    path: string, 
    mimetype: string,
    metadata?: Record<string, string>
  ): Promise<string> {
    // Asegurar que el path tenga un nombre de archivo único si no lo tiene
    if (!path.includes('.')) {
      // Si no tiene extensión, generamos un UUID
      path = `${path}/${uuidv4()}`;
    }

    // Combinar con el basePath si existe
    const fullPath = this.options.basePath 
      ? `${this.options.basePath}/${path}`.replace(/\/+/g, '/') 
      : path;

    try {
      // Subir el archivo a S3
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.options.bucket,
          Key: fullPath,
          Body: file,
          ContentType: mimetype,
          Metadata: metadata,
        })
      );

      // Construir y devolver la URL pública
      if (this.options.publicUrl) {
        return `${this.options.publicUrl}/${fullPath}`;
      } else {
        return `https://${this.options.bucket}.s3.${this.options.region}.amazonaws.com/${fullPath}`;
      }
    } catch (error) {
      console.error('Error al subir archivo a S3:', error);
      throw new Error(`Error al subir archivo: ${error.message}`);
    }
  }

  /**
   * Elimina un archivo de S3
   * @param path Ruta del archivo en S3
   * @returns true si se eliminó correctamente
   */
  async deleteFile(path: string): Promise<boolean> {
    try {
      // Extraer la ruta real sin la parte pública de la URL
      const fullPath = this.extractPathFromUrl(path);

      // Eliminar el archivo de S3
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.options.bucket,
          Key: fullPath,
        })
      );

      return true;
    } catch (error) {
      console.error('Error al eliminar archivo de S3:', error);
      return false;
    }
  }

  /**
   * Genera una URL firmada para acceso temporal a un archivo
   * @param path Ruta del archivo en S3
   * @param expiresIn Tiempo de expiración en segundos (default: 3600)
   * @returns URL firmada
   */
  async getSignedUrl(path: string, expiresIn: number = 3600): Promise<string> {
    try {
      // Extraer la ruta real sin la parte pública de la URL
      const fullPath = this.extractPathFromUrl(path);

      // Crear comando para obtener el objeto
      const command = new GetObjectCommand({
        Bucket: this.options.bucket,
        Key: fullPath,
      });

      // Generar URL firmada
      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      console.error('Error al generar URL firmada:', error);
      throw new Error(`Error al generar URL firmada: ${error.message}`);
    }
  }

  /**
   * Extrae la ruta real del archivo desde una URL
   * @param urlOrPath URL o ruta del archivo
   * @returns Ruta real dentro del bucket
   */
  private extractPathFromUrl(urlOrPath: string): string {
    // Si ya es solo una ruta, usarla directamente
    if (!urlOrPath.startsWith('http')) {
      return urlOrPath;
    }

    // Si es una URL del bucket de S3, extraer la ruta
    let path = urlOrPath;
    
    // Quitar dominio del bucket
    if (path.includes('.amazonaws.com/')) {
      path = path.split('.amazonaws.com/')[1];
    } 
    // Si tiene URL pública personalizada
    else if (this.options.publicUrl && path.startsWith(this.options.publicUrl)) {
      path = path.replace(this.options.publicUrl, '');
    }

    // Eliminar slash inicial si existe
    if (path.startsWith('/')) {
      path = path.substring(1);
    }

    // Quitar basePath si existe
    if (this.options.basePath && path.startsWith(this.options.basePath)) {
      path = path.replace(this.options.basePath, '');
      // Eliminar slash inicial de nuevo si es necesario
      if (path.startsWith('/')) {
        path = path.substring(1);
      }
    }

    return path;
  }
} 