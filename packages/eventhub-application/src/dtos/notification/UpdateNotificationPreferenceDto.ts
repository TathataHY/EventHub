import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsBoolean } from 'class-validator';

/**
 * DTO para actualizar las preferencias de notificación
 */
export class UpdateNotificationPreferenceDto {
  // Canales de notificación
  @ApiPropertyOptional({
    description: 'Habilitar/deshabilitar notificaciones por email',
    type: Boolean
  })
  @IsOptional()
  @IsBoolean()
  emailEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Habilitar/deshabilitar notificaciones push',
    type: Boolean
  })
  @IsOptional()
  @IsBoolean()
  pushEnabled?: boolean;

  @ApiPropertyOptional({
    description: 'Habilitar/deshabilitar notificaciones dentro de la aplicación',
    type: Boolean
  })
  @IsOptional()
  @IsBoolean()
  inAppEnabled?: boolean;

  // Tipos de notificación
  @ApiPropertyOptional({
    description: 'Habilitar/deshabilitar recordatorios de eventos',
    type: Boolean
  })
  @IsOptional()
  @IsBoolean()
  eventReminder?: boolean;

  @ApiPropertyOptional({
    description: 'Habilitar/deshabilitar notificaciones de actualización de eventos',
    type: Boolean
  })
  @IsOptional()
  @IsBoolean()
  eventUpdated?: boolean;

  @ApiPropertyOptional({
    description: 'Habilitar/deshabilitar notificaciones de cancelación de eventos',
    type: Boolean
  })
  @IsOptional()
  @IsBoolean()
  eventCancelled?: boolean;

  @ApiPropertyOptional({
    description: 'Habilitar/deshabilitar notificaciones de nuevos asistentes',
    type: Boolean
  })
  @IsOptional()
  @IsBoolean()
  newAttendee?: boolean;

  @ApiPropertyOptional({
    description: 'Habilitar/deshabilitar notificaciones de asistentes eliminados',
    type: Boolean
  })
  @IsOptional()
  @IsBoolean()
  attendeeRemoved?: boolean;

  @ApiPropertyOptional({
    description: 'Habilitar/deshabilitar notificaciones del sistema',
    type: Boolean
  })
  @IsOptional()
  @IsBoolean()
  systemNotifications?: boolean;
} 