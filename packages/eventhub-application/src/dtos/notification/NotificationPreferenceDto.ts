import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para representar las preferencias de notificación en la respuesta de la API
 */
export class NotificationPreferenceDto {
  @ApiProperty({ description: 'Identificador único de las preferencias' })
  id: string;

  @ApiProperty({ description: 'ID del usuario propietario de las preferencias' })
  userId: string;

  // Canales de notificación
  @ApiProperty({ 
    description: 'Indica si las notificaciones por email están habilitadas',
    default: true
  })
  emailEnabled: boolean;

  @ApiProperty({ 
    description: 'Indica si las notificaciones push están habilitadas',
    default: false
  })
  pushEnabled: boolean;

  @ApiProperty({ 
    description: 'Indica si las notificaciones dentro de la aplicación están habilitadas',
    default: true
  })
  inAppEnabled: boolean;

  // Tipos de notificación
  @ApiProperty({ 
    description: 'Indica si los recordatorios de eventos están habilitados',
    default: true
  })
  eventReminder: boolean;

  @ApiProperty({ 
    description: 'Indica si las notificaciones de actualización de eventos están habilitadas',
    default: true
  })
  eventUpdated: boolean;

  @ApiProperty({ 
    description: 'Indica si las notificaciones de cancelación de eventos están habilitadas',
    default: true
  })
  eventCancelled: boolean;

  @ApiProperty({ 
    description: 'Indica si las notificaciones de nuevos asistentes están habilitadas',
    default: true
  })
  newAttendee: boolean;

  @ApiProperty({ 
    description: 'Indica si las notificaciones de asistentes eliminados están habilitadas',
    default: true
  })
  attendeeRemoved: boolean;

  @ApiProperty({ 
    description: 'Indica si las notificaciones del sistema están habilitadas',
    default: true
  })
  systemNotifications: boolean;

  @ApiProperty({ description: 'Fecha y hora de creación de las preferencias' })
  createdAt: Date;

  @ApiProperty({ description: 'Fecha y hora de la última actualización de las preferencias' })
  updatedAt: Date;
} 