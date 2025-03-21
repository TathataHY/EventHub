import { ReviewRepository } from '@eventhub/domain/dist/reviews/repositories/ReviewRepository';
import { Review } from '@eventhub/domain/dist/reviews/entities/Review';
import { ReviewAdapter } from './ReviewAdapter';

/**
 * Adaptador para el repositorio de reseñas que resuelve incompatibilidades de tipos
 * entre la capa de dominio y aplicación
 */
export class ReviewRepositoryAdapter {
  constructor(private repository: ReviewRepository) {}

  async findById(id: string): Promise<any> {
    const review = await (this.repository as any).findById(id);
    return ReviewAdapter.toApplication(review);
  }

  async findByUserId(userId: string): Promise<any[]> {
    const reviews = await this.repository.findByUserId(userId);
    return reviews.map(review => ReviewAdapter.toApplication(review));
  }

  async findByEventId(eventId: string): Promise<any[]> {
    const reviews = await this.repository.findByEventId(eventId);
    return reviews.map(review => ReviewAdapter.toApplication(review));
  }

  async findByUserIdAndEventId(userId: string, eventId: string): Promise<any> {
    if (typeof (this.repository as any).findByUserIdAndEventId !== 'function') {
      const reviews = await this.repository.findByUserId(userId);
      const review = reviews.find(r => r.eventId === eventId);
      return ReviewAdapter.toApplication(review);
    }
    
    const review = await (this.repository as any).findByUserIdAndEventId(userId, eventId);
    return ReviewAdapter.toApplication(review);
  }

  async findPendingModeration(options: any): Promise<any> {
    const result = await this.repository.findPendingModeration(options);
    return {
      reviews: result.reviews.map(review => ReviewAdapter.toApplication(review)),
      total: result.total
    };
  }

  async findRecentVerified(limit: number): Promise<any[]> {
    const reviews = await this.repository.findRecentVerified(limit);
    return reviews.map(review => ReviewAdapter.toApplication(review));
  }

  async save(review: any): Promise<void> {
    const domainReview = ReviewAdapter.toDomain(review);
    await (this.repository as any).save(domainReview);
  }

  async delete(reviewId: string): Promise<void> {
    await (this.repository as any).delete(reviewId);
  }

  async getEventReviewStats(eventId: string): Promise<any> {
    return await this.repository.getEventReviewStats(eventId);
  }

  async findWithFilters(filters: any, options: any): Promise<any> {
    const result = await this.repository.findWithFilters(filters, options);
    return {
      reviews: result.reviews.map(review => ReviewAdapter.toApplication(review)),
      total: result.total
    };
  }
  
  async hasUserReviewedEvent(userId: string, eventId: string): Promise<boolean> {
    return await this.repository.hasUserReviewedEvent(userId, eventId);
  }
} 