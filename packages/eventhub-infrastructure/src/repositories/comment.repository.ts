import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { Comment } from 'eventhub-application';
import { CommentRepository as CommentRepositoryInterface } from 'eventhub-application';

@Injectable()
export class CommentRepository implements CommentRepositoryInterface {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentRepository: Repository<CommentEntity>,
  ) {}

  async findById(id: string): Promise<Comment | null> {
    const commentEntity = await this.commentRepository.findOne({
      where: { id }
    });

    if (!commentEntity) {
      return null;
    }

    return this.mapToDomain(commentEntity);
  }

  async findByEventId(eventId: string): Promise<Comment[]> {
    const commentEntities = await this.commentRepository.find({
      where: { eventId, isDeleted: false },
      order: { createdAt: 'DESC' }
    });

    return commentEntities.map(entity => this.mapToDomain(entity));
  }

  async findByUserId(userId: string): Promise<Comment[]> {
    const commentEntities = await this.commentRepository.find({
      where: { userId, isDeleted: false },
      order: { createdAt: 'DESC' }
    });

    return commentEntities.map(entity => this.mapToDomain(entity));
  }

  async findReplies(commentId: string): Promise<Comment[]> {
    const replyEntities = await this.commentRepository.find({
      where: { parentId: commentId, isDeleted: false },
      order: { createdAt: 'ASC' }
    });

    return replyEntities.map(entity => this.mapToDomain(entity));
  }

  async save(comment: Comment): Promise<Comment> {
    const commentEntity = this.mapToEntity(comment);
    const savedEntity = await this.commentRepository.save(commentEntity);
    return this.mapToDomain(savedEntity);
  }

  async update(comment: Comment): Promise<Comment> {
    await this.commentRepository.update(
      { id: comment.id },
      {
        content: comment.content,
        isDeleted: comment.isDeleted,
        updatedAt: new Date()
      }
    );

    const updatedEntity = await this.commentRepository.findOne({
      where: { id: comment.id }
    });

    if (!updatedEntity) {
      throw new Error(`Comentario con ID ${comment.id} no encontrado después de la actualización`);
    }

    return this.mapToDomain(updatedEntity);
  }

  async delete(id: string): Promise<boolean> {
    // Soft delete - marcar como eliminado
    const result = await this.commentRepository.update(
      { id },
      { isDeleted: true, updatedAt: new Date() }
    );

    return result.affected ? result.affected > 0 : false;
  }

  async countByEventId(eventId: string): Promise<number> {
    return await this.commentRepository.count({
      where: { eventId, isDeleted: false }
    });
  }

  private mapToDomain(entity: CommentEntity): Comment {
    const comment = new Comment();
    comment.id = entity.id;
    comment.eventId = entity.eventId;
    comment.userId = entity.userId;
    comment.content = entity.content;
    comment.parentId = entity.parentId || undefined;
    comment.createdAt = entity.createdAt;
    comment.updatedAt = entity.updatedAt;
    comment.isDeleted = entity.isDeleted;
    return comment;
  }

  private mapToEntity(domain: Comment): CommentEntity {
    const entity = new CommentEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.eventId = domain.eventId;
    entity.userId = domain.userId;
    entity.content = domain.content;
    entity.parentId = domain.parentId || null;
    entity.isDeleted = domain.isDeleted;
    entity.createdAt = domain.createdAt;
    entity.updatedAt = domain.updatedAt;
    return entity;
  }
} 