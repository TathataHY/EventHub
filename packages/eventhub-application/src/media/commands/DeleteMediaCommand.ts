import { MediaRepository } from '../repositories/MediaRepository';
import { Command } from '@eventhub/shared/domain/commands/Command';
import { NotFoundException } from '@eventhub/shared/domain/exceptions/NotFoundException';

export class DeleteMediaCommand implements Command<string, void> {
  constructor(private readonly mediaRepository: MediaRepository) {}

  /**
   * Ejecuta el comando para eliminar un archivo multimedia
   */
  async execute(id: string): Promise<void> {
    const media = await this.mediaRepository.findById(id);
    if (!media) {
      throw new NotFoundException(`Archivo con ID ${id} no encontrado`);
    }

    // Eliminar físicamente el archivo
    await this.mediaRepository.deletePhysically(id);
    
    // Eliminar el registro en la base de datos
    await this.mediaRepository.delete(id);
  }
} 