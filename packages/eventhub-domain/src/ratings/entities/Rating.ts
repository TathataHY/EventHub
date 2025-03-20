import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../../../core/interfaces/Entity';
import { RatingCreateException } from '../exceptions/RatingCreateException';
import { RatingUpdateException } from '../exceptions/RatingUpdateException';

/**
 * Entidad de calificación en el dominio
 * Implementa Entity para seguir el patrón común de entidades
 */
export class Rating implements Entity<string> {
  readonly id: string;
  readonly eventId: string;
  readonly userId: string;
  readonly score: number;
  readonly review: string | null;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  /**
   * Constructor privado de Rating
   * Se debe usar el método estático create() para crear instancias
   */
  private constructor(props: RatingProps) {
    this.id = props.id;
    this.eventId = props.eventId;
    this.userId = props.userId;
    this.score = props.score;
    this.review = props.review;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Crea una nueva calificación validando los datos
   * @param props Propiedades para crear la calificación
   * @returns Nueva instancia de Rating
   * @throws RatingCreateException si los datos no son válidos
   */
  static create(props: RatingCreateProps): Rating {
    const id = props.id || uuidv4();
    
    // Validar eventId
    if (!props.eventId) {
      throw new RatingCreateException('El ID del evento es requerido');
    }

    // Validar userId
    if (!props.userId) {
      throw new RatingCreateException('El ID del usuario es requerido');
    }

    // Validar score
    if (props.score < 1 || props.score > 5) {
      throw new RatingCreateException('La calificación debe estar entre 1 y 5');
    }

    // Validar review si existe
    if (props.review && props.review.length > 1000) {
      throw new RatingCreateException('La reseña no puede exceder los 1000 caracteres');
    }

    // Crear calificación
    return new Rating({
      id,
      eventId: props.eventId,
      userId: props.userId,
      score: props.score,
      review: props.review || null,
      isActive: props.isActive ?? true,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date()
    });
  }

  /**
   * Reconstruye un Rating desde almacenamiento (sin validaciones)
   * @param props Propiedades para reconstruir la calificación
   * @returns Instancia de Rating reconstruida
   */
  static reconstitute(props: RatingProps): Rating {
    return new Rating(props);
  }

  /**
   * Compara si dos entidades Rating son iguales por su identidad
   * @param entity Entidad a comparar
   * @returns true si las entidades tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof Rating)) {
      return false;
    }
    
    return this.id === entity.id;
  }

  /**
   * Actualiza la calificación
   * @param score Nueva puntuación (entre 1 y 5)
   * @returns Calificación actualizada
   * @throws RatingUpdateException si la puntuación no es válida
   */
  updateScore(score: number): Rating {
    if (score < 1 || score > 5) {
      throw new RatingUpdateException('La calificación debe estar entre 1 y 5');
    }

    return new Rating({
      ...this.toObject(),
      score,
      updatedAt: new Date()
    });
  }

  /**
   * Actualiza la reseña
   * @param review Nueva reseña
   * @returns Calificación actualizada
   * @throws RatingUpdateException si la reseña no es válida
   */
  updateReview(review: string | null): Rating {
    if (review && review.length > 1000) {
      throw new RatingUpdateException('La reseña no puede exceder los 1000 caracteres');
    }

    return new Rating({
      ...this.toObject(),
      review,
      updatedAt: new Date()
    });
  }

  /**
   * Desactiva la calificación (soft delete)
   * @returns Calificación desactivada
   */
  deactivate(): Rating {
    if (!this.isActive) {
      return this; // Ya está desactivada
    }

    return new Rating({
      ...this.toObject(),
      isActive: false,
      updatedAt: new Date()
    });
  }

  /**
   * Reactiva la calificación
   * @returns Calificación reactivada
   */
  activate(): Rating {
    if (this.isActive) {
      return this; // Ya está activada
    }

    return new Rating({
      ...this.toObject(),
      isActive: true,
      updatedAt: new Date()
    });
  }

  /**
   * Verifica si el usuario es el autor de la calificación
   * @param userId ID del usuario a verificar
   * @returns true si el usuario es el autor de la calificación
   */
  isAuthor(userId: string): boolean {
    return this.userId === userId;
  }

  /**
   * Convierte la entidad a un objeto plano
   * @returns Objeto plano con las propiedades de la calificación
   */
  toObject(): RatingProps {
    return {
      id: this.id,
      eventId: this.eventId,
      userId: this.userId,
      score: this.score,
      review: this.review,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * Props para reconstruir una calificación existente
 */
export interface RatingProps {
  id: string;
  eventId: string;
  userId: string;
  score: number;
  review: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Props para crear una nueva calificación
 */
export interface RatingCreateProps {
  id?: string;
  eventId: string;
  userId: string;
  score: number;
  review?: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} 