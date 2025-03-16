import { IsString, IsNotEmpty, IsEmail, Length, IsEnum, IsOptional } from 'class-validator';
import { Role } from 'eventhub-domain';

/**
 * DTO para crear un usuario
 */
export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  name: string;

  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El email debe ser una dirección de correo válida' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @IsString({ message: 'La contraseña debe ser una cadena de texto' })
  @Length(8, 50, { message: 'La contraseña debe tener entre 8 y 50 caracteres' })
  password: string;

  @IsOptional()
  @IsEnum(Role, { message: 'El rol debe ser un valor válido' })
  role?: Role;
} 