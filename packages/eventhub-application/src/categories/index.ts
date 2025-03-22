// Re-exportamos las interfaces de dominio
export { 
  CategoryRepository
} from '@eventhub/domain/src/categories/repositories/CategoryRepository';

// DTOs
export * from './dtos/CategoryDTO';
// Descomentamos cuando se creen estos DTOs
// export * from './dtos/CreateCategoryDTO';
// export * from './dtos/UpdateCategoryDTO';

// Commands
export * from './commands/CreateCategoryCommand';
export * from './commands/UpdateCategoryCommand';
export * from './commands/DeleteCategoryCommand';

// Queries
export * from './queries/GetCategoryQuery';
export * from './queries/GetCategoriesQuery';
export * from './queries/GetCategoryTreeQuery';
export * from './queries/GetPopularCategoriesQuery';

// Mappers
export * from './mappers/CategoryMapper';

// Services
export * from './services/CategoryService';

// Adapters
export { CategoryAdapter } from './adapters/CategoryAdapter';
export { CategoryRepositoryAdapter } from './adapters/CategoryRepositoryAdapter'; 