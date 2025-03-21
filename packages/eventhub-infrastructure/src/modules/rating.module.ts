import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RatingEntity } from '../entities/rating.entity';
import { RatingRepository } from '../repositories/rating.repository';
import { 
  CreateRatingUseCase,
  GetEventRatingsUseCase,
  GetEventRatingStatsUseCase,
  GetUserRatingUseCase,
  UpdateRatingUseCase,
  DeleteRatingUseCase,
  RatingMapper
} from 'eventhub-application';
import { EventModule } from './event.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RatingEntity]),
    EventModule,
    UserModule,
  ],
  providers: [
    RatingRepository,
    RatingMapper,
    {
      provide: CreateRatingUseCase,
      useFactory: (ratingRepository, eventRepository, userRepository, ratingMapper) => {
        return new CreateRatingUseCase(ratingRepository, eventRepository, userRepository, ratingMapper);
      },
      inject: [RatingRepository, 'EventRepository', 'UserRepository', RatingMapper],
    },
    {
      provide: GetEventRatingsUseCase,
      useFactory: (ratingRepository, eventRepository, userRepository, ratingMapper) => {
        return new GetEventRatingsUseCase(ratingRepository, eventRepository, userRepository, ratingMapper);
      },
      inject: [RatingRepository, 'EventRepository', 'UserRepository', RatingMapper],
    },
    {
      provide: GetEventRatingStatsUseCase,
      useFactory: (ratingRepository, eventRepository) => {
        return new GetEventRatingStatsUseCase(ratingRepository, eventRepository);
      },
      inject: [RatingRepository, 'EventRepository'],
    },
    {
      provide: GetUserRatingUseCase,
      useFactory: (ratingRepository, eventRepository, ratingMapper) => {
        return new GetUserRatingUseCase(ratingRepository, eventRepository, ratingMapper);
      },
      inject: [RatingRepository, 'EventRepository', RatingMapper],
    },
    {
      provide: UpdateRatingUseCase,
      useFactory: (ratingRepository, ratingMapper) => {
        return new UpdateRatingUseCase(ratingRepository, ratingMapper);
      },
      inject: [RatingRepository, RatingMapper],
    },
    {
      provide: DeleteRatingUseCase,
      useFactory: (ratingRepository, userRepository) => {
        return new DeleteRatingUseCase(ratingRepository, userRepository);
      },
      inject: [RatingRepository, 'UserRepository'],
    },
  ],
  exports: [
    RatingRepository,
    RatingMapper,
    CreateRatingUseCase,
    GetEventRatingsUseCase,
    GetEventRatingStatsUseCase,
    GetUserRatingUseCase,
    UpdateRatingUseCase,
    DeleteRatingUseCase,
  ],
})
export class RatingModule {} 