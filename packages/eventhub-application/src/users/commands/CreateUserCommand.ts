import { User } from '@eventhub/domain/dist/users/entities/User';
import { UserRepositoryAdapter } from '../adapters/UserRepositoryAdapter';
import { Command } from '../../core/interfaces/Command';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { UserDTO } from '../dtos/UserDTO';
import { UserMapper } from '../mappers/UserMapper';
import { UserAlreadyExistsException } from '@eventhub/domain/dist/users/exceptions/UserAlreadyExistsException';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

/**
 * Comando para crear un nuevo usuario
 */
export class CreateUserCommand implements Command<CreateUserDTO, UserDTO> {
  constructor(private readonly userRepository: UserRepositoryAdapter) {}

  /**
   * Ejecuta el comando para crear un usuario
   * @param params DTO con los datos del usuario a crear
   * @returns DTO del usuario creado
   * @throws UserAlreadyExistsException si el email ya está en uso
   */
  async execute(params: CreateUserDTO): Promise<UserDTO> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findByEmail(params.email);
    if (existingUser) {
      throw new UserAlreadyExistsException(params.email);
    }

    // Hashear la contraseña
    const hashedPassword = await this.hashPassword(params.password);
    
    // Preparar los datos para crear el usuario
    const userProps = UserMapper.toDomainProps({
      ...params,
      password: hashedPassword,
    });

    // Usamos el método de fábrica del dominio
    const user = User.create({
      id: this.generateId(),
      ...userProps,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Guardar el usuario
    await this.userRepository.saveUser(user);

    // Convertir a DTO y devolver
    return UserMapper.toDTO(user);
  }

  /**
   * Genera un ID único para el usuario
   */
  private generateId(): string {
    return uuidv4();
  }

  /**
   * Hashea la contraseña del usuario
   * @param password Contraseña en texto plano
   * @returns Contraseña hasheada
   */
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }
} 