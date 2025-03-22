import { Review, ReviewProps } from '@eventhub/domain/src/reviews/entities/Review';
import { ReviewDTO } from '../dtos/ReviewDTO';
import { CreateReviewDTO } from '../dtos/CreateReviewDTO';
import { UpdateReviewDTO } from '../dtos/UpdateReviewDTO';
import { Mapper } from '../../core/interfaces/Mapper';

export class ReviewMapper implements Mapper<Review, ReviewDTO> {
  toDomain(dto: CreateReviewDTO | (ReviewDTO & UpdateReviewDTO)): Review {
    if ('id' in dto) {
      // Es un ReviewDTO o una combinación con UpdateReviewDTO
      return Review.reconstitute({
        id: dto.id,
        userId: dto.userId,
        eventId: dto.eventId,
        score: dto.score,
        content: dto.content,
        isActive: dto.isActive,
        isVerified: dto.isVerified,
        createdAt: dto.createdAt,
        updatedAt: new Date()
      });
    } else {
      // Es un CreateReviewDTO
      return Review.create({
        userId: dto.userId,
        eventId: dto.eventId,
        score: dto.score,
        content: dto.content
      });
    }
  }

  toDTO(domain: Review): ReviewDTO {
    return {
      id: domain.id,
      userId: domain.userId,
      eventId: domain.eventId,
      score: domain.score,
      content: domain.content,
      isActive: domain.isActive,
      isVerified: domain.isVerified,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    };
  }
} 