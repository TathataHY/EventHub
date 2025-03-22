import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from '../entities/comment.entity';
import { CommentRepository } from '../repositories/comment.repository';
import { 
  CreateCommentUseCase,
  GetEventCommentsUseCase,
} from 'eventhub-application';
import { EventModule } from './event.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    EventModule,
    UserModule,
  ],
  providers: [
    CommentRepository,
    {
      provide: CreateCommentUseCase,
      useFactory: (commentRepository, eventRepository, userRepository) => {
        return new CreateCommentUseCase(commentRepository, eventRepository, userRepository);
      },
      inject: [CommentRepository, 'EventRepository', 'UserRepository'],
    },
    {
      provide: GetEventCommentsUseCase,
      useFactory: (commentRepository, eventRepository, userRepository) => {
        return new GetEventCommentsUseCase(commentRepository, eventRepository, userRepository);
      },
      inject: [CommentRepository, 'EventRepository', 'UserRepository'],
    },
  ],
  exports: [
    CommentRepository,
    CreateCommentUseCase,
    GetEventCommentsUseCase,
  ],
})
export class CommentModule {} 