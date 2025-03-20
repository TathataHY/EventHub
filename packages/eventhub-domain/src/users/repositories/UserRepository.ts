import { Repository } from '../../core/interfaces/Repository';
import { User } from '../entities/User';
import { Email } from '../value-objects/Email';
import { Role, RoleEnum } from '../value-objects/Role';

/**
 * Opciones de filtrado para búsqueda de usuarios
 * Permite filtrar usuarios por diferentes criterios como rol, estado de activación, etc.
 */
export interface UserFilterOptions {
  /** Rol del usuario para filtrar resultados */
  role?: Role | RoleEnum;
  
  /** Estado de activación para filtrar (activo/inactivo) */
  isActive?: boolean;
  
  /** Término de búsqueda para filtrar por nombre o email */
  query?: string;
  
  /** Fecha de creación mínima para filtrar usuarios creados después de esta fecha */
  createdAfter?: Date;
  
  /** Fecha de creación máxima para filtrar usuarios creados antes de esta fecha */
  createdBefore?: Date;
}

/**
 * Opciones de paginación para resultados de búsqueda
 */
export interface PaginationOptions {
  /** Número de página a recuperar */
  page: number;
  
  /** Cantidad de usuarios por página */
  limit: number;
  
  /** Campo por el cual ordenar los resultados */
  orderBy?: string;
  
  /** Dirección del ordenamiento (ascendente o descendente) */
  orderDirection?: 'asc' | 'desc';
}

/**
 * Resultado de una búsqueda paginada de usuarios
 */
export interface PaginatedUsersResult {
  /** Lista de usuarios encontrados */
  users: User[];
  /** Número total de usuarios que coinciden con los filtros */
  total: number;
  /** Número de página actual */
  page: number;
  /** Cantidad de usuarios por página */
  limit: number;
  /** Número total de páginas */
  totalPages: number;
}

/**
 * Interfaz del repositorio de usuarios
 * 
 * Define los métodos necesarios para persistir y recuperar usuarios del sistema.
 * Extiende la interfaz Repository genérica añadiendo operaciones específicas 
 * para usuarios como búsqueda por email, rol, etc.
 * 
 * @extends {Repository<string, User>} Extiende el repositorio base con identificador string
 */
export interface UserRepository extends Repository<string, User> {
  /**
   * Busca un usuario por su dirección de email
   * 
   * @param email Dirección de email a buscar (puede ser string o Email)
   * @returns El usuario encontrado o null si no existe
   */
  findByEmail(email: string | Email): Promise<User | null>;

  /**
   * Busca usuarios aplicando filtros y paginación
   * 
   * @param filters Criterios de filtrado opcionales
   * @param pagination Opciones de paginación y ordenamiento
   * @returns Resultado paginado con usuarios que coinciden con los filtros
   */
  findWithFilters(
    filters?: UserFilterOptions,
    pagination?: PaginationOptions
  ): Promise<PaginatedUsersResult>;

  /**
   * Busca usuarios que tengan un rol específico
   * 
   * @param role Rol a buscar (puede ser Role o RoleEnum)
   * @returns Lista de usuarios con el rol especificado
   */
  findByRole(role: Role | RoleEnum): Promise<User[]>;

  /**
   * Busca usuarios activos en el sistema
   * 
   * @returns Lista de usuarios activos
   */
  findActive(): Promise<User[]>;

  /**
   * Busca usuarios inactivos en el sistema
   * 
   * @returns Lista de usuarios inactivos
   */
  findInactive(): Promise<User[]>;

  /**
   * Verifica si existe un usuario con el email especificado
   * 
   * @param email Email a verificar
   * @returns true si existe un usuario con ese email
   */
  existsByEmail(email: string | Email): Promise<boolean>;

  /**
   * Busca usuarios por coincidencia en nombre o email
   * 
   * @param query Texto a buscar
   * @returns Lista de usuarios que coinciden con la búsqueda
   */
  search(query: string): Promise<User[]>;
} 