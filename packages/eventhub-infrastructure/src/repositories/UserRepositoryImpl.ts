import { User, UserRepository } from 'eventhub-domain';
import { UserEntity } from '../entities/UserEntity';

/**
 * Implementación concreta del repositorio de usuarios
 * Esta clase implementa la interfaz definida en el dominio
 */
export class UserRepositoryImpl implements UserRepository {
  // En un caso real, aquí inyectaríamos un ORM o cliente de base de datos
  private users: UserEntity[] = [];

  /**
   * Convierte una entidad de dominio a una entidad de base de datos
   */
  private toEntity(user: User): UserEntity {
    return new UserEntity({
      id: user.id,
      email: user.email,
      password: user.password,
      name: user.name,
      roles: user.roles,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  /**
   * Convierte una entidad de base de datos a una entidad de dominio
   */
  private toDomain(entity: UserEntity): User {
    return new User({
      id: entity.id,
      email: entity.email,
      password: entity.password,
      name: entity.name,
      roles: entity.roles,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  async findAll(): Promise<User[]> {
    return this.users.map(entity => this.toDomain(entity));
  }

  async findById(id: string): Promise<User | null> {
    const entity = this.users.find(u => u.id === id);
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = this.users.find(u => u.email === email);
    return entity ? this.toDomain(entity) : null;
  }

  async create(user: User): Promise<User> {
    const entity = this.toEntity(user);
    this.users.push(entity);
    return user;
  }

  async update(id: string, userData: Partial<User>): Promise<User | null> {
    const index = this.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return null;
    }
    
    // Obtener entidad existente
    const existingEntity = this.users[index];
    const existingUser = this.toDomain(existingEntity);
    
    // Actualizar campos en el dominio
    if (userData.name) existingUser.updateDetails({ name: userData.name });
    if (userData.email) existingUser.updateDetails({ email: userData.email });
    if (userData.password) existingUser.updatePassword(userData.password);
    
    // Convertir de vuelta a entidad y actualizar en "base de datos"
    const updatedEntity = this.toEntity(existingUser);
    this.users[index] = updatedEntity;
    
    return existingUser;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.users.findIndex(u => u.id === id);
    
    if (index === -1) {
      return false;
    }
    
    this.users.splice(index, 1);
    return true;
  }
} 