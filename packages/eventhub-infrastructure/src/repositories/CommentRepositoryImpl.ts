import { Comment, CommentRepository } from '@eventhub/domain';
import { Repository, DataSource } from 'typeorm';
import { CommentEntity } from '../entities/CommentEntity';
import { CommentMapper } from '../mappers/CommentMapper';
import { Injectable } from '@nestjs/common';

/**
 * Implementación del repositorio de comentarios utilizando TypeORM
 */
@Injectable()
export class CommentRepositoryImpl implements CommentRepository {
  private repository: Repository<CommentEntity>;
  private mapper: CommentMapper;

  constructor(
    private dataSource: DataSource
  ) {
    this.repository = this.dataSource.getRepository(CommentEntity);
    this.mapper = new CommentMapper();
  }

  async save(comment: Comment): Promise<Comment> {
    const entity = this.mapper.toEntity(comment);
    const savedEntity = await this.repository.save(entity);
    return this.mapper.toDomain(savedEntity);
  }

  async findById(id: string): Promise<Comment | null> {
    const entity = await this.repository.findOne({
      where: { id },
      relations: ['parent', 'replies']
    });
    
    if (!entity) {
      return null;
    }

    return this.mapper.toDomain(entity);
  }

  async findByEventId(eventId: string): Promise<Comment[]> {
    const entities = await this.repository.find({
      where: { eventId, isActive: true },
      order: { createdAt: 'DESC' },
      relations: ['parent', 'replies']
    });

    return entities.map(entity => this.mapper.toDomain(entity));
  }

  async findByUserId(userId: string): Promise<Comment[]> {
    const entities = await this.repository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' }
    });

    return entities.map(entity => this.mapper.toDomain(entity));
  }

  async findByEventIdAndUserId(eventId: string, userId: string): Promise<Comment[]> {
    const entities = await this.repository.find({
      where: { eventId, userId, isActive: true },
      order: { createdAt: 'DESC' }
    });

    return entities.map(entity => this.mapper.toDomain(entity));
  }

  async findByParentId(parentId: string): Promise<Comment[]> {
    const entities = await this.repository.find({
      where: { parentId, isActive: true },
      order: { createdAt: 'ASC' }
    });

    return entities.map(entity => this.mapper.toDomain(entity));
  }

  async delete(id: string): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }
} 