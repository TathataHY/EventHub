import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'eventhub-domain';

/**
 * DTO para representar un usuario en la respuesta de la API
 */
export class UserDto {
  @ApiProperty({ description: 'Identificador único del usuario' })
  id: string;

  @ApiProperty({ description: 'Nombre completo del usuario' })
  name: string;

  @ApiProperty({ description: 'Correo electrónico del usuario' })
  email: string;

  @ApiProperty({ description: 'Rol del usuario en el sistema', enum: Role })
  role: Role;

  @ApiProperty({ description: 'Indica si el usuario está activo' })
  isActive: boolean;

  @ApiProperty({ description: 'Fecha y hora de creación del usuario' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha y hora de la última actualización del usuario' })
  updatedAt: Date;
} 