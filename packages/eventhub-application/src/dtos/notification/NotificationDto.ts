import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from 'eventhub-domain';

/**
 * DTO para representar una notificación en la respuesta de la API
 */
export class NotificationDto {
  @ApiProperty({ description: 'Identificador único de la notificación' })
  id: string;

  @ApiProperty({ description: 'ID del usuario dueño de la notificación' })
  userId: string;

  @ApiProperty({ description: 'Título de la notificación' })
  title: string;

  @ApiProperty({ description: 'Mensaje de la notificación' })
  message: string;

  @ApiProperty({ 
    description: 'Tipo de notificación',
    enum: NotificationType,
    example: NotificationType.INFO
  })
  type: NotificationType;

  @ApiProperty({ description: 'Indica si la notificación ha sido leída' })
  read: boolean;

  @ApiProperty({ 
    description: 'ID de la entidad relacionada (evento, comentario, etc.)', 
    required: false 
  })
  relatedEntityId?: string;

  @ApiProperty({ 
    description: 'Tipo de la entidad relacionada', 
    required: false 
  })
  relatedEntityType?: string;

  @ApiProperty({ description: 'Fecha y hora de creación de la notificación' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha y hora de la última actualización de la notificación' })
  updatedAt: Date;
} 