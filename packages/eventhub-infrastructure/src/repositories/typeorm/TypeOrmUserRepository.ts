import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepository, User } from 'eventhub-domain';
import { UserEntity } from '../../entities/typeorm/UserEntity';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { id }
    });

    if (!userEntity) {
      return null;
    }

    return this.mapToDomain(userEntity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { email }
    });

    if (!userEntity) {
      return null;
    }

    return this.mapToDomain(userEntity);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository.find();
    return users.map(user => this.mapToDomain(user));
  }

  async save(user: User): Promise<User> {
    const userEntity = this.mapToEntity(user);
    const savedUser = await this.userRepository.save(userEntity);
    return this.mapToDomain(savedUser);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  private mapToDomain(entity: UserEntity): User {
    return new User(
      entity.id,
      entity.name,
      entity.email,
      entity.password,
      entity.role,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt
    );
  }

  private mapToEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.id;
    entity.name = user.name;
    entity.email = user.email;
    entity.password = user.password;
    entity.role = user.role;
    entity.isActive = user.isActive;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    return entity;
  }
} 