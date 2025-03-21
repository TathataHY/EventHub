import { Rating, RatingRepository, RatingDistribution } from '@eventhub/domain';
import { Injectable } from '@nestjs/common';

/**
 * Implementación en memoria del repositorio de calificaciones para pruebas
 */
@Injectable()
export class RatingRepositoryImpl implements RatingRepository {
  private ratings: Rating[] = [];

  async save(rating: Rating): Promise<Rating> {
    const existingIndex = this.ratings.findIndex(r => r.id === rating.id);
    
    if (existingIndex >= 0) {
      this.ratings[existingIndex] = rating;
    } else {
      this.ratings.push(rating);
    }
    
    return rating;
  }

  async findById(id: string): Promise<Rating | null> {
    const rating = this.ratings.find(r => r.id === id);
    return rating || null;
  }

  async findByEventId(eventId: string): Promise<Rating[]> {
    return this.ratings
      .filter(r => r.eventId === eventId && r.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByUserId(userId: string): Promise<Rating[]> {
    return this.ratings
      .filter(r => r.userId === userId && r.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findByEventIdAndUserId(eventId: string, userId: string): Promise<Rating | null> {
    const rating = this.ratings.find(r => r.eventId === eventId && r.userId === userId && r.isActive);
    return rating || null;
  }

  async getAverageRating(eventId: string): Promise<number> {
    const eventRatings = await this.findByEventId(eventId);
    
    if (eventRatings.length === 0) {
      return 0;
    }
    
    const sum = eventRatings.reduce((acc, rating) => acc + rating.score, 0);
    return sum / eventRatings.length;
  }

  async getRatingDistribution(eventId: string): Promise<RatingDistribution> {
    const distribution: RatingDistribution = {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
      total: 0
    };
    
    const eventRatings = await this.findByEventId(eventId);
    
    eventRatings.forEach(rating => {
      distribution[rating.score.toString()]++;
      distribution.total++;
    });
    
    return distribution;
  }

  async delete(id: string): Promise<void> {
    const rating = await this.findById(id);
    
    if (rating) {
      rating.deactivate();
      await this.save(rating);
    }
  }
}