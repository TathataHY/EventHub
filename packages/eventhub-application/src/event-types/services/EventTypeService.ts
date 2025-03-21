import { EventTypeDTO, CreateEventTypeDTO, UpdateEventTypeDTO, EventTypeSearchResultDTO } from '../dtos/EventTypeDTO';
import { CreateEventTypeCommand } from '../commands/CreateEventTypeCommand';
import { UpdateEventTypeCommand } from '../commands/UpdateEventTypeCommand';
import { GetEventTypeQuery } from '../queries/GetEventTypeQuery';
import { GetActiveEventTypesQuery } from '../queries/GetActiveEventTypesQuery';
import { SearchEventTypesQuery } from '../queries/SearchEventTypesQuery';
import { EventTypeRepository } from '../repositories/EventTypeRepository';
import { EventTypeMapper } from '../mappers/EventTypeMapper';

export class EventTypeService {
  private readonly createEventTypeCommand: CreateEventTypeCommand;
  private readonly updateEventTypeCommand: UpdateEventTypeCommand;
  private readonly getEventTypeQuery: GetEventTypeQuery;
  private readonly getActiveEventTypesQuery: GetActiveEventTypesQuery;
  private readonly searchEventTypesQuery: SearchEventTypesQuery;

  constructor(private readonly eventTypeRepository: EventTypeRepository) {
    this.createEventTypeCommand = new CreateEventTypeCommand(eventTypeRepository);
    this.updateEventTypeCommand = new UpdateEventTypeCommand(eventTypeRepository);
    this.getEventTypeQuery = new GetEventTypeQuery(eventTypeRepository);
    this.getActiveEventTypesQuery = new GetActiveEventTypesQuery(eventTypeRepository);
    this.searchEventTypesQuery = new SearchEventTypesQuery(eventTypeRepository);
  }

  /**
   * Crea un nuevo tipo de evento
   */
  async createEventType(data: CreateEventTypeDTO): Promise<EventTypeDTO> {
    const eventType = await this.createEventTypeCommand.execute(data);
    return EventTypeMapper.toDTO(eventType);
  }

  /**
   * Actualiza un tipo de evento existente
   */
  async updateEventType(id: string, data: UpdateEventTypeDTO): Promise<EventTypeDTO> {
    const eventType = await this.updateEventTypeCommand.execute({ id, data });
    return EventTypeMapper.toDTO(eventType);
  }

  /**
   * Obtiene un tipo de evento por ID
   */
  async getEventType(id: string): Promise<EventTypeDTO> {
    return this.getEventTypeQuery.execute(id);
  }

  /**
   * Obtiene los tipos de eventos activos
   */
  async getActiveEventTypes(): Promise<EventTypeDTO[]> {
    return this.getActiveEventTypesQuery.execute();
  }

  /**
   * Busca tipos de eventos
   */
  async searchEventTypes(page: number, limit: number, search?: string): Promise<EventTypeSearchResultDTO> {
    return this.searchEventTypesQuery.execute({ page, limit, search });
  }
} 