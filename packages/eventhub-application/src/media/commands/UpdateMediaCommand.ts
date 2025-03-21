import { Media } from '@eventhub/shared/domain/media/Media';
import { UpdateMediaDTO } from '../dtos/MediaDTO';
import { MediaRepository } from '../repositories/MediaRepository';
import { Command } from '@eventhub/shared/domain/commands/Command';
import { NotFoundException } from '@eventhub/shared/domain/exceptions/NotFoundException';

export class UpdateMediaCommand implements Command<{ id: string; data: UpdateMediaDTO }, Media> {
  constructor(private readonly mediaRepository: MediaRepository) {}

  /**
   * Ejecuta el comando para actualizar un archivo multimedia
   */
  async execute({ id, data }: { id: string; data: UpdateMediaDTO }): Promise<Media> {
    const media = await this.mediaRepository.findById(id);
    if (!media) {
      throw new NotFoundException(`Archivo con ID ${id} no encontrado`);
    }

    this.validateUpdateData(data);

    if (data.fileName) media.fileName = data.fileName;
    if (data.fileSize) media.fileSize = data.fileSize;
    if (data.mimeType) media.mimeType = data.mimeType;
    if (data.url) media.url = data.url;
    if (data.thumbnailUrl !== undefined) media.thumbnailUrl = data.thumbnailUrl;
    if (data.entityId !== undefined) media.entityId = data.entityId;
    if (data.entityType !== undefined) media.entityType = data.entityType;

    return this.mediaRepository.save(media);
  }

  /**
   * Valida los datos de actualización
   */
  private validateUpdateData(data: UpdateMediaDTO): void {
    if (data.fileName && data.fileName.length > 255) {
      throw new Error('El nombre del archivo no puede exceder los 255 caracteres');
    }

    if (data.fileSize !== undefined && data.fileSize <= 0) {
      throw new Error('El tamaño del archivo debe ser mayor que 0');
    }

    if (data.mimeType && data.mimeType.length > 100) {
      throw new Error('El tipo MIME no puede exceder los 100 caracteres');
    }

    if (data.url && data.url.length > 2000) {
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