import { OrganizerDTO, CreateOrganizerDTO, UpdateOrganizerDTO, VerifyOrganizerDTO } from '../dtos/OrganizerDTO';
import { CreateOrganizerCommand } from '../commands/CreateOrganizerCommand';
import { UpdateOrganizerCommand } from '../commands/UpdateOrganizerCommand';
import { DeleteOrganizerCommand } from '../commands/DeleteOrganizerCommand';
import { VerifyOrganizerCommand } from '../commands/VerifyOrganizerCommand';
import { UpdateOrganizerRatingCommand } from '../commands/UpdateOrganizerRatingCommand';
import { GetOrganizerQuery } from '../queries/GetOrganizerQuery';
import { GetOrganizerByUserIdQuery } from '../queries/GetOrganizerByUserIdQuery';
import { GetOrganizersByNameQuery } from '../queries/GetOrganizersByNameQuery';
import { GetVerifiedOrganizersQuery } from '../queries/GetVerifiedOrganizersQuery';
import { GetTopRatedOrganizersQuery } from '../queries/GetTopRatedOrganizersQuery';
import { GetMostActiveOrganizersQuery } from '../queries/GetMostActiveOrganizersQuery';
import { GetRecentOrganizersQuery } from '../queries/GetRecentOrganizersQuery';
import { OrganizerRepository } from '../../../../eventhub-domain/src/organizers/repositories/OrganizerRepository';
import { OrganizerMapper } from '../mappers/OrganizerMapper';

export class OrganizerService {
  private readonly createOrganizerCommand: CreateOrganizerCommand;
  private readonly updateOrganizerCommand: UpdateOrganizerCommand;
  private readonly deleteOrganizerCommand: DeleteOrganizerCommand;
  private readonly verifyOrganizerCommand: VerifyOrganizerCommand;
  private readonly updateOrganizerRatingCommand: UpdateOrganizerRatingCommand;
  private readonly getOrganizerQuery: GetOrganizerQuery;
  private readonly getOrganizerByUserIdQuery: GetOrganizerByUserIdQuery;
  private readonly getOrganizersByNameQuery: GetOrganizersByNameQuery;
  private readonly getVerifiedOrganizersQuery: GetVerifiedOrganizersQuery;
  private readonly getTopRatedOrganizersQuery: GetTopRatedOrganizersQuery;
  private readonly getMostActiveOrganizersQuery: GetMostActiveOrganizersQuery;
  private readonly getRecentOrganizersQuery: GetRecentOrganizersQuery;

  constructor(private readonly organizerRepository: OrganizerRepository) {
    this.createOrganizerCommand = new CreateOrganizerCommand(organizerRepository);
    this.updateOrganizerCommand = new UpdateOrganizerCommand(organizerRepository);
    this.deleteOrganizerCommand = new DeleteOrganizerCommand(organizerRepository);
    this.verifyOrganizerCommand = new VerifyOrganizerCommand(organizerRepository);
    this.updateOrganizerRatingCommand = new UpdateOrganizerRatingCommand(organizerRepository);
    this.getOrganizerQuery = new GetOrganizerQuery(organizerRepository);
    this.getOrganizerByUserIdQuery = new GetOrganizerByUserIdQuery(organizerRepository);
    this.getOrganizersByNameQuery = new GetOrganizersByNameQuery(organizerRepository);
    this.getVerifiedOrganizersQuery = new GetVerifiedOrganizersQuery(organizerRepository);
    this.getTopRatedOrganizersQuery = new GetTopRatedOrganizersQuery(organizerRepository);
    this.getMostActiveOrganizersQuery = new GetMostActiveOrganizersQuery(organizerRepository);
    this.getRecentOrganizersQuery = new GetRecentOrganizersQuery(organizerRepository);
  }

  /**
   * Crea un nuevo organizador
   */
  async createOrganizer(data: CreateOrganizerDTO): Promise<OrganizerDTO> {
    const organizer = await this.createOrganizerCommand.execute(data);
    return OrganizerMapper.toDTO(organizer);
  }

  /**
   * Actualiza un organizador existente
   */
  async updateOrganizer(id: string, data: UpdateOrganizerDTO): Promise<OrganizerDTO> {
    const organizer = await this.updateOrganizerCommand.execute({ id, data });
    return OrganizerMapper.toDTO(organizer);
  }

  /**
   * Elimina un organizador
   */
  async deleteOrganizer(id: string): Promise<void> {
    await this.deleteOrganizerCommand.execute(id);
  }

  /**
   * Verifica o desverifica un organizador
   */
  async verifyOrganizer(id: string, data: VerifyOrganizerDTO): Promise<OrganizerDTO> {
    const organizer = await this.verifyOrganizerCommand.execute({ id, data });
    return OrganizerMapper.toDTO(organizer);
  }

  /**
   * Actualiza la calificación de un organizador
   */
  async updateOrganizerRating(id: string, rating: number): Promise<OrganizerDTO> {
    const organizer = await this.updateOrganizerRatingCommand.execute({ id, rating });
    return OrganizerMapper.toDTO(organizer);
  }

  /**
   * Obtiene un organizador por ID
   */
  async getOrganizer(id: string): Promise<OrganizerDTO> {
    return this.getOrganizerQuery.execute(id);
  }

  /**
   * Obtiene un organizador por ID de usuario
   */
  async getOrganizerByUserId(userId: string): Promise<OrganizerDTO> {
    return this.getOrganizerByUserIdQuery.execute(userId);
  }

  /**
   * Obtiene organizadores por nombre
   */
  async getOrganizersByName(name: string): Promise<OrganizerDTO[]> {
    return this.getOrganizersByNameQuery.execute(name);
  }

  /**
   * Obtiene organizadores verificados
   */
  async getVerifiedOrganizers(): Promise<OrganizerDTO[]> {
    return this.getVerifiedOrganizersQuery.execute();
  }

  /**
   * Obtiene los organizadores mejor valorados
   */
  async getTopRatedOrganizers(limit: number): Promise<OrganizerDTO[]> {
    return this.getTopRatedOrganizersQuery.execute(limit);
  }

  /**
   * Obtiene los organizadores más activos
   */
  async getMostActiveOrganizers(limit: number): Promise<OrganizerDTO[]> {
    return this.getMostActiveOrganizersQuery.execute(limit);
  }

  /**
   * Obtiene los organizadores recientes
   */
  async getRecentOrganizers(limit: number): Promise<OrganizerDTO[]> {
    return this.getRecentOrganizersQuery.execute(limit);
  }
} 