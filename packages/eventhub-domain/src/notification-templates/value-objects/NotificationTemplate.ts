import { NotificationType } from '../../notifications/value-objects/NotificationType';
import { NotificationChannel } from './NotificationChannel';
import { Entity } from '../../core/interfaces/Entity';
import { v4 as uuidv4 } from 'uuid';
import { NotificationTemplateCreateException } from '../exceptions/NotificationTemplateCreateException';
import { NotificationTemplateUpdateException } from '../exceptions/NotificationTemplateUpdateException';

/**
 * Entidad para representar las plantillas de notificaciones
 * Implementa Entity siguiendo la misma estructura que el resto de entidades
 */
export class NotificationTemplate implements Entity<string> {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly notificationType: NotificationType;
  readonly channel: NotificationChannel;
  readonly titleTemplate: string;
  readonly bodyTemplate: string;
  readonly htmlTemplate: string | null;
  readonly isActive: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  /**
   * Constructor privado de NotificationTemplate
   * Se debe usar el método estático create() para crear instancias
   */
  private constructor(props: NotificationTemplateProps) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.notificationType = props.notificationType;
    this.channel = props.channel;
    this.titleTemplate = props.titleTemplate;
    this.bodyTemplate = props.bodyTemplate;
    this.htmlTemplate = props.htmlTemplate;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Crea una nueva plantilla de notificación validando los datos
   * @param props Propiedades para crear la plantilla
   * @returns Nueva instancia de NotificationTemplate
   * @throws NotificationTemplateCreateException si los datos no son válidos
   */
  static create(props: NotificationTemplateCreateProps): NotificationTemplate {
    const id = props.id || uuidv4();
    
    // Validar nombre
    if (!props.name || props.name.trim().length === 0) {
      throw new NotificationTemplateCreateException('El nombre de la plantilla es requerido');
    }
    
    // Validar title template
    if (!props.titleTemplate || props.titleTemplate.trim().length === 0) {
      throw new NotificationTemplateCreateException('La plantilla de título es requerida');
    }
    
    // Validar body template
    if (!props.bodyTemplate || props.bodyTemplate.trim().length === 0) {
      throw new NotificationTemplateCreateException('La plantilla de cuerpo es requerida');
    }
    
    // Validar html template para email
    if (props.channel === NotificationChannel.EMAIL && !props.htmlTemplate) {
      throw new NotificationTemplateCreateException('La plantilla HTML es requerida para notificaciones por email');
    }
    
    // Crear plantilla
    return new NotificationTemplate({
      id,
      name: props.name,
      description: props.description || '',
      notificationType: props.notificationType,
      channel: props.channel,
      titleTemplate: props.titleTemplate,
      bodyTemplate: props.bodyTemplate,
      htmlTemplate: props.htmlTemplate || null,
      isActive: props.isActive ?? true,
      createdAt: props.createdAt || new Date(),
      updatedAt: props.updatedAt || new Date()
    });
  }

  /**
   * Reconstruye un NotificationTemplate desde almacenamiento (sin validaciones)
   * @param props Propiedades para reconstruir la plantilla
   * @returns Instancia de NotificationTemplate reconstruida
   */
  static reconstitute(props: NotificationTemplateProps): NotificationTemplate {
    return new NotificationTemplate(props);
  }

  /**
   * Compara si dos entidades NotificationTemplate son iguales por su identidad
   * @param entity Entidad a comparar
   * @returns true si las entidades tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof NotificationTemplate)) {
      return false;
    }
    
    return this.id === entity.id;
  }

  /**
   * Actualiza el nombre de la plantilla
   * @param name Nuevo nombre
   * @returns Plantilla actualizada
   * @throws NotificationTemplateUpdateException si el nombre no es válido
   */
  updateName(name: string): NotificationTemplate {
    if (!name || name.trim().length === 0) {
      throw new NotificationTemplateUpdateException('El nombre de la plantilla es requerido');
    }
    
    return new NotificationTemplate({
      ...this.toObject(),
      name,
      updatedAt: new Date()
    });
  }

  /**
   * Actualiza la descripción de la plantilla
   * @param description Nueva descripción
   * @returns Plantilla actualizada
   */
  updateDescription(description: string): NotificationTemplate {
    return new NotificationTemplate({
      ...this.toObject(),
      description,
      updatedAt: new Date()
    });
  }

  /**
   * Actualiza la plantilla de título
   * @param titleTemplate Nueva plantilla de título
   * @returns Plantilla actualizada
   * @throws NotificationTemplateUpdateException si la plantilla no es válida
   */
  updateTitleTemplate(titleTemplate: string): NotificationTemplate {
    if (!titleTemplate || titleTemplate.trim().length === 0) {
      throw new NotificationTemplateUpdateException('La plantilla de título es requerida');
    }
    
    return new NotificationTemplate({
      ...this.toObject(),
      titleTemplate,
      updatedAt: new Date()
    });
  }

  /**
   * Actualiza la plantilla de cuerpo
   * @param bodyTemplate Nueva plantilla de cuerpo
   * @returns Plantilla actualizada
   * @throws NotificationTemplateUpdateException si la plantilla no es válida
   */
  updateBodyTemplate(bodyTemplate: string): NotificationTemplate {
    if (!bodyTemplate || bodyTemplate.trim().length === 0) {
      throw new NotificationTemplateUpdateException('La plantilla de cuerpo es requerida');
    }
    
    return new NotificationTemplate({
      ...this.toObject(),
      bodyTemplate,
      updatedAt: new Date()
    });
  }

  /**
   * Actualiza la plantilla HTML
   * @param htmlTemplate Nueva plantilla HTML
   * @returns Plantilla actualizada
   * @throws NotificationTemplateUpdateException si la plantilla no es válida para email
   */
  updateHtmlTemplate(htmlTemplate: string | null): NotificationTemplate {
    if (this.channel === NotificationChannel.EMAIL && !htmlTemplate) {
      throw new NotificationTemplateUpdateException('La plantilla HTML es requerida para notificaciones por email');
    }
    
    return new NotificationTemplate({
      ...this.toObject(),
      htmlTemplate,
      updatedAt: new Date()
    });
  }

  /**
   * Activa la plantilla
   * @returns Plantilla activada
   */
  activate(): NotificationTemplate {
    if (this.isActive) {
      return this; // Ya está activa
    }
    
    return new NotificationTemplate({
      ...this.toObject(),
      isActive: true,
      updatedAt: new Date()
    });
  }

  /**
   * Desactiva la plantilla
   * @returns Plantilla desactivada
   */
  deactivate(): NotificationTemplate {
    if (!this.isActive) {
      return this; // Ya está inactiva
    }
    
    return new NotificationTemplate({
      ...this.toObject(),
      isActive: false,
      updatedAt: new Date()
    });
  }

  /**
   * Renderiza el título de la notificación con los datos proporcionados
   * @param data Datos para renderizar la plantilla
   * @returns Título renderizado
   */
  renderTitle(data: Record<string, any>): string {
    return this.renderTemplate(this.titleTemplate, data);
  }

  /**
   * Renderiza el cuerpo de la notificación con los datos proporcionados
   * @param data Datos para renderizar la plantilla
   * @returns Cuerpo renderizado
   */
  renderBody(data: Record<string, any>): string {
    return this.renderTemplate(this.bodyTemplate, data);
  }

  /**
   * Renderiza el HTML de la notificación con los datos proporcionados (si está disponible)
   * @param data Datos para renderizar la plantilla
   * @returns HTML renderizado o null si no hay plantilla HTML
   */
  renderHtml(data: Record<string, any>): string | null {
    if (!this.htmlTemplate) {
      return null;
    }
    return this.renderTemplate(this.htmlTemplate, data);
  }

  /**
   * Renderiza una plantilla con los datos proporcionados
   * @param template Plantilla a renderizar
   * @param data Datos para renderizar la plantilla
   * @returns Plantilla renderizada
   */
  private renderTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{([^}]+)\}\}/g, (_, key) => {
      const keys = key.trim().split('.');
      let value = data;
      
      for (const k of keys) {
        if (value === undefined || value === null) {
          return '';
        }
        value = value[k];
      }
      
      return value !== undefined && value !== null ? String(value) : '';
    });
  }

  /**
   * Convierte la entidad a un objeto plano
   * @returns Objeto plano con las propiedades de la plantilla
   */
  toObject(): NotificationTemplateProps {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      notificationType: this.notificationType,
      channel: this.channel,
      titleTemplate: this.titleTemplate,
      bodyTemplate: this.bodyTemplate,
      htmlTemplate: this.htmlTemplate,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * Props para reconstruir una plantilla existente
 */
export interface NotificationTemplateProps {
  id: string;
  name: string;
  description: string;
  notificationType: NotificationType;
  channel: NotificationChannel;
  titleTemplate: string;
  bodyTemplate: string;
  htmlTemplate: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Props para crear una nueva plantilla
 */
export interface NotificationTemplateCreateProps {
  id?: string;
  name: string;
  description?: string;
  notificationType: NotificationType;
  channel: NotificationChannel;
  titleTemplate: string;
  bodyTemplate: string;
  htmlTemplate?: string | null;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
} 