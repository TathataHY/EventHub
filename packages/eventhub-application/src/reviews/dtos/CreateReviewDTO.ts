export interface CreateReviewDTO {
  userId: string;
  eventId: string;
  score: number;
  content?: string;
} 