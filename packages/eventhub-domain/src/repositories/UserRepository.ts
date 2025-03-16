import { User } from '../entities/User';

/**
 * Interfaz del repositorio de usuarios
 * Define las operaciones que se pueden realizar con los usuarios sin importar la tecnología subyacente
 */
export interface UserRepository {
  /**
   * Obtiene todos los usuarios
   */
  findAll(): Promise<User[]>;

  /**
   * Obtiene un usuario por su ID
   * @param id ID del usuario
   */
  findById(id: string): Promise<User | null>;

  /**
   * Obtiene un usuario por su email
   * @param email Email del usuario
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Crea un nuevo usuario
   * @param user Usuario a crear
   */
  create(user: User): Promise<User>;

  /**
   * Actualiza un usuario existente
   * @param id ID del usuario a actualizar
   * @param userData Datos parciales del usuario a actualizar
   */
  update(id: string, userData: Partial<User>): Promise<User | null>;

  /**
   * Elimina un usuario por su ID
   * @param id ID del usuario a eliminar
   */
  delete(id: string): Promise<boolean>;
} 