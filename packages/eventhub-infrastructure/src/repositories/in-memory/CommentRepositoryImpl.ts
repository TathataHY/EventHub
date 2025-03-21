import { Comment, CommentRepository } from '@eventhub/domain';
import { Injectable } from '@nestjs/common';

/**
 * Implementación en memoria del repositorio de comentarios para pruebas
 */
@Injectable()
export class CommentRepositoryImpl implements CommentRepository {
  private comments: Comment[] = [];

  async save(comment: Comment): Promise<Comment> {
    const existingIndex = this.comments.findIndex(c => c.id === comment.id);
    
    if (existingIndex >= 0) {
      this.comments[existingIndex] = comment;
    } else {
      this.comments.push(comment);
    }
    
    return comment;
  }

  async findById(id: string): Promise<Comment | null> {
    const comment = this.comments.find(c => c.id === id);
    return comment || null;
  }

  async findByEventId(eventId: string): Promise<Comment[]> {
    return this.comments
      .filter(c => c.eventId === eventId && c.isActive && c.parentId === null)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByUserId(userId: string): Promise<Comment[]> {
    return this.comments
      .filter(c => c.userId === userId && c.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByEventIdAndUserId(eventId: string, userId: string): Promise<Comment[]> {
    return this.comments
      .filter(c => c.eventId === eventId && c.userId === userId && c.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByParentId(parentId: string): Promise<Comment[]> {
    return this.comments
      .filter(c => c.parentId === parentId && c.isActive)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  async delete(id: string): Promise<void> {
    const comment = await this.findById(id);
    
    if (comment) {
      comment.deactivate();
      await this.save(comment);
    }
  }
} 