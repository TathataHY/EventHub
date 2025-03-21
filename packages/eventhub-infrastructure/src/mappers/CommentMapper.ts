import { Comment } from '@eventhub/domain';
import { CommentEntity } from '../entities/CommentEntity';

/**
 * Mapper para convertir entre Comment (dominio) y CommentEntity (infraestructura)
 */
export class CommentMapper {
  /**
   * Convierte una entidad de dominio Comment a una entidad de infraestructura CommentEntity
   * @param comment Entidad de dominio
   * @returns Entidad de infraestructura
   */
  toEntity(comment: Comment): CommentEntity {
    const entity = new CommentEntity();
    entity.id = comment.id;
    entity.eventId = comment.eventId;
    entity.userId = comment.userId;
    entity.content = comment.content;
    entity.isActive = comment.isActive;
    entity.parentId = comment.parentId;
    entity.createdAt = comment.createdAt;
    entity.updatedAt = comment.updatedAt;
    return entity;
  }

  /**
   * Convierte una entidad de infraestructura CommentEntity a una entidad de dominio Comment
   * @param entity Entidad de infraestructura
   * @returns Entidad de dominio
   */
  toDomain(entity: CommentEntity): Comment {
    return new Comment({
      id: entity.id,
      eventId: entity.eventId,
      userId: entity.userId,
      content: entity.content,
      isActive: entity.isActive,
      parentId: entity.parentId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }
} 