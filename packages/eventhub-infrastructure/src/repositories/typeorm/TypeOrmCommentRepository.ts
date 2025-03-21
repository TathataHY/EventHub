import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment, CommentRepository } from '@eventhub/domain';
import { Repository } from 'typeorm';
import { CommentEntity } from '../../entities/typeorm/CommentEntity';

/**
 * Implementación de repositorio de comentarios con TypeORM
 */
@Injectable()
export class TypeOrmCommentRepository implements CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>
  ) {}

  async save(comment: Comment): Promise<Comment> {
    const commentEntity = this.toEntity(comment);
    const savedEntity = await this.commentRepository.save(commentEntity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<Comment | null> {
    const entity = await this.commentRepository.findOne({
      where: { id },
      relations: ['parent', 'replies']
    });
    
    if (!entity) {
      return null;
    }

    return this.toDomain(entity);
  }

  async findByEventId(eventId: string): Promise<Comment[]> {
    const entities = await this.commentRepository.find({
      where: { eventId, isActive: true, parentId: null },
      order: { createdAt: 'DESC' },
      relations: ['replies']
    });

    return entities.map(entity => this.toDomain(entity));
  }

  async findByUserId(userId: string): Promise<Comment[]> {
    const entities = await this.commentRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' }
    });

    return entities.map(entity => this.toDomain(entity));
  }

  async findByEventIdAndUserId(eventId: string, userId: string): Promise<Comment[]> {
    const entities = await this.commentRepository.find({
      where: { eventId, userId, isActive: true },
      order: { createdAt: 'DESC' }
    });

    return entities.map(entity => this.toDomain(entity));
  }

  async findByParentId(parentId: string): Promise<Comment[]> {
    const entities = await this.commentRepository.find({
      where: { parentId, isActive: true },
      order: { createdAt: 'ASC' }
    });

    return entities.map(entity => this.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.commentRepository.update(id, { isActive: false });
  }

  private toEntity(comment: Comment): CommentEntity {
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

  private toDomain(entity: CommentEntity): Comment {
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