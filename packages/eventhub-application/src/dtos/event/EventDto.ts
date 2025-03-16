import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para representar un evento en la respuesta de la API
 */
export class EventDto {
  @ApiProperty({ description: 'Identificador único del evento' })
  id: string;

  @ApiProperty({ description: 'Título del evento' })
  title: string;

  @ApiProperty({ description: 'Descripción detallada del evento' })
  description: string;

  @ApiProperty({ description: 'Fecha y hora de inicio del evento' })
  startDate: Date;

  @ApiProperty({ description: 'Fecha y hora de finalización del evento' })
  endDate: Date;

  @ApiProperty({ description: 'Ubicación donde se llevará a cabo el evento' })
  location: string;

  @ApiProperty({ description: 'ID del usuario organizador del evento' })
  organizerId: string;

  @ApiProperty({ description: 'Capacidad máxima de asistentes, null si es ilimitada', required: false, nullable: true })
  capacity: number | null;

  @ApiProperty({ description: 'Lista de IDs de los asistentes confirmados', type: [String] })
  attendees: string[];

  @ApiProperty({ description: 'Indica si el evento está activo' })
  isActive: boolean;

  @ApiProperty({ description: 'Etiquetas asociadas al evento', type: [String] })
  tags: string[];

  @ApiProperty({ description: 'Fecha y hora de creación del evento' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha y hora de la última actualización del evento' })
  updatedAt: Date;
} 