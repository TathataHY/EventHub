import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { MoreThanOrEqual } from 'typeorm';

@Injectable()
export class TypeOrmUserRepository implements UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async countAll(): Promise<number> {
    return this.userRepository.count();
  }

  async countNewUsers(since?: Date): Promise<number> {
    if (!since) {
      return this.userRepository.count();
    }

    return this.userRepository.count({
      where: {
        createdAt: MoreThanOrEqual(since)
      }
    });
  }

  async countActiveUsers(since?: Date): Promise<number> {
    if (!since) {
      // Si no hay fecha, consideramos activos a todos los usuarios no eliminados
      return this.userRepository.count({
        where: {
          active: true
        }
      });
    }

    // Aquí habría que contar usuarios que han tenido actividad desde 'since'
    // Esto dependería de cómo se registra la actividad de los usuarios
    // Por ejemplo, si hay un campo lastActivityAt
    return this.userRepository.count({
      where: {
        active: true,
        lastLoginAt: MoreThanOrEqual(since)
      }
    });
  }

  async countByRole(role: string): Promise<number> {
    return this.userRepository.count({
      where: {
        role
      }
    });
  }

  async getUsersPerDay(since?: Date): Promise<{ date: string; count: number }[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    
    queryBuilder.select(`DATE(user.createdAt)`, 'date');
    queryBuilder.addSelect('COUNT(user.id)', 'count');
    
    if (since) {
      queryBuilder.where('user.createdAt >= :since', { since });
    }
    
    queryBuilder.groupBy('date');
    queryBuilder.orderBy('date', 'ASC');
    
    const result = await queryBuilder.getRawMany();
    
    return result.map(item => ({
      date: item.date,
      count: parseInt(item.count, 10)
    }));
  }
} 