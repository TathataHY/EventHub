import { Command } from '../../core/interfaces/Command';
import { ValidationException, NotFoundException, UnauthorizedException } from '../../core/exceptions';
import { ReviewRepository } from '@eventhub/domain/dist/reviews/repositories/ReviewRepository';
import { UserRepository } from '@eventhub/domain/dist/users/repositories/UserRepository';
import { RoleEnum } from '@eventhub/domain/dist/users/value-objects/Role';
import { UserAdapter } from '../../users/adapters/UserAdapter';
import { ReviewAdapter } from '../adapters/ReviewAdapter';

/**
 * Comando para verificar una reseña
 */
export class VerifyReviewCommand implements Command<void> {
  constructor(
    private readonly reviewId: string,
    private readonly moderatorId: string,
    private readonly reviewRepository: ReviewRepository,
    private readonly userRepository: UserRepository
  ) {}

  /**
   * Ejecuta el comando para verificar una reseña
   * @returns Promise<void>
   * @throws ValidationException si hay problemas de validación
   * @throws NotFoundException si la reseña no existe
   * @throws UnauthorizedException si el usuario no tiene permisos
   */
  async execute(): Promise<void> {
    // Validación básica
    if (!this.reviewId) {
      throw new ValidationException('El ID de la reseña es requerido');
    }

    if (!this.moderatorId) {
      throw new ValidationException('El ID del moderador es requerido');
    }

    // Verificar permisos de usuario (solo moderadores y administradores)
    const userDomain = await this.userRepository.findById(this.moderatorId);
    const user = UserAdapter.toApplication(userDomain);
    
    if (!user) {
      throw new ValidationException('Usuario no encontrado');
    }

    if (user.role !== RoleEnum.ADMIN && user.role !== RoleEnum.MODERATOR) {
      throw new UnauthorizedException('Solo los moderadores y administradores pueden verificar reseñas');
    }

    // Buscar la reseña
    const reviewDomain = await this.reviewRepository.findById(this.reviewId);
    const review = ReviewAdapter.toApplication(reviewDomain);
    
    if (!review) {
      throw new NotFoundException(`Reseña con ID ${this.reviewId} no encontrada`);
    }

    // No permitir verificar reseñas inactivas
    if (!review.isActive) {
      throw new ValidationException('No se puede verificar una reseña inactiva');
    }

    // No hacer nada si ya está verificada
    if (review.isVerified) {
      return;
    }

    // Verificar la reseña
    const verifiedReview = review.verify();
    
    // Guardar los cambios
    await this.reviewRepository.save(verifiedReview);
  }
} 