import { Query } from '../../core/interfaces/Query';
import { ReviewDTO } from '../dtos/ReviewDTO';
import { ReviewMapper } from '../mappers/ReviewMapper';
import { ReviewRepository } from '@eventhub/domain/dist/reviews/repositories/ReviewRepository';

export class GetUserReviewForEventQuery implements Query<ReviewDTO | null> {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewMapper: ReviewMapper,
    private readonly userId: string,
    private readonly eventId: string
  ) {}

  async execute(): Promise<ReviewDTO | null> {
    const review = await this.reviewRepository.findByUserIdAndEventId(this.userId, this.eventId);
    return review ? this.reviewMapper.toDTO(review) : null;
  }
} 