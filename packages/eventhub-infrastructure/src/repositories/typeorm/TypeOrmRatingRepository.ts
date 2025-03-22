import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rating, RatingRepository, RatingDistribution } from '@eventhub/domain';
import { Repository } from 'typeorm';
import { RatingEntity } from '../../entities/typeorm/RatingEntity';

/**
 * Implementación de repositorio de calificaciones con TypeORM
 */
@Injectable()
export class TypeOrmRatingRepository implements RatingRepository {
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>
  ) {}

  async save(rating: Rating): Promise<Rating> {
    const ratingEntity = this.toEntity(rating);
    const savedEntity = await this.ratingRepository.save(ratingEntity);
    return this.toDomain(savedEntity);
  }

  async findById(id: string): Promise<Rating | null> {
    const entity = await this.ratingRepository.findOne({
      where: { id }
    });
    
    if (!entity) {
      return null;
    }

    return this.toDomain(entity);
  }

  async findByEventId(eventId: string): Promise<Rating[]> {
    const entities = await this.ratingRepository.find({
      where: { eventId, isActive: true },
      order: { createdAt: 'DESC' }
    });

    return entities.map(entity => this.toDomain(entity));
  }

  async findByUserId(userId: string): Promise<Rating[]> {
    const entities = await this.ratingRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' }
    });

    return entities.map(entity => this.toDomain(entity));
  }

  async findByEventIdAndUserId(eventId: string, userId: string): Promise<Rating | null> {
    const entity = await this.ratingRepository.findOne({
      where: { eventId, userId, isActive: true }
    });

    if (!entity) {
      return null;
    }

    return this.toDomain(entity);
  }

  async getAverageRating(eventId: string): Promise<number> {
    const result = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.score)', 'average')
      .where('rating.eventId = :eventId', { eventId })
      .andWhere('rating.isActive = :isActive', { isActive: true })
      .getRawOne();

    return result?.average ? parseFloat(result.average) : 0;
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

    const results = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('rating.score', 'score')
      .addSelect('COUNT(rating.id)', 'count')
      .where('rating.eventId = :eventId', { eventId })
      .andWhere('rating.isActive = :isActive', { isActive: true })
      .groupBy('rating.score')
      .getRawMany();

    results.forEach(result => {
      const score = result.score.toString();
      distribution[score] = parseInt(result.count);
      distribution.total += parseInt(result.count);
    });

    return distribution;
  }

  async delete(id: string): Promise<void> {
    await this.ratingRepository.update(id, { isActive: false });
  }

  private toEntity(rating: Rating): RatingEntity {
    const entity = new RatingEntity();
    entity.id = rating.id;
    entity.eventId = rating.eventId;
    entity.userId = rating.userId;
    entity.score = rating.score;
    entity.review = rating.review;
    entity.isActive = rating.isActive;
    entity.createdAt = rating.createdAt;
    entity.updatedAt = rating.updatedAt;
    return entity;
  }

  private toDomain(entity: RatingEntity): Rating {
    return new Rating({
      id: entity.id,
      eventId: entity.eventId,
      userId: entity.userId,
      score: entity.score,
      review: entity.review,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    });
  }
} 