import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsDate, IsArray, ArrayUnique, IsISO8601 } from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * DTO para filtrar eventos
 */
export class EventFilters {
  @ApiPropertyOptional({ description: 'ID del organizador para filtrar eventos' })
  @IsOptional()
  @IsString()
  organizerId?: string;

  @ApiPropertyOptional({ description: 'Estado del evento (activo o inactivo)' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;

  @ApiPropertyOptional({ 
    description: 'Fecha de inicio mínima para los eventos', 
    type: Date 
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({ 
    description: 'Fecha de fin máxima para los eventos', 
    type: Date 
  })
  @IsOptional()
  @IsISO8601()
  @Type(() => Date)
  endDate?: Date;

  @ApiPropertyOptional({ 
    description: 'Término de búsqueda para título y descripción' 
  })
  @IsOptional()
  @IsString()
  query?: string;

  @ApiPropertyOptional({ 
    description: 'Lista de etiquetas para filtrar eventos',
    type: [String]
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayUnique()
  tags?: string[];

  @ApiPropertyOptional({ 
    description: 'Número de página para paginación', 
    default: 1 
  })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @ApiPropertyOptional({ 
    description: 'Número de elementos por página', 
    default: 10 
  })
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 10;
} 