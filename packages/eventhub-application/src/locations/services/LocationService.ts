import { Location } from 'eventhub-domain';
import { CreateLocationDTO, UpdateLocationDTO, LocationDTO } from '../dtos/LocationDTO';
import { CreateLocationCommand } from '../commands/CreateLocationCommand';
import { UpdateLocationCommand } from '../commands/UpdateLocationCommand';
import { DeleteLocationCommand } from '../commands/DeleteLocationCommand';
import { GetLocationQuery } from '../queries/GetLocationQuery';
import { FindNearbyLocationsQuery } from '../queries/FindNearbyLocationsQuery';
import { GetPopularLocationsQuery } from '../queries/GetPopularLocationsQuery';
import { LocationRepository } from '../repositories/LocationRepository';
import { LocationMapper } from '../mappers/LocationMapper';

interface PopularCityDTO {
  city: string;
  country: string;
  eventCount: number;
}

interface PopularCountryDTO {
  country: string;
  eventCount: number;
}

interface PopularLocationsResult {
  cities: PopularCityDTO[];
  countries: PopularCountryDTO[];
}

/**
 * Servicio para gestionar ubicaciones
 */
export class LocationService {
  private readonly createLocationCommand: CreateLocationCommand;
  private readonly updateLocationCommand: UpdateLocationCommand;
  private readonly deleteLocationCommand: DeleteLocationCommand;
  private readonly getLocationQuery: GetLocationQuery;
  private readonly findNearbyLocationsQuery: FindNearbyLocationsQuery;
  private readonly getPopularLocationsQuery: GetPopularLocationsQuery;

  constructor(
    private readonly locationRepository: LocationRepository,
    private readonly eventRepository?: any
  ) {
    this.createLocationCommand = new CreateLocationCommand(locationRepository);
    this.updateLocationCommand = new UpdateLocationCommand(locationRepository);
    this.deleteLocationCommand = new DeleteLocationCommand(locationRepository, eventRepository);
    this.getLocationQuery = new GetLocationQuery(locationRepository);
    this.findNearbyLocationsQuery = new FindNearbyLocationsQuery(locationRepository);
    this.getPopularLocationsQuery = new GetPopularLocationsQuery(locationRepository);
  }

  /**
   * Crea una nueva ubicación
   * @param locationData Datos de la ubicación a crear
   * @returns DTO de la ubicación creada
   */
  async createLocation(locationData: CreateLocationDTO): Promise<LocationDTO> {
    const location = await this.createLocationCommand.execute(locationData);
    return LocationMapper.toDTO(location);
  }

  /**
   * Actualiza una ubicación existente
   * @param id ID de la ubicación a actualizar
   * @param updateData Datos a actualizar
   * @returns DTO de la ubicación actualizada
   */
  async updateLocation(id: string, updateData: UpdateLocationDTO): Promise<LocationDTO> {
    const location = await this.updateLocationCommand.execute({ id, data: updateData });
    return LocationMapper.toDTO(location);
  }

  /**
   * Elimina una ubicación
   * @param id ID de la ubicación a eliminar
   */
  async deleteLocation(id: string): Promise<void> {
    await this.deleteLocationCommand.execute(id);
  }

  /**
   * Obtiene una ubicación por ID
   * @param id ID de la ubicación a obtener
   * @returns DTO de la ubicación
   */
  async getLocation(id: string): Promise<LocationDTO> {
    return this.getLocationQuery.execute(id);
  }

  /**
   * Busca ubicaciones por nombre
   * @param name Nombre o parte del nombre de la ubicación
   * @returns Lista de DTOs de ubicaciones
   */
  async findLocationsByName(name: string): Promise<LocationDTO[]> {
    const locations = await this.locationRepository.findByName(name);
    return LocationMapper.toDTOList(locations);
  }

  /**
   * Busca ubicaciones por ciudad
   * @param city Nombre de la ciudad
   * @returns Lista de DTOs de ubicaciones
   */
  async findLocationsByCity(city: string): Promise<LocationDTO[]> {
    const locations = await this.locationRepository.findByCity(city);
    return LocationMapper.toDTOList(locations);
  }

  /**
   * Busca ubicaciones por país
   * @param country Nombre del país
   * @returns Lista de DTOs de ubicaciones
   */
  async findLocationsByCountry(country: string): Promise<LocationDTO[]> {
    const locations = await this.locationRepository.findByCountry(country);
    return LocationMapper.toDTOList(locations);
  }

  /**
   * Busca ubicaciones cercanas a unas coordenadas
   * @param latitude Latitud del punto central
   * @param longitude Longitud del punto central
   * @param radiusKm Radio en kilómetros
   * @returns Lista de DTOs de ubicaciones cercanas
   */
  async findNearbyLocations(latitude: number, longitude: number, radiusKm: number): Promise<LocationDTO[]> {
    return this.findNearbyLocationsQuery.execute({ latitude, longitude, radiusKm });
  }

  /**
   * Obtiene las ubicaciones más populares
   * @param limit Límite de ubicaciones a retornar por categoría
   * @returns Resultado con ciudades y países populares
   */
  async getPopularLocations(limit: number): Promise<PopularLocationsResult> {
    return this.getPopularLocationsQuery.execute(limit);
  }
} 