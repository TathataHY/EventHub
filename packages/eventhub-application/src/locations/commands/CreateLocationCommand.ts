import { Location } from 'eventhub-domain';
import { CreateLocationDTO } from '../dtos/LocationDTO';
import { LocationRepository } from '../repositories/LocationRepository';
import { Command } from '../../core/interfaces/Command';

/**
 * Comando para crear una nueva ubicación
 */
export class CreateLocationCommand implements Command<CreateLocationDTO, Location> {
  constructor(private readonly locationRepository: LocationRepository) {}

  /**
   * Ejecuta el comando para crear una ubicación
   * @param locationData Datos de la ubicación a crear
   * @returns Ubicación creada
   */
  async execute(locationData: CreateLocationDTO): Promise<Location> {
    // Validar datos de la ubicación
    this.validateLocationData(locationData);

    // Crear entidad de ubicación
    const location = new Location({
      name: locationData.name,
      address: locationData.address,
      city: locationData.city,
      state: locationData.state,
      country: locationData.country,
      postalCode: locationData.postalCode,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      capacity: locationData.capacity,
      description: locationData.description
    });

    // Guardar ubicación
    await this.locationRepository.save(location);

    return location;
  }

  /**
   * Valida los datos de la ubicación
   * @param locationData Datos de la ubicación a validar
   * @throws Error si los datos son inválidos
   */
  private validateLocationData(locationData: CreateLocationDTO): void {
    if (!locationData.name) {
      throw new Error('El nombre de la ubicación es requerido');
    }

    if (!locationData.address) {
      throw new Error('La dirección es requerida');
    }

    if (!locationData.city) {
      throw new Error('La ciudad es requerida');
    }

    if (!locationData.country) {
      throw new Error('El país es requerido');
    }

    if (locationData.latitude === undefined || locationData.longitude === undefined) {
      throw new Error('Las coordenadas geográficas son requeridas');
    }

    if (locationData.latitude < -90 || locationData.latitude > 90) {
      throw new Error('La latitud debe estar entre -90 y 90 grados');
    }

    if (locationData.longitude < -180 || locationData.longitude > 180) {
      throw new Error('La longitud debe estar entre -180 y 180 grados');
    }

    if (locationData.capacity !== undefined && locationData.capacity <= 0) {
      throw new Error('La capacidad debe ser un número positivo');
    }
  }
} 