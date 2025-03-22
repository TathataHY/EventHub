/**
 * Interfaz base para repositorios
 * Define operaciones genéricas para cualquier entidad
 * @template T Tipo de la entidad
 * @template ID Tipo del identificador
 */
export interface Repository<T, ID> {
  /**
   * Encuentra una entidad por su ID
   * @param id ID de la entidad
   * @returns La entidad encontrada o null si no existe
   */
  findById(id: ID): Promise<T | null>;

  /**
   * Encuentra todas las entidades
   * @param filters Filtros opcionales
   * @param pagination Opciones de paginación opcional
   * @returns Lista de entidades o resultado paginado
   */
  findAll(filters?: any, pagination?: any): Promise<T[] | any>;

  /**
   * Guarda una entidad (nueva o existente)
   * @param entity Entidad a guardar
   * @returns Entidad guardada
   */
  save(entity: T): Promise<T>;

  /**
   * Actualiza una entidad existente
   * @param entity Entidad a actualizar
   * @returns Entidad actualizada
   */
  update(entity: T): Promise<T>;

  /**
   * Elimina una entidad
   * @param id ID de la entidad a eliminar
   * @returns true si se eliminó correctamente
   */
  delete(id: ID): Promise<boolean>;
} 