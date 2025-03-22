import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RatingEntity } from '../entities/rating.entity';
import { Rating } from 'eventhub-application';
import { RatingRepository as RatingRepositoryInterface } from 'eventhub-application';

@Injectable()
export class RatingRepository implements RatingRepositoryInterface {
  constructor(
    @InjectRepository(RatingEntity)
    private readonly ratingRepository: Repository<RatingEntity>,
  ) {}

  async findById(id: string): Promise<Rating | null> {
    const ratingEntity = await this.ratingRepository.findOne({
      where: { id }
    });

    if (!ratingEntity) {
      return null;
    }

    return this.mapToDomain(ratingEntity);
  }

  async findByEventId(eventId: string): Promise<Rating[]> {
    const ratingEntities = await this.ratingRepository.find({
      where: { eventId },
      order: { createdAt: 'DESC' }
    });

    return ratingEntities.map(entity => this.mapToDomain(entity));
  }

  async findByUserId(userId: string): Promise<Rating[]> {
    const ratingEntities = await this.ratingRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });

    return ratingEntities.map(entity => this.mapToDomain(entity));
  }

  async findByEventAndUser(eventId: string, userId: string): Promise<Rating | null> {
    const ratingEntity = await this.ratingRepository.findOne({
      where: { eventId, userId }
    });

    if (!ratingEntity) {
      return null;
    }

    return this.mapToDomain(ratingEntity);
  }

  async save(rating: Rating): Promise<Rating> {
    const ratingEntity = this.mapToEntity(rating);
    const savedEntity = await this.ratingRepository.save(ratingEntity);
    return this.mapToDomain(savedEntity);
  }

  async update(rating: Rating): Promise<Rating> {
    await this.ratingRepository.update(
      { id: rating.id },
      {
        score: rating.score,
        review: rating.review,
        updatedAt: new Date()
      }
    );

    const updatedEntity = await this.ratingRepository.findOne({
      where: { id: rating.id }
    });

    if (!updatedEntity) {
      throw new Error(`Valoración con ID ${rating.id} no encontrada después de la actualización`);
    }

    return this.mapToDomain(updatedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.ratingRepository.delete({ id });
    return result.affected ? result.affected > 0 : false;
  }

  async getAverageScoreByEventId(eventId: string): Promise<number> {
    const result = await this.ratingRepository
      .createQueryBuilder('rating')
      .select('AVG(rating.score)', 'average')
      .where('rating.eventId = :eventId', { eventId })
      .getRawOne();

    return result && result.average ? parseFloat(Number(result.average).toFixed(1)) : 0;
  }

  async countByEventId(eventId: string): Promise<number> {
    return await this.ratingRepository.count({
      where: { eventId }
    });
  }

  private mapToDomain(entity: RatingEntity): Rating {
    const rating = new Rating();
    rating.id = entity.id;
    rating.eventId = entity.eventId;
    rating.userId = entity.userId;
    rating.score = entity.score;
    rating.review = entity.review || undefined;
    rating.createdAt = entity.createdAt;
    rating.updatedAt = entity.updatedAt;
    return rating;
  }

  private mapToEntity(domain: Rating): RatingEntity {
    const entity = new RatingEntity();
    if (domain.id) {
      entity.id = domain.id;
    }
    entity.eventId = domain.eventId;
    entity.userId = domain.userId;
    entity.score = domain.score;
    entity.review = domain.review || null;
    return entity;
  }
} 