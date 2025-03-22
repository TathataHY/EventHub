import { MediaDTO } from '../dtos/MediaDTO';
import { MediaMapper } from '../mappers/MediaMapper';
import { MediaRepository } from '../repositories/MediaRepository';
import { Query } from '@eventhub/shared/domain/queries/Query';

interface GetEntityMediaParams {
  entityId: string;
  entityType?: string;
}

export class GetEntityMediaQuery implements Query<GetEntityMediaParams, MediaDTO[]> {
  constructor(private readonly mediaRepository: MediaRepository) {}

  /**
   * Ejecuta la consulta para obtener archivos multimedia por entidad
   */
  async execute({ entityId, entityType }: GetEntityMediaParams): Promise<MediaDTO[]> {
    if (!entityId) {
      throw new Error('El ID de la entidad es requerido');
    }

    const mediaList = await this.mediaRepository.findByEntityId(entityId, entityType);
    return MediaMapper.toDTOList(mediaList);
  }
} 