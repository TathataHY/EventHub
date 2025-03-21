import { CreateReviewDTO } from '../dtos/CreateReviewDTO';
import { UpdateReviewDTO } from '../dtos/UpdateReviewDTO';
import { ReviewDTO } from '../dtos/ReviewDTO';
import { CreateReviewCommand } from '../commands/CreateReviewCommand';
import { UpdateReviewCommand } from '../commands/UpdateReviewCommand';
import { DeleteReviewCommand } from '../commands/DeleteReviewCommand';
import { GetReviewQuery } from '../queries/GetReviewQuery';
import { GetReviewsByEventQuery } from '../queries/GetReviewsByEventQuery';
import { GetReviewsByUserQuery } from '../queries/GetReviewsByUserQuery';
import { GetUserReviewForEventQuery } from '../queries/GetUserReviewForEventQuery';
import { ReviewRepository } from '@eventhub/domain/dist/reviews/repositories/ReviewRepository';
import { ReviewMapper } from '../mappers/ReviewMapper';

export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly reviewMapper: ReviewMapper
  ) {}

  async createReview(reviewData: CreateReviewDTO): Promise<void> {
    const command = new CreateReviewCommand(
      this.reviewRepository,
      this.reviewMapper,
      reviewData
    );
    await command.execute();
  }

  async updateReview(reviewId: string, userId: string, reviewData: UpdateReviewDTO): Promise<void> {
    const command = new UpdateReviewCommand(
      this.reviewRepository,
      this.reviewMapper,
      reviewId,
      userId,
      reviewData
    );
    await command.execute();
  }

  async deleteReview(reviewId: string, userId: string): Promise<void> {
    const command = new DeleteReviewCommand(
      this.reviewRepository,
      reviewId,
      userId
    );
    await command.execute();
  }

  async getReview(reviewId: string): Promise<ReviewDTO> {
    const query = new GetReviewQuery(
      this.reviewRepository,
      this.reviewMapper,
      reviewId
    );
    return query.execute();
  }

  async getReviewsByEvent(eventId: string): Promise<ReviewDTO[]> {
    const query = new GetReviewsByEventQuery(
      this.reviewRepository,
      this.reviewMapper,
      eventId
    );
    return query.execute();
  }

  async getReviewsByUser(userId: string): Promise<ReviewDTO[]> {
    const query = new GetReviewsByUserQuery(
      this.reviewRepository,
      this.reviewMapper,
      userId
    );
    return query.execute();
  }

  async getUserReviewForEvent(userId: string, eventId: string): Promise<ReviewDTO | null> {
    const query = new GetUserReviewForEventQuery(
      this.reviewRepository,
      this.reviewMapper,
      userId,
      eventId
    );
    return query.execute();
  }
} 