import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../../../core/interfaces/Entity';
import { CommentCreateException } from '../exceptions/CommentCreateException';
import { CommentUpdateException } from '../exceptions/CommentUpdateException';

/**
 * Entidad de comentario en el dominio
 * Implementa Entity para seguir el patrón común de entidades
 */
export class Comment implements Entity<string> {
  readonly id: string;
  readonly eventId: string;
  readonly userId: string;
  readonly content: string;
  readonly isActive: boolean;
  readonly parentId: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  /**
   * Constructor privado de Comment
   * Se debe usar el método estático create() para crear instancias
   */
  private constructor(props: CommentProps) {
    this.id = props.id;
    this.eventId = props.eventId;
    this.userId = props.userId;
    this.content = props.content;
    this.isActive = props.isActive;
    this.parentId = props.parentId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Crea un nuevo comentario validando los datos
   * @param props Propiedades para crear el comentario
   * @returns Nueva instancia de Comment
   * @throws CommentCreateException si los datos no son válidos
   */
  static create(props: CommentCreateProps): Comment {
    const id = props.id || uuidv4();
    
    // Validar eventId
    if (!props.eventId) {
      throw new CommentCreateException('El ID del evento es requerido');
    }

    // Validar userId
    if (!props.userId) {
      throw new CommentCreateException('El ID del usuario es requerido');
    }

    // Validar contenido
    if (!props.content || props.content.trim().length === 0) {
      throw new CommentCreateException('El contenido del comentario no puede estar vacío');
    }

    if (props.content.length > 1000) {
      throw new CommentCreateException('El comentario no puede exceder los 1000 caracteres');
    }

    // Crear comentario
    return new Comment({
      id,
      eventId: props.eventId,
      userId: props.userId,
      content: props.content,
      isActive: props.isActive ?? true,
      parentId: props.parentId || null,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date()
    });
  }

  /**
   * Reconstruye un Comment desde almacenamiento (sin validaciones)
   * @param props Propiedades para reconstruir el comentario
   * @returns Instancia de Comment reconstruida
   */
  static reconstitute(props: CommentProps): Comment {
    return new Comment(props);
  }

  /**
   * Compara si dos entidades Comment son iguales por su identidad
   * @param entity Entidad a comparar
   * @returns true si las entidades tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof Comment)) {
      return false;
    }
    
    return this.id === entity.id;
  }

  /**
   * Actualiza el contenido del comentario
   * @param content Nuevo contenido
   * @returns Comentario actualizado
   * @throws CommentUpdateException si el contenido no es válido
   */
  updateContent(content: string): Comment {
    if (!content || content.trim().length === 0) {
      throw new CommentUpdateException('El contenido del comentario no puede estar vacío');
    }

    if (content.length > 1000) {
      throw new CommentUpdateException('El comentario no puede exceder los 1000 caracteres');
    }

    return new Comment({
      ...this.toObject(),
      content,
      updatedAt: new Date()
    });
  }

  /**
   * Desactiva el comentario (soft delete)
   * @returns Comentario desactivado
   */
  deactivate(): Comment {
    if (!this.isActive) {
      return this; // Ya está desactivado
    }

    return new Comment({
      ...this.toObject(),
      isActive: false,
      updatedAt: new Date()
    });
  }

  /**
   * Reactiva el comentario
   * @returns Comentario reactivado
   */
  activate(): Comment {
    if (this.isActive) {
      return this; // Ya está activado
    }

    return new Comment({
      ...this.toObject(),
      isActive: true,
      updatedAt: new Date()
    });
  }

  /**
   * Verifica si el usuario es el autor del comentario
   * @param userId ID del usuario a verificar
   * @returns true si el usuario es el autor del comentario
   */
  isAuthor(userId: string): boolean {
    return this.userId === userId;
  }

  /**
   * Verifica si el comentario es una respuesta a otro comentario
   * @returns true si el comentario es una respuesta
   */
  isReply(): boolean {
    return this.parentId !== null;
  }

  /**
   * Convierte la entidad a un objeto plano
   * @returns Objeto plano con las propiedades del comentario
   */
  toObject(): CommentProps {
    return {
      id: this.id,
      eventId: this.eventId,
      userId: this.userId,
      content: this.content,
      isActive: this.isActive,
      parentId: this.parentId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * Props para reconstruir un comentario existente
 */
export interface CommentProps {
  id: string;
  eventId: string;
  userId: string;
  content: string;
  isActive: boolean;
  parentId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Props para crear un nuevo comentario
 */
export interface CommentCreateProps {
  id?: string;
  eventId: string;
  userId: string;
  content: string;
  isActive?: boolean;
  parentId?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
} 