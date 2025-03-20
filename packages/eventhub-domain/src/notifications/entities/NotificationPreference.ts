import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../../../core/interfaces/Entity';
import { NotificationType } from '../value-objects/NotificationType';
import { NotificationChannel } from '../value-objects/NotificationChannel';
import { NotificationPreferenceException } from '../exceptions/NotificationPreferenceException';

/**
 * Entidad de Preferencias de Notificación en el dominio
 * Implementa Entity para seguir el patrón común de entidades
 */
export class NotificationPreference implements Entity<string> {
  readonly id: string;
  readonly userId: string;
  
  // Canales de notificación habilitados
  private readonly _channelPreferences: Map<NotificationChannel, ChannelPreference>;
  
  // Preferencias por tipo de notificación
  private readonly _typePreferences: Map<NotificationType, TypePreference>;

  readonly createdAt: Date;
  readonly updatedAt: Date;

  /**
   * Constructor privado de NotificationPreference
   * Se debe usar el método estático create() para crear instancias
   */
  private constructor(props: NotificationPreferenceProps) {
    this.id = props.id;
    this.userId = props.userId;
    this._channelPreferences = props.channelPreferences;
    this._typePreferences = props.typePreferences;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Crea una nueva preferencia de notificación validando los datos
   * @param props Propiedades para crear la preferencia
   * @returns Nueva instancia de NotificationPreference
   * @throws NotificationPreferenceException si los datos no son válidos
   */
  static create(props: NotificationPreferenceCreateProps): NotificationPreference {
    const id = props.id || uuidv4();
    
    // Validar userId
    if (!props.userId || props.userId.trim().length === 0) {
      throw new NotificationPreferenceException('El ID de usuario es requerido');
    }

    // Inicializar preferencias de canales
    const channelPreferences = new Map<NotificationChannel, ChannelPreference>();
    
    // Valores por defecto para canales
    const defaultChannels: Record<string, ChannelPreference> = {
      [NotificationChannel.IN_APP]: { enabled: true, settings: {} },
      [NotificationChannel.EMAIL]: { enabled: true, settings: {} },
      [NotificationChannel.PUSH]: { enabled: false, settings: {} },
      [NotificationChannel.SMS]: { enabled: false, settings: {} }
    };
    
    // Combinar valores predeterminados con los proporcionados
    const combinedChannels = { 
      ...defaultChannels, 
      ...(props.channelPreferences || {}) 
    };
    
    // Configurar cada canal
    Object.entries(combinedChannels).forEach(([channel, preference]) => {
      channelPreferences.set(channel as NotificationChannel, preference);
    });

    // Inicializar preferencias de tipos
    const typePreferences = new Map<NotificationType, TypePreference>();
    
    // Valores por defecto para tipos
    const typeEntries = Object.values(NotificationType);
    const defaultTypePreferences: Record<string, TypePreference> = {};
    
    typeEntries.forEach(type => {
      defaultTypePreferences[type] = { 
        enabled: true,
        channels: []
      };
    });
    
    // Combinar valores predeterminados con los proporcionados
    const combinedTypes = { 
      ...defaultTypePreferences, 
      ...(props.typePreferences || {}) 
    };
    
    // Configurar cada tipo
    Object.entries(combinedTypes).forEach(([type, preference]) => {
      typePreferences.set(type as NotificationType, preference);
    });
    
    return new NotificationPreference({
      id,
      userId: props.userId,
      channelPreferences,
      typePreferences,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date()
    });
  }

  /**
   * Reconstruye una NotificationPreference desde almacenamiento (sin validaciones)
   * @param props Propiedades para reconstruir la preferencia
   * @returns Instancia de NotificationPreference reconstruida
   */
  static reconstitute(props: NotificationPreferenceProps): NotificationPreference {
    return new NotificationPreference(props);
  }

  /**
   * Compara si dos entidades NotificationPreference son iguales por su identidad
   * @param entity Entidad a comparar
   * @returns true si las entidades tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof NotificationPreference)) {
      return false;
    }
    
    return this.id === entity.id;
  }

  /**
   * Verifica si un tipo de notificación está habilitado
   * @param type Tipo de notificación
   * @returns true si está habilitado
   */
  isTypeEnabled(type: NotificationType): boolean {
    const preference = this._typePreferences.get(type);
    return preference ? preference.enabled : true;
  }

  /**
   * Verifica si un canal de notificación está habilitado
   * @param channel Canal de notificación
   * @returns true si está habilitado
   */
  isChannelEnabled(channel: NotificationChannel): boolean {
    const preference = this._channelPreferences.get(channel);
    return preference ? preference.enabled : false;
  }

  /**
   * Verifica si un canal está habilitado para un tipo específico de notificación
   * @param type Tipo de notificación
   * @param channel Canal de notificación
   * @returns true si está habilitado
   */
  isChannelEnabledForType(type: NotificationType, channel: NotificationChannel): boolean {
    // Verificar si el tipo está habilitado
    if (!this.isTypeEnabled(type)) {
      return false;
    }
    
    // Verificar si el canal está habilitado
    if (!this.isChannelEnabled(channel)) {
      return false;
    }
    
    // Verificar si hay canales específicos para este tipo
    const typePreference = this._typePreferences.get(type);
    if (typePreference && typePreference.channels && typePreference.channels.length > 0) {
      return typePreference.channels.includes(channel);
    }
    
    // Si no hay canales específicos, usar la configuración general
    return true;
  }

  /**
   * Obtiene la configuración de un canal
   * @param channel Canal de notificación
   * @returns Configuración del canal o undefined si no existe
   */
  getChannelSettings(channel: NotificationChannel): Record<string, any> | undefined {
    const preference = this._channelPreferences.get(channel);
    return preference ? preference.settings : undefined;
  }

  /**
   * Actualiza las preferencias de canal
   * @param channel Canal a actualizar
   * @param enabled Estado habilitado/deshabilitado
   * @param settings Configuración del canal (opcional)
   * @returns Preferencias actualizadas
   */
  updateChannelPreference(
    channel: NotificationChannel, 
    enabled: boolean, 
    settings?: Record<string, any>
  ): NotificationPreference {
    const newChannelPreferences = new Map(this._channelPreferences);
    
    const current = this._channelPreferences.get(channel) || { 
      enabled: false, 
      settings: {} 
    };
    
    newChannelPreferences.set(channel, {
      enabled,
      settings: settings ? { ...current.settings, ...settings } : current.settings
    });
    
    return new NotificationPreference({
      ...this.toObject(),
      channelPreferences: newChannelPreferences,
      updatedAt: new Date()
    });
  }

  /**
   * Actualiza las preferencias de un tipo de notificación
   * @param type Tipo de notificación a actualizar
   * @param enabled Estado habilitado/deshabilitado
   * @param channels Canales específicos para este tipo (opcional)
   * @returns Preferencias actualizadas
   */
  updateTypePreference(
    type: NotificationType, 
    enabled: boolean, 
    channels?: NotificationChannel[]
  ): NotificationPreference {
    const newTypePreferences = new Map(this._typePreferences);
    
    const current = this._typePreferences.get(type) || { 
      enabled: true, 
      channels: [] 
    };
    
    newTypePreferences.set(type, {
      enabled,
      channels: channels || current.channels
    });
    
    return new NotificationPreference({
      ...this.toObject(),
      typePreferences: newTypePreferences,
      updatedAt: new Date()
    });
  }

  /**
   * Desactiva completamente las notificaciones para un tipo
   * @param type Tipo de notificación a desactivar
   * @returns Preferencias actualizadas
   */
  disableType(type: NotificationType): NotificationPreference {
    return this.updateTypePreference(type, false);
  }

  /**
   * Obtiene los canales habilitados para un tipo de notificación
   * @param type Tipo de notificación
   * @returns Array de canales habilitados
   */
  getEnabledChannelsForType(type: NotificationType): NotificationChannel[] {
    if (!this.isTypeEnabled(type)) {
      return [];
    }
    
    const typePreference = this._typePreferences.get(type);
    
    // Si hay canales específicos definidos para este tipo
    if (typePreference && typePreference.channels && typePreference.channels.length > 0) {
      return typePreference.channels.filter(channel => this.isChannelEnabled(channel));
    }
    
    // Si no hay canales específicos, devolver todos los canales habilitados
    return Object.values(NotificationChannel).filter(channel => 
      this.isChannelEnabled(channel)
    );
  }

  /**
   * Obtiene las preferencias de canal como objeto
   */
  get channelPreferences(): Record<string, ChannelPreference> { 
    return Object.fromEntries(this._channelPreferences); 
  }

  /**
   * Obtiene las preferencias de tipo como objeto
   */
  get typePreferences(): Record<string, TypePreference> { 
    return Object.fromEntries(this._typePreferences); 
  }

  /**
   * Convierte la entidad a un objeto plano
   * @returns Objeto plano con las propiedades de las preferencias
   */
  toObject(): NotificationPreferenceProps {
    return {
      id: this.id,
      userId: this.userId,
      channelPreferences: this._channelPreferences,
      typePreferences: this._typePreferences,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * Preferencia para un canal específico
 */
export interface ChannelPreference {
  enabled: boolean;
  settings?: Record<string, any>;
}

/**
 * Preferencia para un tipo específico
 */
export interface TypePreference {
  enabled: boolean;
  channels?: NotificationChannel[];
}

/**
 * Props para reconstruir una preferencia existente
 */
export interface NotificationPreferenceProps {
  id: string;
  userId: string;
  channelPreferences: Map<NotificationChannel, ChannelPreference>;
  typePreferences: Map<NotificationType, TypePreference>;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Props para crear una nueva preferencia
 */
export interface NotificationPreferenceCreateProps {
  id?: string;
  userId: string;
  channelPreferences?: Record<string, ChannelPreference>;
  typePreferences?: Record<string, TypePreference>;
  createdAt?: Date;
  updatedAt?: Date;
} 