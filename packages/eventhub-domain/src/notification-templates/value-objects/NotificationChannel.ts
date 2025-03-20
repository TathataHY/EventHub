import { ValueObject } from '../../../core/interfaces/ValueObject';

/**
 * Canales de notificación disponibles en el sistema
 */
export enum NotificationChannel {
  EMAIL = 'EMAIL',    // Notificaciones por correo electrónico
  PUSH = 'PUSH',      // Notificaciones push (móviles, navegadores)
  IN_APP = 'IN_APP',  // Notificaciones dentro de la aplicación
  SMS = 'SMS'         // Notificaciones por SMS
}

/**
 * Value Object para representar el canal de notificación
 * Implementa la interfaz ValueObject para mantener consistencia
 */
export class NotificationChannelVO implements ValueObject<NotificationChannel> {
  private readonly _value: NotificationChannel;

  /**
   * Constructor de NotificationChannelVO
   * @param channel Valor del canal o string a convertir
   * @throws Error si el canal no es válido
   */
  constructor(channel: NotificationChannel | string) {
    const channelValue = typeof channel === 'string' ? channel as NotificationChannel : channel;
    
    if (!this.isValid(channelValue)) {
      throw new Error(`Canal de notificación no válido: ${channel}. Canales disponibles: ${Object.values(NotificationChannel).join(', ')}`);
    }
    
    this._value = channelValue;
  }

  /**
   * Obtiene el valor del canal
   * @returns Valor del canal
   */
  value(): NotificationChannel {
    return this._value;
  }

  /**
   * Compara si dos canales son iguales
   * @param vo Canal a comparar
   * @returns true si los canales son iguales
   */
  equals(vo: ValueObject<NotificationChannel>): boolean {
    return this._value === vo.value();
  }

  /**
   * Representación en string del canal
   * @returns String representación del canal
   */
  toString(): string {
    return this._value;
  }

  /**
   * Verifica si un valor es un canal válido
   * @param channel Valor a verificar
   * @returns true si el canal es válido
   */
  private isValid(channel: NotificationChannel | string): boolean {
    return Object.values(NotificationChannel).includes(channel as NotificationChannel);
  }

  /**
   * Verifica si es canal de email
   * @returns true si es canal de email
   */
  isEmail(): boolean {
    return this._value === NotificationChannel.EMAIL;
  }

  /**
   * Verifica si es canal de push
   * @returns true si es canal de push
   */
  isPush(): boolean {
    return this._value === NotificationChannel.PUSH;
  }

  /**
   * Verifica si es canal de in-app
   * @returns true si es canal de in-app
   */
  isInApp(): boolean {
    return this._value === NotificationChannel.IN_APP;
  }

  /**
   * Verifica si es canal de SMS
   * @returns true si es canal de SMS
   */
  isSms(): boolean {
    return this._value === NotificationChannel.SMS;
  }

  /**
   * Crea un canal de email
   * @returns Instancia de NotificationChannelVO con valor EMAIL
   */
  static email(): NotificationChannelVO {
    return new NotificationChannelVO(NotificationChannel.EMAIL);
  }

  /**
   * Crea un canal de push
   * @returns Instancia de NotificationChannelVO con valor PUSH
   */
  static push(): NotificationChannelVO {
    return new NotificationChannelVO(NotificationChannel.PUSH);
  }

  /**
   * Crea un canal de in-app
   * @returns Instancia de NotificationChannelVO con valor IN_APP
   */
  static inApp(): NotificationChannelVO {
    return new NotificationChannelVO(NotificationChannel.IN_APP);
  }

  /**
   * Crea un canal de SMS
   * @returns Instancia de NotificationChannelVO con valor SMS
   */
  static sms(): NotificationChannelVO {
    return new NotificationChannelVO(NotificationChannel.SMS);
  }
} 