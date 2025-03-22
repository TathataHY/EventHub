import { MediaDTO, CreateMediaDTO, UpdateMediaDTO, MediaSearchResultDTO } from '../dtos/MediaDTO';
import { CreateMediaCommand } from '../commands/CreateMediaCommand';
import { UpdateMediaCommand } from '../commands/UpdateMediaCommand';
import { DeleteMediaCommand } from '../commands/DeleteMediaCommand';
import { GetMediaQuery } from '../queries/GetMediaQuery';
import { GetEntityMediaQuery } from '../queries/GetEntityMediaQuery';
import { SearchMediaQuery } from '../queries/SearchMediaQuery';
import { MediaRepository } from '../repositories/MediaRepository';
import { MediaMapper } from '../mappers/MediaMapper';

export class MediaService {
  private readonly createMediaCommand: CreateMediaCommand;
  private readonly updateMediaCommand: UpdateMediaCommand;
  private readonly deleteMediaCommand: DeleteMediaCommand;
  private readonly getMediaQuery: GetMediaQuery;
  private readonly getEntityMediaQuery: GetEntityMediaQuery;
  private readonly searchMediaQuery: SearchMediaQuery;

  constructor(private readonly mediaRepository: MediaRepository) {
    this.createMediaCommand = new CreateMediaCommand(mediaRepository);
    this.updateMediaCommand = new UpdateMediaCommand(mediaRepository);
    this.deleteMediaCommand = new DeleteMediaCommand(mediaRepository);
    this.getMediaQuery = new GetMediaQuery(mediaRepository);
    this.getEntityMediaQuery = new GetEntityMediaQuery(mediaRepository);
    this.searchMediaQuery = new SearchMediaQuery(mediaRepository);
  }

  /**
   * Crea un nuevo archivo multimedia
   */
  async createMedia(data: CreateMediaDTO): Promise<MediaDTO> {
    const media = await this.createMediaCommand.execute(data);
    return MediaMapper.toDTO(media);
  }

  /**
   * Actualiza un archivo multimedia existente
   */
  async updateMedia(id: string, data: UpdateMediaDTO): Promise<MediaDTO> {
    const media = await this.updateMediaCommand.execute({ id, data });
    return MediaMapper.toDTO(media);
  }

  /**
   * Elimina un archivo multimedia
   */
  async deleteMedia(id: string): Promise<void> {
    await this.deleteMediaCommand.execute(id);
  }

  /**
   * Obtiene un archivo multimedia por ID
   */
  async getMedia(id: string): Promise<MediaDTO> {
    return this.getMediaQuery.execute(id);
  }

  /**
   * Obtiene archivos multimedia por entidad
   */
  async getEntityMedia(entityId: string, entityType?: string): Promise<MediaDTO[]> {
    return this.getEntityMediaQuery.execute({ entityId, entityType });
  }

  /**
   * Busca archivos multimedia
   */
  async searchMedia(page: number, limit: number, entityType?: string): Promise<MediaSearchResultDTO> {
    return this.searchMediaQuery.execute({ page, limit, entityType });
  }
} 