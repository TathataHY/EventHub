// Repositorios y entidades
import { ReviewRepositoryAdapter } from './adapters/ReviewRepositoryAdapter';

// Importaciones de tipos
import type { ReviewRepository, ReviewFilters, PaginationOptions, ReviewDistribution } from '@eventhub/domain/dist/reviews/repositories/ReviewRepository';

// DTOs
import { CreateReviewDTO } from './dtos/CreateReviewDTO';
import { UpdateReviewDTO } from './dtos/UpdateReviewDTO';
import { ReviewDTO } from './dtos/ReviewDTO';
import { ReviewDistributionDTO } from './dtos/ReviewDistributionDTO';

// Mappers
import { ReviewMapper } from './mappers/ReviewMapper';
import { ReviewDistributionMapper } from './mappers/ReviewDistributionMapper';

// Commands
import { CreateReviewCommand } from './commands/CreateReviewCommand';
import { UpdateReviewCommand } from './commands/UpdateReviewCommand';
import { DeleteReviewCommand } from './commands/DeleteReviewCommand';
import { VerifyReviewCommand } from './commands/VerifyReviewCommand';
import { ModerateReviewCommand } from './commands/ModerateReviewCommand';

// Queries
import { GetReviewQuery } from './queries/GetReviewQuery';
import { GetEventReviewsQuery } from './queries/GetEventReviewsQuery';
import { GetUserReviewsQuery } from './queries/GetUserReviewsQuery';
import { GetUserReviewForEventQuery } from './queries/GetUserReviewForEventQuery';
import { GetEventReviewStatsQuery } from './queries/GetEventReviewStatsQuery';
import { GetReviewDistributionQuery } from './queries/GetReviewDistributionQuery';
import { GetPendingModerationReviewsQuery } from './queries/GetPendingModerationReviewsQuery';
import { FindRecentVerifiedReviewsQuery } from './queries/FindRecentVerifiedReviewsQuery';
import { FindPendingModerationReviewsQuery } from './queries/FindPendingModerationReviewsQuery';

// Tipos
export type {
  ReviewRepository,
  ReviewFilters,
  PaginationOptions,
  ReviewDistribution,
  // DTOs
  CreateReviewDTO,
  UpdateReviewDTO,
  ReviewDTO,
  ReviewDistributionDTO
};

// Mappers
export {
  ReviewMapper,
  ReviewDistributionMapper
};

// Adaptadores
export {
  ReviewRepositoryAdapter
};

// Commands
export {
  CreateReviewCommand,
  UpdateReviewCommand,
  DeleteReviewCommand,
  VerifyReviewCommand,
  ModerateReviewCommand
};

// Queries
export {
  GetReviewQuery,
  GetEventReviewsQuery,
  GetUserReviewsQuery,
  GetUserReviewForEventQuery,
  GetEventReviewStatsQuery,
  GetReviewDistributionQuery,
  GetPendingModerationReviewsQuery,
  FindRecentVerifiedReviewsQuery,
  FindPendingModerationReviewsQuery
}; 