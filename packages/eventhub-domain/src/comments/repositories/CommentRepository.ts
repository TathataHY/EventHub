import { Repository } from '../../../core/interfaces/Repository';
import { Comment } from '../entities/Comment';

/**
 * Opciones para filtrar comentarios
 */
export interface FindCommentsOptions {
  page?: number;
  limit?: number;
  order?: 'asc' | 'desc';
  orderBy?: 'createdAt';
  parentId?: string | null;
}

/**
 * Interfaz del repositorio de comentarios
 * Extiende la interfaz Repository base para operaciones comunes
 * Añade métodos específicos para comentarios
 */
export interface CommentRepository extends Repository<Comment, string> {
  /**
   * Busca comentarios por ID de evento
   * @param eventId ID del evento
   * @returns Lista de comentarios del evento
   */
  findByEventId(eventId: string): Promise<Comment[]>;

  /**
   * Busca comentarios por ID de usuario
   * @param userId ID del usuario
   * @returns Lista de comentarios del usuario
   */
  findByUserId(userId: string): Promise<Comment[]>;

  /**
   * Busca comentarios por ID de evento y usuario
   * @param eventId ID del evento
   * @param userId ID del usuario
   * @returns Lista de comentarios del usuario en el evento
   */
  findByEventIdAndUserId(eventId: string, userId: string): Promise<Comment[]>;

  /**
   * Busca comentarios por ID de comentario padre
   * @param parentId ID del comentario padre
   * @returns Lista de respuestas al comentario
   */
  findByParentId(parentId: string): Promise<Comment[]>;

  /**
   * Busca comentarios de un evento con opciones de filtrado y paginación
   * @param eventId ID del evento
   * @param options Opciones de filtrado y paginación
   * @returns Lista de comentarios y el total
   */
  findByEventIdWithOptions(eventId: string, options: FindCommentsOptions): Promise<{ comments: Comment[], total: number }>;

  /**
   * Cuenta el número de comentarios de un evento
   * @param eventId ID del evento
   * @returns Número total de comentarios del evento
   */
  countByEventId(eventId: string): Promise<number>;

  /**
   * Cuenta el número de respuestas a un comentario
   * @param commentId ID del comentario
   * @returns Número total de respuestas al comentario
   */
  countReplies(commentId: string): Promise<number>;
} 