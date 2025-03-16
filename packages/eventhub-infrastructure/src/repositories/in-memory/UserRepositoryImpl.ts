import { Injectable } from '@nestjs/common';
import { UserRepository, User } from 'eventhub-domain';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user ? this.clone(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user ? this.clone(user) : null;
  }

  async findAll(): Promise<User[]> {
    return this.users.map(user => this.clone(user));
  }

  async save(user: User): Promise<User> {
    const existingIndex = this.users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      // Actualizar usuario existente
      this.users[existingIndex] = this.clone(user);
      return this.clone(user);
    } else {
      // Crear nuevo usuario
      const newUser = this.clone(user);
      this.users.push(newUser);
      return newUser;
    }
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(user => user.id !== id);
  }

  // Método para clonar usuarios y evitar mutaciones no deseadas
  private clone(user: User): User {
    return new User(
      user.id,
      user.name,
      user.email,
      user.password,
      user.role,
      user.isActive,
      user.createdAt ? new Date(user.createdAt) : undefined,
      user.updatedAt ? new Date(user.updatedAt) : undefined
    );
  }
} 