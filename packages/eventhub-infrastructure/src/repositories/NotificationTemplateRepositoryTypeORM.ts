import { injectable } from 'inversify';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { INotificationTemplateRepository } from '../../../eventhub-domain/src/repositories/INotificationTemplateRepository';
import { NotificationTemplate } from '../../../eventhub-domain/src/value-objects/NotificationTemplate';
import { NotificationType } from '../../../eventhub-domain/src/value-objects/NotificationType';
import { NotificationChannel } from '../../../eventhub-domain/src/value-objects/NotificationChannel';
import { NotificationTemplateEntity } from '../entities/NotificationTemplateEntity';
import { NotificationTemplateMapper } from '../mappers/NotificationTemplateMapper';

/**
 * Implementación del repositorio de plantillas de notificación con TypeORM
 */
@injectable()
export class NotificationTemplateRepositoryTypeORM implements INotificationTemplateRepository {
  constructor(
    @InjectRepository(NotificationTemplateEntity)
    private repository: Repository<NotificationTemplateEntity>
  ) {}

  /**
   * Guarda una plantilla de notificación
   * @param template Plantilla a guardar
   * @returns Plantilla guardada
   */
  async save(template: NotificationTemplate): Promise<NotificationTemplate> {
    // Mapear del dominio a la entidad de TypeORM
    const entity = NotificationTemplateMapper.toEntity(template);
    
    // Guardar la entidad
    const savedEntity = await this.repository.save(entity);
    
    // Mapear la entidad guardada de vuelta al dominio
    return NotificationTemplateMapper.toDomain(savedEntity);
  }

  /**
   * Obtiene una plantilla por su ID
   * @param id ID de la plantilla
   * @returns Plantilla encontrada o null si no existe
   */
  async findById(id: string): Promise<NotificationTemplate | null> {
    const entity = await this.repository.findOne({ where: { id } });
    
    if (!entity) {
      return null;
    }
    
    return NotificationTemplateMapper.toDomain(entity);
  }

  /**
   * Obtiene todas las plantillas
   * @returns Lista de plantillas
   */
  async findAll(): Promise<NotificationTemplate[]> {
    const entities = await this.repository.find();
    return entities.map(entity => NotificationTemplateMapper.toDomain(entity));
  }

  /**
   * Obtiene plantillas por tipo de notificación
   * @param type Tipo de notificación
   * @returns Lista de plantillas para ese tipo
   */
  async findByType(type: NotificationType): Promise<NotificationTemplate[]> {
    const entities = await this.repository.find({ where: { notificationType: type } });
    return entities.map(entity => NotificationTemplateMapper.toDomain(entity));
  }

  /**
   * Obtiene plantillas por canal de notificación
   * @param channel Canal de notificación
   * @returns Lista de plantillas para ese canal
   */
  async findByChannel(channel: NotificationChannel): Promise<NotificationTemplate[]> {
    const entities = await this.repository.find({ where: { channel } });
    return entities.map(entity => NotificationTemplateMapper.toDomain(entity));
  }

  /**
   * Obtiene la plantilla activa para un tipo y canal específicos
   * @param type Tipo de notificación
   * @param channel Canal de notificación
   * @returns Plantilla activa o null si no hay ninguna
   */
  async findActiveTemplateForTypeAndChannel(
    type: NotificationType, 
    channel: NotificationChannel
  ): Promise<NotificationTemplate | null> {
    const entity = await this.repository.findOne({ 
      where: { 
        notificationType: type, 
        channel,
        active: true 
      } 
    });
    
    if (!entity) {
      return null;
    }
    
    return NotificationTemplateMapper.toDomain(entity);
  }

  /**
   * Elimina una plantilla
   * @param id ID de la plantilla
   * @returns true si se eliminó correctamente
   */
  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected !== undefined && result.affected > 0;
  }

  /**
   * Actualiza el estado activo de una plantilla
   * @param id ID de la plantilla
   * @param active Nuevo estado activo
   * @returns Plantilla actualizada o null si no existe
   */
  async updateActiveStatus(id: string, active: boolean): Promise<NotificationTemplate | null> {
    // Buscar la plantilla
    const entity = await this.repository.findOne({ where: { id } });
    
    if (!entity) {
      return null;
    }
    
    // Actualizar el estado activo
    entity.active = active;
    
    // Guardar los cambios
    const savedEntity = await this.repository.save(entity);
    
    // Mapear la entidad guardada de vuelta al dominio
    return NotificationTemplateMapper.toDomain(savedEntity);
  }
} 