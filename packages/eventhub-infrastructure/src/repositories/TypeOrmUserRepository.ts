import { User, UserRepository } from 'eventhub-domain';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/UserEntity';

/**
 * Implementación de UserRepository utilizando TypeORM
 */
@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  /**
   * Convierte una entidad de dominio a una entidad de base de datos
   */
  private toEntity(user: User): UserEntity {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      password: user.password,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Convierte una entidad de base de datos a una entidad de dominio
   */
  private toDomain(entity: UserEntity): User {
    return new User({
      id: entity.id,
      email: entity.email,
      name: entity.name,
      password: entity.password,
      role: entity.role,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  async findById(id: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({ where: { id } });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.userRepository.findOne({ where: { email } });
    return entity ? this.toDomain(entity) : null;
  }

  async findAll(options?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    role?: string;
    searchTerm?: string;
  }): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    // Valores por defecto
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;
    
    // Construir query
    let query = this.userRepository.createQueryBuilder('user');
    
    // Filtros
    if (options?.isActive !== undefined) {
      query = query.andWhere('user.isActive = :isActive', { isActive: options.isActive });
    }
    
    if (options?.role) {
      query = query.andWhere('user.role = :role', { role: options.role });
    }
    
    if (options?.searchTerm) {
      query = query.andWhere(
        '(user.name LIKE :searchTerm OR user.email LIKE :searchTerm)', 
        { searchTerm: `%${options.searchTerm}%` }
      );
    }
    
    // Paginación
    const [entities, total] = await query
      .skip(skip)
      .take(limit)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();
      
    // Mapear a entidades de dominio
    const users = entities.map(entity => this.toDomain(entity));
    
    return {
      users,
      total,
      page,
      limit
    };
  }

  async save(user: User): Promise<User> {
    const entity = this.toEntity(user);
    const savedEntity = await this.userRepository.save(entity);
    return this.toDomain(savedEntity);
  }

  async update(user: User): Promise<User> {
    const entity = this.toEntity(user);
    const updatedEntity = await this.userRepository.save(entity);
    return this.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
} 