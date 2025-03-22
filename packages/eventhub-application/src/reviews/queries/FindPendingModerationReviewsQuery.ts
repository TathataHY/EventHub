import { Query } from '../../core/interfaces/Query';
import { ValidationException, UnauthorizedException } from '../../core/exceptions';
import { ReviewRepository } from '@eventhub/domain/dist/reviews/repositories/ReviewRepository';
import { ReviewDTO } from '../dtos/ReviewDTO';
import { ReviewMapper } from '../mappers/ReviewMapper';
import { UserRepository } from '@eventhub/domain/dist/users/repositories/UserRepository';
import { RoleEnum } from '@eventhub/domain/dist/users/value-objects/Role';
import { UserAdapter } from '../../users/adapters/UserAdapter';
import { ReviewAdapter } from '../adapters/ReviewAdapter';
import { ReviewRepositoryAdapter } from '../adapters/ReviewRepositoryAdapter';

/**
 * Opciones para la búsqueda de reseñas pendientes de moderación
 */
export interface PendingReviewsOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
}

/**
 * Resultado paginado para reseñas pendientes de moderación
 */
export interface PendingReviewsResult {
  reviews: ReviewDTO[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Consulta para obtener reseñas pendientes de moderación
 */
export class FindPendingModerationReviewsQuery implements Query<PendingReviewsOptions, PendingReviewsResult> {
  private userId?: string;
  
  constructor(
    private reviewRepository: ReviewRepositoryAdapter,
    private reviewMapper: ReviewMapper,
    userId?: string
  ) {
    this.userId = userId;
  }
  
  /**
   * Configura el ID del usuario moderador
   */
  withUserId(userId: string): FindPendingModerationReviewsQuery {
    this.userId = userId;
    return this;
  }

  /**
   * Ejecuta la consulta para obtener reseñas pendientes de moderación
   * @returns Promise<PendingReviewsResult> Lista paginada de reseñas pendientes de moderación
   * @throws ValidationException si hay problemas de validación
   * @throws UnauthorizedException si el usuario no tiene permisos
   */
  async execute(options?: PendingReviewsOptions): Promise<PendingReviewsResult> {
    // Validación
    if (!this.userId) {
      throw new ValidationException('El ID de usuario es requerido');
    }

    // Verificar permisos de usuario (solo moderadores y administradores)
    const userDomain = await this.userRepository.findById(this.userId);
    const user = UserAdapter.toApplication(userDomain);
    
    if (!user) {
      throw new ValidationException('Usuario no encontrado');
    }

    if (user.role !== RoleEnum.ADMIN && user.role !== RoleEnum.MODERATOR) {
      throw new UnauthorizedException('Solo los moderadores y administradores pueden acceder a reseñas pendientes de moderación');
    }

    // Configurar opciones de paginación
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const sortBy = options?.sortBy || 'createdAt';
    const sortOrder = options?.sortOrder || 'desc';
    
    // Configurar opciones para el repositorio
    const paginationOptions = {
      page,
      limit,
      sortBy,
      sortOrder
    };
    
    // Obtener reseñas pendientes de moderación
    const result = await this.reviewRepository.findPendingModeration(paginationOptions);
    
    // Transformar a DTOs
    const reviews = result.reviews.map(review => this.reviewMapper.toDTO(review));
    
    // Devolver resultado paginado
    return {
      reviews,
      total: result.total,
      page,
      limit,
      totalPages: Math.ceil(result.total / limit)
    };
  }
} 