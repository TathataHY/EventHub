import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../../../core/interfaces/Entity';
import { ReviewCreateException } from '../exceptions/ReviewCreateException';
import { ReviewUpdateException } from '../exceptions/ReviewUpdateException';

/**
 * Entidad de reseña en el dominio
 * Combina calificación y comentario en una sola entidad
 * Implementa Entity para seguir el patrón común de entidades
 */
export class Review implements Entity<string> {
  readonly id: string;
  readonly eventId: string;
  readonly userId: string;
  readonly score: number;
  readonly content: string | null;
  readonly isActive: boolean;
  readonly isVerified: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  /**
   * Constructor privado de Review
   * Se debe usar el método estático create() para crear instancias
   */
  private constructor(props: ReviewProps) {
    this.id = props.id;
    this.eventId = props.eventId;
    this.userId = props.userId;
    this.score = props.score;
    this.content = props.content;
    this.isActive = props.isActive;
    this.isVerified = props.isVerified;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Crea una nueva reseña validando los datos
   * @param props Propiedades para crear la reseña
   * @returns Nueva instancia de Review
   * @throws ReviewCreateException si los datos no son válidos
   */
  static create(props: ReviewCreateProps): Review {
    const id = props.id || uuidv4();
    
    // Validar eventId
    if (!props.eventId) {
      throw new ReviewCreateException('El ID del evento es requerido');
    }

    // Validar userId
    if (!props.userId) {
      throw new ReviewCreateException('El ID del usuario es requerido');
    }

    // Validar score
    if (props.score < 1 || props.score > 5) {
      throw new ReviewCreateException('La calificación debe estar entre 1 y 5');
    }

    // Validar content si existe
    if (props.content && props.content.length > 1000) {
      throw new ReviewCreateException('La reseña no puede exceder los 1000 caracteres');
    }

    // Crear reseña
    return new Review({
      id,
      eventId: props.eventId,
      userId: props.userId,
      score: props.score,
      content: props.content || null,
      isActive: props.isActive ?? true,
      isVerified: props.isVerified ?? false,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date()
    });
  }

  /**
   * Reconstruye un Review desde almacenamiento (sin validaciones)
   * @param props Propiedades para reconstruir la reseña
   * @returns Instancia de Review reconstruida
   */
  static reconstitute(props: ReviewProps): Review {
    return new Review(props);
  }

  /**
   * Compara si dos entidades Review son iguales por su identidad
   * @param entity Entidad a comparar
   * @returns true si las entidades tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof Review)) {
      return false;
    }
    
    return this.id === entity.id;
  }

  /**
   * Actualiza la calificación
   * @param score Nueva puntuación (entre 1 y 5)
   * @returns Reseña actualizada
   * @throws ReviewUpdateException si la puntuación no es válida
   */
  updateScore(score: number): Review {
    if (score < 1 || score > 5) {
      throw new ReviewUpdateException('La calificación debe estar entre 1 y 5');
    }

    return new Review({
      ...this.toObject(),
      score,
      updatedAt: new Date()
    });
  }

  /**
   * Actualiza el contenido de la reseña
   * @param content Nuevo contenido
   * @returns Reseña actualizada
   * @throws ReviewUpdateException si el contenido no es válido
   */
  updateContent(content: string | null): Review {
    if (content && content.length > 1000) {
      throw new ReviewUpdateException('La reseña no puede exceder los 1000 caracteres');
    }

    return new Review({
      ...this.toObject(),
      content,
      updatedAt: new Date()
    });
  }

  /**
   * Desactiva la reseña (soft delete)
   * @returns Reseña desactivada
   */
  deactivate(): Review {
    if (!this.isActive) {
      return this; // Ya está desactivada
    }

    return new Review({
      ...this.toObject(),
      isActive: false,
      updatedAt: new Date()
    });
  }

  /**
   * Reactiva la reseña
   * @returns Reseña reactivada
   */
  activate(): Review {
    if (this.isActive) {
      return this; // Ya está activada
    }

    return new Review({
      ...this.toObject(),
      isActive: true,
      updatedAt: new Date()
    });
  }

  /**
   * Marca la reseña como verificada
   * @returns Reseña verificada
   */
  verify(): Review {
    if (this.isVerified) {
      return this; // Ya está verificada
    }

    return new Review({
      ...this.toObject(),
      isVerified: true,
      updatedAt: new Date()
    });
  }

  /**
   * Desmarca la reseña como verificada
   * @returns Reseña no verificada
   */
  unverify(): Review {
    if (!this.isVerified) {
      return this; // Ya no está verificada
    }

    return new Review({
      ...this.toObject(),
      isVerified: false,
      updatedAt: new Date()
    });
  }

  /**
   * Verifica si el usuario es el autor de la reseña
   * @param userId ID del usuario
   * @returns true si el usuario es el autor
   */
  isAuthor(userId: string): boolean {
    return this.userId === userId;
  }

  /**
   * Verifica si la reseña tiene contenido
   * @returns true si la reseña tiene contenido
   */
  hasContent(): boolean {
    return this.content !== null && this.content.trim().length > 0;
  }

  /**
   * Convierte la entidad a un objeto plano
   * @returns Objeto plano con las propiedades de la reseña
   */
  toObject(): ReviewProps {
    return {
      id: this.id,
      eventId: this.eventId,
      userId: this.userId,
      score: this.score,
      content: this.content,
      isActive: this.isActive,
      isVerified: this.isVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * Props para reconstruir una reseña existente
 */
export interface ReviewProps {
  id: string;
  eventId: string;
  userId: string;
  score: number;
  content: string | null;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Props para crear una nueva reseña
 */
export interface ReviewCreateProps {
  id?: string;
  eventId: string;
  userId: string;
  score: number;
  content?: string | null;
  isActive?: boolean;
  isVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} 