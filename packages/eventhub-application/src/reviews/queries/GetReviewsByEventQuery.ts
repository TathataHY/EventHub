import { Query } from '../../core/interfaces/Query';
import { ReviewDTO } from '../dtos/ReviewDTO';
import { ReviewMapper } from '../mappers/ReviewMapper';
import { ReviewRepository } from '@eventhub/domain/dist/reviews/repositories/ReviewRepository';

export class GetReviewsByEventQuery implements Query<ReviewDTO[]> {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewMapper: ReviewMapper,
    private readonly eventId: string
  ) {}

  async execute(): Promise<ReviewDTO[]> {
    const reviews = await this.reviewRepository.findByEventId(this.eventId);
    return reviews.map(review => this.reviewMapper.toDTO(review));
  }
} 