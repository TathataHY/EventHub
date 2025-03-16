import { Injectable } from '@nestjs/common';
import { User, UserRepository, UserCreateException, Role } from 'eventhub-domain';
import { CreateUserDto } from '../../dtos/user/CreateUserDto';
import { UserDto } from '../../dtos/user/UserDto';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

/**
 * Caso de uso para crear un nuevo usuario
 */
@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Ejecuta el caso de uso
   * @param dto Datos para crear el usuario
   * @returns Datos del usuario creado
   * @throws Error si los datos del usuario no son válidos o si ocurre un error al guardar
   */
  async execute(dto: CreateUserDto): Promise<UserDto> {
    try {
      // Verificar si ya existe un usuario con el mismo email
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        throw new Error('Ya existe un usuario con este email');
      }

      // Crear la entidad de dominio
      const user = new User({
        id: uuidv4(),
        name: dto.name,
        email: dto.email,
        password: dto.password, // Aquí debería aplicarse un hash a la contraseña
        role: dto.role || Role.USER
      });

      // Guardar en el repositorio
      const savedUser = await this.userRepository.save(user);

      // Transformar a DTO para la respuesta
      return this.toDto(savedUser);
    } catch (error) {
      // Manejar excepciones del dominio
      if (error instanceof UserCreateException) {
        throw new Error(`Error de validación: ${error.message}`);
      }

      // Re-lanzar el error original si no es una excepción específica
      throw error;
    }
  }

  /**
   * Convierte una entidad de dominio a un DTO
   */
  private toDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  /**
   * Función auxiliar para hashear la contraseña
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }
} 