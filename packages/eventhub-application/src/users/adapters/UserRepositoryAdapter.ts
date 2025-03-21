import { User } from '@eventhub/domain/dist/users/entities/User';
import { UserRepository } from '@eventhub/domain/dist/users/repositories/UserRepository';
import { Email } from '@eventhub/domain/dist/users/value-objects/Email';
import { Role, RoleEnum } from '@eventhub/domain/dist/users/value-objects/Role';
import { UserFilterOptions } from '../dtos/UserFilterOptions';
import { PaginationOptions } from '../../core/dtos/PaginationOptions';
import { PaginatedUsersResult } from '../dtos/PaginatedUsersResult';
import { UserDTO } from '../dtos/UserDTO';

/**
 * Adaptador para el repositorio de usuarios del dominio
 * Implementa los métodos necesarios para interactuar con el repositorio de forma segura
 */
export class UserRepositoryAdapter {
  constructor(private readonly repository: any) {}

  /**
   * Busca un usuario por su ID
   * @param id ID del usuario
   * @returns Usuario encontrado o null
   */
  async findUserById(id: string): Promise<User | null> {
    return this.repository.findById(id);
  }

  /**
   * Busca todos los usuarios
   * @returns Lista de usuarios
   */
  async findAll(): Promise<User[]> {
    return this.repository.findAll();
  }

  /**
   * Guarda un usuario
   * @param user Usuario a guardar
   * @returns Usuario guardado
   */
  async saveUser(user: User): Promise<User> {
    return this.repository.save(user);
  }

  /**
   * Actualiza un usuario completo
   * @param user Usuario a actualizar
   * @returns Usuario actualizado
   */
  async updateUserEntity(user: User): Promise<User> {
    return this.repository.update(user);
  }
  
  /**
   * Actualiza un usuario por ID con propiedades específicas
   * @param userId ID del usuario a actualizar
   * @param updateProps Propiedades a actualizar
   * @returns Usuario actualizado
   */
  async updateUser(
    userId: string, 
    updateProps: Partial<{
      name: string;
      email: Email | string;
      password: string;
      role: Role | string;
      isActive: boolean;
    }>
  ): Promise<User> {
    // Buscar el usuario
    const user = await this.findUserById(userId);
    if (!user) {
      throw new Error(`Usuario con ID ${userId} no encontrado`);
    }
    
    // Crear objeto actualizado con las propiedades que se pueden modificar
    const updatedUser = { ...user } as any;
    
    // Actualizar solo las propiedades que fueron proporcionadas
    if (updateProps.name !== undefined) {
      updatedUser.name = updateProps.name;
    }
    
    if (updateProps.email !== undefined) {
      updatedUser.email = updateProps.email;
    }
    
    if (updateProps.password !== undefined) {
      updatedUser.password = updateProps.password;
    }
    
    if (updateProps.role !== undefined) {
      updatedUser.role = updateProps.role;
    }
    
    if (updateProps.isActive !== undefined) {
      updatedUser.isActive = updateProps.isActive;
    }
    
    // Actualizar fecha de modificación
    updatedUser.updatedAt = new Date();
    
    // Actualizar el usuario
    return this.repository.update(updatedUser);
  }

  /**
   * Elimina un usuario
   * @param id ID del usuario a eliminar
   * @returns Resultado de la operación
   */
  async deleteUser(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  /**
   * Busca un usuario por su email
   * @param email Email del usuario
   * @returns Usuario encontrado o null
   */
  async findByEmail(email: string | Email): Promise<User | null> {
    return this.repository.findByEmail(email);
  }

  /**
   * Busca usuarios con filtros específicos
   * @param filters Filtros a aplicar
   * @param pagination Opciones de paginación
   * @returns Resultado paginado
   */
  async findWithFilters(filters?: UserFilterOptions, pagination?: PaginationOptions): Promise<PaginatedUsersResult> {
    const result = await this.repository.findWithFilters(filters, pagination);
    
    // Convertir a formato PaginatedUsersResult si es necesario
    if (!result.users && Array.isArray(result)) {
      // Si el repositorio devuelve solo un array, convertirlo al formato esperado
      const { page = 1, limit = 10 } = pagination || {};
      const total = result.length;
      const totalPages = Math.ceil(total / limit);
      
      return {
        users: result.map(user => ({
          id: user.id,
          name: user.name,
          email: typeof user.email === 'string' ? user.email : user.email.toString(),
          role: typeof user.role === 'string' ? user.role : user.role.toString(),
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        })),
        total,
        page,
        limit,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages
      };
    }
    
    return result;
  }

  /**
   * Busca usuarios por rol
   * @param role Rol a buscar
   * @returns Lista de usuarios con el rol especificado
   */
  async findByRole(role: Role | RoleEnum | string): Promise<User[]> {
    return this.repository.findByRole(role);
  }

  /**
   * Busca usuarios activos
   * @returns Lista de usuarios activos
   */
  async findActive(): Promise<User[]> {
    return this.repository.findActive();
  }

  /**
   * Busca usuarios inactivos
   * @returns Lista de usuarios inactivos
   */
  async findInactive(): Promise<User[]> {
    return this.repository.findInactive();
  }

  /**
   * Cuenta usuarios por rol
   * @returns Mapa con conteo por rol
   */
  async countByRole(): Promise<Map<string, number>> {
    if (typeof this.repository.countByRole === 'function') {
      return this.repository.countByRole();
    }
    
    // Implementación alternativa si no existe en el repositorio
    const users = await this.findAll();
    const countMap = new Map<string, number>();
    
    users.forEach(user => {
      const role = typeof user.role === 'string' ? user.role : user.role.toString();
      countMap.set(role, (countMap.get(role) || 0) + 1);
    });
    
    return countMap;
  }

  /**
   * Cuenta usuarios activos
   * @returns Número de usuarios activos
   */
  async countActiveUsers(): Promise<number> {
    if (typeof this.repository.countActiveUsers === 'function') {
      return this.repository.countActiveUsers();
    }
    
    // Implementación alternativa
    const activeUsers = await this.findActive();
    return activeUsers.length;
  }

  /**
   * Obtiene estadísticas de usuarios por día
   * @param startDate Fecha inicial
   * @param endDate Fecha final
   * @returns Mapa con conteo por día
   */
  async getUsersPerDay(startDate: Date, endDate: Date): Promise<Map<string, number>> {
    if (typeof this.repository.getUsersPerDay === 'function') {
      return this.repository.getUsersPerDay(startDate, endDate);
    }
    
    // Implementación alternativa
    const users = await this.findAll();
    const dailyMap = new Map<string, number>();
    
    // Filtrar usuarios por fecha de creación y agrupar por día
    users.forEach(user => {
      const createdAt = user.createdAt;
      if (createdAt >= startDate && createdAt <= endDate) {
        const dateKey = createdAt.toISOString().split('T')[0];
        dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + 1);
      }
    });
    
    return dailyMap;
  }
} 