export interface ReviewDTO {
  id: string;
  userId: string;
  eventId: string;
  score: number;
  content: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
} 