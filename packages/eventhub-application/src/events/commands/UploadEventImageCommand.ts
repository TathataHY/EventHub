import { EventRepository } from '../repositories/EventRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException, ValidationException, ExternalServiceException } from '../../core/exceptions';
import { StorageService } from '../../core/services/StorageService';

/**
 * Comando para subir una imagen de evento
 */
export class UploadEventImageCommand implements Command<string> {
  constructor(
    private readonly eventId: string,
    private readonly imageFile: Buffer | string,
    private readonly eventRepository: EventRepository,
    private readonly storageService: StorageService,
    private readonly contentType?: string,
    private readonly fileName?: string
  ) {}

  /**
   * Ejecuta el comando para subir una imagen de evento
   * @returns Promise<string> URL de la imagen subida
   * @throws NotFoundException si el evento no existe
   * @throws ValidationException si hay problemas de validación
   * @throws ExternalServiceException si hay errores en el servicio de almacenamiento
   */
  async execute(): Promise<string> {
    // Validación de parámetros
    if (!this.eventId) {
      throw new ValidationException('ID de evento es requerido');
    }

    if (!this.imageFile) {
      throw new ValidationException('Archivo de imagen es requerido');
    }

    // Verificar que el evento existe
    const event = await this.eventRepository.findById(this.eventId);
    if (!event) {
      throw new NotFoundException('Evento', this.eventId);
    }

    try {
      // Configurar opciones de almacenamiento
      const storageOptions = {
        folder: `events/${this.eventId}/images`,
        contentType: this.contentType,
        filename: this.fileName || `image-${Date.now()}`,
        isPublic: true
      };

      // Subir imagen al servicio de almacenamiento
      const imageUrl = await this.storageService.uploadFile(this.imageFile, storageOptions);

      // Actualizar URL de imagen en el evento
      event.imageUrl = imageUrl;
      await this.eventRepository.update(event);

      return imageUrl;
    } catch (error) {
      throw new ExternalServiceException('Storage', error.message);
    }
  }
} 