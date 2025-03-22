import { MediaSearchResultDTO } from '../dtos/MediaDTO';
import { MediaMapper } from '../mappers/MediaMapper';
import { MediaRepository } from '../repositories/MediaRepository';
import { Query } from '@eventhub/shared/domain/queries/Query';

interface SearchMediaParams {
  page: number;
  limit: number;
  entityType?: string;
}

export class SearchMediaQuery implements Query<SearchMediaParams, MediaSearchResultDTO> {
  constructor(private readonly mediaRepository: MediaRepository) {}

  /**
   * Ejecuta la consulta para buscar archivos multimedia
   */
  async execute({ page, limit, entityType }: SearchMediaParams): Promise<MediaSearchResultDTO> {
    if (page <= 0) {
      throw new Error('La página debe ser mayor a 0');
    }

    if (limit <= 0) {
      throw new Error('El límite debe ser mayor a 0');
    }

    const { items, total } = await this.mediaRepository.findWithPagination(page, limit, entityType);

    return {
      items: MediaMapper.toDTOList(items),
      total,
      page,
      limit
    };
  }
} 