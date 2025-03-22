import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../../core/interfaces/Entity';
import { ReviewCreateException } from '../exceptions/ReviewCreateException';
import { ReviewUpdateException } from '../exceptions/ReviewUpdateException';

/**
 * Entidad que representa una reseña de un evento en el sistema
 * 
 * Las reseñas son evaluaciones realizadas por usuarios que asistieron a eventos,
 * combinando una puntuación numérica y opcionalmente un comentario textual.
 * Esta entidad encapsula toda la lógica de negocio relacionada con la creación,
 * actualización y gestión de reseñas, garantizando que cumplan con las reglas
 * establecidas para el sistema de evaluación.
 * 
 * Una reseña solo puede ser creada por usuarios que hayan asistido al evento,
 * y puede ser verificada por moderadores o administradores del sistema para
 * garantizar que cumple con las normas de la comunidad.
 * 
 * @implements {Entity<string>} Implementa la interfaz Entity con ID tipo string
 */
export class Review implements Entity<string> {
  /** Identificador único de la reseña */
  readonly id: string;
  
  /** Identificador del evento que se está reseñando */
  readonly eventId: string;
  
  /** Identificador del usuario que creó la reseña */
  readonly userId: string;
  
  /** Puntuación numérica asignada al evento (típicamente de 1 a 5) */
  readonly score: number;
  
  /** Contenido textual de la reseña, opcional */
  readonly content: string | null;
  
  /** Indica si la reseña está activa y visible en el sistema */
  readonly isActive: boolean;
  
  /** Indica si la reseña ha sido verificada por un moderador */
  readonly isVerified: boolean;
  
  /** Fecha de creación de la reseña */
  readonly createdAt: Date;
  
  /** Fecha de última actualización de la reseña */
  readonly updatedAt: Date;

  /**
   * Constructor privado de Review
   * 
   * Inicializa una nueva instancia con las propiedades proporcionadas.
   * Este constructor es privado para garantizar que todas las instancias
   * se creen a través de métodos factory que apliquen las validaciones necesarias.
   * 
   * @param props Propiedades completas de la reseña
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
   * Crea una nueva reseña aplicando todas las reglas de negocio
   * 
   * Valida que los datos proporcionados cumplan con los requisitos del sistema
   * y crea una nueva instancia de reseña. La puntuación debe estar en el rango
   * permitido y el usuario debe haber asistido al evento.
   * 
   * @param props Propiedades para crear la reseña
   * @returns Nueva instancia de Review validada
   * @throws {ReviewCreateException} Si los datos no cumplen con las reglas de negocio
   * 
   * @example
   * // Crear una reseña básica
   * const review = Review.create({
   *   eventId: 'event-123',
   *   userId: 'user-456',
   *   score: 4,
   *   content: 'Excelente organización del evento'
   * });
   */
  static create(props: ReviewCreateProps): Review {
    // Validar score
    if (props.score < 1 || props.score > 5) {
      throw new ReviewCreateException('La puntuación debe estar entre 1 y 5');
    }

    // Validar eventId
    if (!props.eventId) {
      throw new ReviewCreateException('El ID del evento es requerido');
    }

    // Validar userId
    if (!props.userId) {
      throw new ReviewCreateException('El ID de usuario es requerido');
    }

    // Preparar valores por defecto
    const now = new Date();
    
    // Crear la reseña
    return new Review({
      id: props.id || uuidv4(),
      eventId: props.eventId,
      userId: props.userId,
      score: props.score,
      content: props.content || null,
      isActive: props.isActive !== undefined ? props.isActive : true,
      isVerified: props.isVerified || false,
      createdAt: props.createdAt || now,
      updatedAt: props.updatedAt || now
    });
  }

  /**
   * Reconstruye una reseña desde la persistencia
   * 
   * Este método no aplica validaciones de negocio ya que asume que los datos
   * provienen de una fuente confiable como la base de datos.
   * 
   * @param props Propiedades completas de la reseña
   * @returns Instancia de Review reconstruida
   * 
   * @example
   * // Reconstruir una reseña desde datos guardados
   * const reviewData = await reviewRepository.findById('review-123');
   * const review = Review.reconstitute(reviewData);
   */
  static reconstitute(props: ReviewProps): Review {
    return new Review(props);
  }

  /**
   * Compara si esta reseña es igual a otra entidad
   * 
   * Dos reseñas son iguales si tienen el mismo ID, independientemente
   * de sus otros atributos. Este método es útil para comparaciones
   * en colecciones o para verificar si se está trabajando con la
   * misma entidad lógica.
   * 
   * @param entity Otra entidad para comparar
   * @returns true si ambas entidades tienen el mismo ID
   * 
   * @example
   * // Verificar si dos instancias representan la misma reseña
   * if (review1.equals(review2)) {
   *   console.log('Son la misma reseña');
   * }
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof Review)) {
      return false;
    }
    
    return this.id === entity.id;
  }

  /**
   * Actualiza el contenido textual de la reseña
   * 
   * Permite modificar el texto descriptivo de una reseña existente.
   * Solo se puede modificar si la reseña está activa y no ha sido
   * verificada por un moderador.
   * 
   * @param content Nuevo contenido textual (puede ser null para eliminar el texto)
   * @returns Nueva instancia con el contenido actualizado
   * @throws {ReviewUpdateException} Si la reseña no puede ser actualizada
   * 
   * @example
   * // Actualizar el contenido de una reseña
   * const updatedReview = review.updateContent('Me gustó mucho la organización y el ambiente');
   */
  updateContent(content: string | null): Review {
    if (!this.isActive) {
      throw new ReviewUpdateException('No se puede actualizar una reseña inactiva');
    }
    
    if (this.isVerified) {
      throw new ReviewUpdateException('No se puede actualizar una reseña verificada');
    }
    
    return new Review({
      ...this.toObject(),
      content,
      updatedAt: new Date()
    });
  }

  /**
   * Actualiza la puntuación de la reseña
   * 
   * Permite modificar la calificación numérica de una reseña existente.
   * La nueva puntuación debe estar en el rango permitido (1-5).
   * 
   * @param score Nueva puntuación para la reseña
   * @returns Nueva instancia con la puntuación actualizada
   * @throws {ReviewUpdateException} Si la puntuación es inválida o la reseña no puede ser actualizada
   * 
   * @example
   * // Actualizar la puntuación de una reseña
   * const updatedReview = review.updateScore(5);
   */
  updateScore(score: number): Review {
    if (!this.isActive) {
      throw new ReviewUpdateException('No se puede actualizar una reseña inactiva');
    }
    
    if (this.isVerified) {
      throw new ReviewUpdateException('No se puede actualizar una reseña verificada');
    }
    
    if (score < 1 || score > 5) {
      throw new ReviewUpdateException('La puntuación debe estar entre 1 y 5');
    }
    
    return new Review({
      ...this.toObject(),
      score,
      updatedAt: new Date()
    });
  }

  /**
   * Marca la reseña como verificada
   * 
   * Este proceso indica que un moderador ha revisado la reseña
   * y ha confirmado que cumple con las normas de la comunidad.
   * Una reseña verificada no puede ser modificada posteriormente.
   * 
   * @returns Nueva instancia con el estado verificado actualizado
   * @throws {ReviewUpdateException} Si la reseña está inactiva
   * 
   * @example
   * // Verificar una reseña por un moderador
   * const verifiedReview = review.verify();
   */
  verify(): Review {
    if (!this.isActive) {
      throw new ReviewUpdateException('No se puede verificar una reseña inactiva');
    }
    
    if (this.isVerified) {
      return this;
    }
    
    return new Review({
      ...this.toObject(),
      isVerified: true,
      updatedAt: new Date()
    });
  }

  /**
   * Desactiva la reseña
   * 
   * Este método marca la reseña como inactiva, lo que significa que
   * ya no estará visible en el sistema para los usuarios regulares.
   * Útil para moderar contenido inapropiado o spam.
   * 
   * @returns Nueva instancia con estado inactivo
   * 
   * @example
   * // Desactivar una reseña inapropiada
   * const deactivatedReview = review.deactivate();
   */
  deactivate(): Review {
    if (!this.isActive) {
      return this;
    }
    
    return new Review({
      ...this.toObject(),
      isActive: false,
      updatedAt: new Date()
    });
  }

  /**
   * Reactiva una reseña previamente desactivada
   * 
   * Permite que una reseña que fue desactivada vuelva a estar
   * visible en el sistema, por ejemplo después de una revisión
   * por parte del equipo de moderación.
   * 
   * @returns Nueva instancia con estado activo
   * 
   * @example
   * // Reactivar una reseña después de revisión
   * const reactivatedReview = inactiveReview.activate();
   */
  activate(): Review {
    if (this.isActive) {
      return this;
    }
    
    return new Review({
      ...this.toObject(),
      isActive: true,
      updatedAt: new Date()
    });
  }

  /**
   * Convierte la entidad a un objeto plano
   * 
   * Útil para serialización, transferencia de datos o persistencia.
   * 
   * @returns Objeto con todas las propiedades de la reseña
   * 
   * @example
   * // Convertir a objeto para guardar en base de datos
   * const reviewData = review.toObject();
   * await db.collection('reviews').save(reviewData);
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
 * Propiedades completas de una reseña
 * 
 * Define todos los atributos necesarios para representar completamente
 * una reseña en el sistema.
 */
export interface ReviewProps {
  /** Identificador único */
  id: string;
  
  /** ID del evento reseñado */
  eventId: string;
  
  /** ID del usuario que escribió la reseña */
  userId: string;
  
  /** Puntuación numérica (1-5) */
  score: number;
  
  /** Contenido textual (opcional) */
  content: string | null;
  
  /** Indica si está activa y visible */
  isActive: boolean;
  
  /** Indica si ha sido verificada por un moderador */
  isVerified: boolean;
  
  /** Fecha de creación */
  createdAt: Date;
  
  /** Fecha de última actualización */
  updatedAt: Date;
}

/**
 * Propiedades para crear una nueva reseña
 * 
 * Contiene los campos necesarios para la creación inicial de una reseña.
 * Algunos campos son opcionales y tendrán valores por defecto.
 */
export interface ReviewCreateProps {
  /** ID único (opcional, se genera automáticamente) */
  id?: string;
  
  /** ID del evento reseñado (requerido) */
  eventId: string;
  
  /** ID del usuario que escribe la reseña (requerido) */
  userId: string;
  
  /** Puntuación numérica entre 1 y 5 (requerido) */
  score: number;
  
  /** Contenido textual de la reseña (opcional) */
  content?: string;
  
  /** Estado inicial de la reseña (por defecto activa) */
  isActive?: boolean;
  
  /** Estado de verificación inicial (por defecto false) */
  isVerified?: boolean;
  
  /** Fecha de creación (opcional, por defecto fecha actual) */
  createdAt?: Date;
  
  /** Fecha de actualización (opcional, por defecto fecha actual) */
  updatedAt?: Date;
} 