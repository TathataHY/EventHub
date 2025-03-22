import { User } from '@eventhub/domain/dist/users/entities/User';
import { UserDTO } from '../dtos/UserDTO';
import { CreateUserDTO } from '../dtos/CreateUserDTO';
import { UpdateUserDTO } from '../dtos/UpdateUserDTO';
import { Email } from '@eventhub/domain/dist/users/value-objects/Email';
import { Role } from '@eventhub/domain/dist/users/value-objects/Role';

/**
 * Clase para mapear entre entidades de dominio User y DTOs de aplicación
 */
export class UserMapper {
  /**
   * Convierte una entidad User de dominio a un DTO de aplicación
   * @param domain Entidad de dominio
   * @returns DTO de aplicación
   */
  static toDTO(domain: User): UserDTO {
    return {
      id: domain.id,
      name: domain.name,
      email: domain.email.toString(),
      role: domain.role.toString(),
      isActive: domain.isActive,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    };
  }

  /**
   * Convierte una lista de entidades User a una lista de DTOs
   * @param domains Lista de entidades
   * @returns Lista de DTOs
   */
  static toDTOList(domains: User[]): UserDTO[] {
    return domains.map(domain => this.toDTO(domain));
  }

  /**
   * Prepara las propiedades para crear una entidad de dominio
   * Nota: Este método no crea la entidad directamente debido a posibles restricciones
   * de constructores privados en el dominio. Debe usarse con el método de fábrica apropiado.
   * 
   * @param dto DTO con los datos del usuario
   * @returns Propiedades para crear la entidad User
   */
  static toDomainProps(dto: CreateUserDTO): {
    name: string;
    email: Email;
    password: string;
    role: Role;
    isActive: boolean;
  } {
    return {
      name: dto.name,
      email: Email.create(dto.email),
      password: dto.password,
      role: Role.create(dto.role),
      isActive: true
    };
  }

  /**
   * Convierte un DTO de actualización a propiedades de dominio para actualización
   * @param dto DTO con los datos a actualizar
   * @returns Propiedades para actualizar la entidad
   */
  static toUpdateProps(dto: UpdateUserDTO): Partial<{
    name: string;
    email: Email;
    password: string;
    role: Role;
    isActive: boolean;
  }> {
    const props: Partial<{
      name: string;
      email: Email;
      password: string;
      role: Role;
      isActive: boolean;
    }> = {};

    if (dto.name !== undefined) props.name = dto.name;
    if (dto.email !== undefined) props.email = Email.create(dto.email);
    if (dto.password !== undefined) props.password = dto.password;
    if (dto.role !== undefined) props.role = Role.create(dto.role);
    if (dto.isActive !== undefined) props.isActive = dto.isActive;

    return props;
  }
} 