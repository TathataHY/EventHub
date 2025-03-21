import { Media } from '@eventhub/shared/domain/media/Media';
import { CreateMediaDTO } from '../dtos/MediaDTO';
import { MediaRepository } from '../repositories/MediaRepository';
import { Command } from '@eventhub/shared/domain/commands/Command';
import { MediaMapper } from '../mappers/MediaMapper';

export class CreateMediaCommand implements Command<CreateMediaDTO, Media> {
  constructor(private readonly mediaRepository: MediaRepository) {}

  /**
   * Ejecuta el comando para crear un archivo multimedia
   */
  async execute(data: CreateMediaDTO): Promise<Media> {
    this.validateMediaData(data);
    
    const media = MediaMapper.toDomain(data);
    return this.mediaRepository.save(media);
  }

  /**
   * Valida los datos del archivo multimedia
   */
  private validateMediaData(data: CreateMediaDTO): void {
    if (!data.fileName) {
      throw new Error('El nombre del archivo es requerido');
    }

    if (data.fileName.length > 255) {
      throw new Error('El nombre del archivo no puede exceder los 255 caracteres');
    }

    if (!data.fileSize || data.fileSize <= 0) {
      throw new Error('El tamaño del archivo debe ser mayor que 0');
    }

    if (!data.mimeType) {
      throw new Error('El tipo MIME es requerido');
    }

    if (data.mimeType.length > 100) {
      throw new Error('El tipo MIME no puede exceder los 100 caracteres');
    }

    if (!data.url) {
      throw new Error('La URL es requerida');
    }

    if (data.url.length > 2000) {
      throw new Error('La URL no puede exceder los 2000 caracteres');
    }

    if (data.thumbnailUrl && data.thumbnailUrl.length > 2000) {
      throw new Error('La URL de la miniatura no puede exceder los 2000 caracteres');
    }

    if (data.entityId && data.entityId.length > 50) {
      throw new Error('El ID de la entidad no puede exceder los 50 caracteres');
    }

    if (data.entityType && data.entityType.length > 50) {
      throw new Error('El tipo de entidad no puede exceder los 50 caracteres');
    }
  }
} 