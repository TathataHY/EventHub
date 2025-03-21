import { MediaDTO } from '../dtos/MediaDTO';
import { MediaMapper } from '../mappers/MediaMapper';
import { MediaRepository } from '../repositories/MediaRepository';
import { Query } from '@eventhub/shared/domain/queries/Query';
import { NotFoundException } from '@eventhub/shared/domain/exceptions/NotFoundException';

export class GetMediaQuery implements Query<string, MediaDTO> {
  constructor(private readonly mediaRepository: MediaRepository) {}

  /**
   * Ejecuta la consulta para obtener un archivo multimedia por ID
   */
  async execute(id: string): Promise<MediaDTO> {
    const media = await this.mediaRepository.findById(id);
    if (!media) {
      throw new NotFoundException(`Archivo con ID ${id} no encontrado`);
    }

    return MediaMapper.toDTO(media);
  }
} 