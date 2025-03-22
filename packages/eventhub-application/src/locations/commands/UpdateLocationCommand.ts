import { Location } from 'eventhub-domain';
import { UpdateLocationDTO } from '../dtos/LocationDTO';
import { LocationRepository } from '../repositories/LocationRepository';
import { Command } from '../../core/interfaces/Command';
import { NotFoundException } from '../../core/exceptions/NotFoundException';

/**
 * Comando para actualizar una ubicación existente
 */
export class UpdateLocationCommand implements Command<{ id: string; data: UpdateLocationDTO }, Location> {
  constructor(private readonly locationRepository: LocationRepository) {}

  /**
   * Ejecuta el comando para actualizar una ubicación
   * @param params Parámetros con ID de la ubicación y datos a actualizar
   * @returns Ubicación actualizada
   */
  async execute({ id, data }: { id: string; data: UpdateLocationDTO }): Promise<Location> {
    // Buscar ubicación existente
    const existingLocation = await this.locationRepository.findById(id);
    if (!existingLocation) {
      throw new NotFoundException(`No se encontró la ubicación con ID ${id}`);
    }

    // Validar datos de actualización
    this.validateUpdateData(data);

    // Actualizar ubicación
    const updatedLocation = existingLocation.update(data);

    // Guardar cambios
    await this.locationRepository.save(updatedLocation);

    return updatedLocation;
  }

  /**
   * Valida los datos de actualización de la ubicación
   * @param updateData Datos a actualizar
   * @throws Error si los datos son inválidos
   */
  private validateUpdateData(updateData: UpdateLocationDTO): void {
    if (updateData.latitude !== undefined && (updateData.latitude < -90 || updateData.latitude > 90)) {
      throw new Error('La latitud debe estar entre -90 y 90 grados');
    }

    if (updateData.longitude !== undefined && (updateData.longitude < -180 || updateData.longitude > 180)) {
      throw new Error('La longitud debe estar entre -180 y 180 grados');
    }

    if (updateData.capacity !== undefined && updateData.capacity <= 0) {
      throw new Error('La capacidad debe ser un número positivo');
    }
  }
} 