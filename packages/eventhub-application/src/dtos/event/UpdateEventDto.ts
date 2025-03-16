import { IsString, IsOptional, IsDate, MinDate, Min, IsArray, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para actualizar un evento existente
 */
export class UpdateEventDto {
  @IsOptional()
  @IsString({ message: 'El título debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El título no puede tener más de 100 caracteres' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  @MaxLength(2000, { message: 'La descripción no puede tener más de 2000 caracteres' })
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de inicio debe ser una fecha válida' })
  @MinDate(new Date(), { message: 'La fecha de inicio debe ser posterior a la fecha actual' })
  startDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'La fecha de fin debe ser una fecha válida' })
  @MinDate(new Date(), { message: 'La fecha de fin debe ser posterior a la fecha actual' })
  endDate?: Date;

  @IsOptional()
  @IsString({ message: 'La ubicación debe ser una cadena de texto' })
  @MaxLength(200, { message: 'La ubicación no puede tener más de 200 caracteres' })
  location?: string;

  @IsOptional()
  @Min(1, { message: 'La capacidad debe ser mayor a 0' })
  capacity?: number;

  @IsOptional()
  @IsArray({ message: 'Las etiquetas deben ser un array' })
  @IsString({ each: true, message: 'Cada etiqueta debe ser una cadena de texto' })
  tags?: string[];
} 