// Re-exportamos las interfaces de dominio
export { 
  UserRepository,
  UserFilterOptions,
  PaginationOptions,
  PaginatedUsersResult
} from '../../../eventhub-domain/src/users/repositories/UserRepository';

// DTOs
export * from './dtos/UserDTO';
export * from './dtos/CreateUserDTO';
export * from './dtos/UpdateUserDTO';

// Commands
export * from './commands/CreateUserCommand';
export * from './commands/UpdateUserCommand';
export * from './commands/DeleteUserCommand';

// Queries
export * from './queries/GetUserByIdQuery';
export * from './queries/GetUserByEmailQuery';
export * from './queries/GetUsersByRoleQuery';

// Mappers
export * from './mappers/UserMapper';

// Services
export * from './services/UserService'; 