import { Query } from '../../core/interfaces/Query';
import { ReviewDTO } from '../dtos/ReviewDTO';
import { ReviewMapper } from '../mappers/ReviewMapper';
import { ReviewRepository } from '@eventhub/domain/dist/reviews/repositories/ReviewRepository';

export class GetReviewsByUserQuery implements Query<ReviewDTO[]> {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewMapper: ReviewMapper,
    private readonly userId: string
  ) {}

  async execute(): Promise<ReviewDTO[]> {
    const reviews = await this.reviewRepository.findByUserId(this.userId);
    return reviews.map(review => this.reviewMapper.toDTO(review));
  }
} 