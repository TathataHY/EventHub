import { Repository } from '../../../core/interfaces/Repository';
import { User } from '../entities/User';

/**
 * Interfaz para el repositorio de usuarios
 * Extiende la interfaz Repository base para operaciones comunes
 * Añade métodos específicos para usuarios
 */
export interface UserRepository extends Repository<User, string> {
  /**
   * Encuentra un usuario por su email
   * @param email Email del usuario
   * @returns El usuario encontrado o null si no existe
   */
  findByEmail(email: string): Promise<User | null>;
  
  /**
   * Encuentra usuarios por su rol
   * @param role Rol de los usuarios a buscar
   * @returns Lista de usuarios con el rol especificado
   */
  findByRole(role: string): Promise<User[]>;
  
  /**
   * Encuentra usuarios con opciones de filtrado y paginación
   * @param options Opciones de filtrado
   * @returns Lista de usuarios y total que cumplen con los filtros
   */
  findWithFilters(options: UserFilterOptions): Promise<{ users: User[], total: number }>;
  
  /**
   * Busca usuarios que coincidan con un término de búsqueda en su nombre o email
   * @param searchTerm Término de búsqueda
   * @returns Lista de usuarios que coinciden con la búsqueda
   */
  search(searchTerm: string): Promise<User[]>;
  
  /**
   * Cuenta el número de usuarios con un rol específico
   * @param role Rol para contar usuarios
   * @returns Número de usuarios con el rol
   */
  countByRole(role: string): Promise<number>;
  
  /**
   * Cambia el estado activo/inactivo de un usuario
   * @param id ID del usuario
   * @param isActive Nuevo estado
   * @returns El usuario actualizado o null si no existe
   */
  changeActiveStatus(id: string, isActive: boolean): Promise<User | null>;
}

/**
 * Opciones para filtrar usuarios
 */
export interface UserFilterOptions {
  /**
   * Término de búsqueda (nombre, email)
   */
  search?: string;
  
  /**
   * Rol a filtrar
   */
  role?: string;
  
  /**
   * Estado activo/inactivo
   */
  isActive?: boolean;
  
  /**
   * Número de página (inicia en 1)
   */
  page?: number;
  
  /**
   * Cantidad de elementos por página
   */
  limit?: number;
  
  /**
   * Campo por el cual ordenar
   */
  orderBy?: 'name' | 'email' | 'createdAt';
  
  /**
   * Dirección de ordenamiento
   */
  orderDirection?: 'asc' | 'desc';
} 