import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength, IsBoolean, IsEnum } from 'class-validator';

/**
 * DTO para actualizar un usuario
 */
export class UpdateUserDto {
  @ApiProperty({
    description: 'Nombre del usuario',
    required: false,
    example: 'Juan Pérez'
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Email del usuario',
    required: false,
    example: 'juan@example.com'
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    required: false,
    example: 'contraseña123'
  })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @ApiProperty({
    description: 'Rol del usuario',
    required: false,
    enum: ['USER', 'ADMIN', 'ORGANIZER'],
    example: 'ORGANIZER'
  })
  @IsEnum(['USER', 'ADMIN', 'ORGANIZER'])
  @IsOptional()
  role?: string;

  @ApiProperty({
    description: 'Indica si el usuario está activo',
    required: false,
    example: true
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
} 