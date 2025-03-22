import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { CategoryRepository } from '../repositories/category.repository';
import { 
  CreateCategoryUseCase,
  GetCategoriesUseCase,
} from 'eventhub-application';
import { EventModule } from './event.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryEntity]),
    EventModule,
  ],
  providers: [
    CategoryRepository,
    {
      provide: CreateCategoryUseCase,
      useFactory: (categoryRepository) => {
        return new CreateCategoryUseCase(categoryRepository);
      },
      inject: [CategoryRepository],
    },
    {
      provide: GetCategoriesUseCase,
      useFactory: (categoryRepository, eventRepository) => {
        return new GetCategoriesUseCase(categoryRepository, eventRepository);
      },
      inject: [CategoryRepository, 'EventRepository'],
    },
  ],
  exports: [
    CategoryRepository,
    CreateCategoryUseCase,
    GetCategoriesUseCase,
  ],
})
export class CategoryModule {} 