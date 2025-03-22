import { Entity } from '../../core/interfaces/Entity';

/**
 * Propiedades para crear un organizador
 */
export interface OrganizerCreateProps {
  id?: string;
  userId: string;
  name: string;
  description: string;
  imageUrl?: string;
  website?: string;
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  verified?: boolean;
  rating?: number;
  eventCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Propiedades para actualizar un organizador
 */
export interface OrganizerUpdateProps {
  name?: string;
  description?: string;
  imageUrl?: string;
  website?: string;
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

/**
 * Propiedades completas de un organizador
 */
export interface OrganizerProps {
  id: string;
  userId: string;
  name: string;
  description: string;
  imageUrl: string | null;
  website: string | null;
  social: {
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    linkedin: string | null;
  };
  verified: boolean;
  rating: number;
  eventCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Entidad Organizador
 * 
 * Representa un organizador de eventos en el sistema
 */
export class Organizer implements Entity<string> {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly description: string;
  readonly imageUrl: string | null;
  readonly website: string | null;
  readonly social: {
    facebook: string | null;
    twitter: string | null;
    instagram: string | null;
    linkedin: string | null;
  };
  readonly verified: boolean;
  readonly rating: number;
  readonly eventCount: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly isActive: boolean = true;

  constructor(props: OrganizerProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.name = props.name;
    this.description = props.description;
    this.imageUrl = props.imageUrl;
    this.website = props.website;
    this.social = props.social;
    this.verified = props.verified;
    this.rating = props.rating;
    this.eventCount = props.eventCount;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Crea una nueva instancia de Organizador
   */
  static create(props: OrganizerCreateProps): Organizer {
    const id = props.id || crypto.randomUUID();
    const now = new Date();

    return new Organizer({
      id,
      userId: props.userId,
      name: props.name,
      description: props.description,
      imageUrl: props.imageUrl || null,
      website: props.website || null,
      social: {
        facebook: props.social?.facebook || null,
        twitter: props.social?.twitter || null,
        instagram: props.social?.instagram || null,
        linkedin: props.social?.linkedin || null,
      },
      verified: props.verified || false,
      rating: props.rating || 0,
      eventCount: props.eventCount || 0,
      createdAt: props.createdAt || now,
      updatedAt: props.updatedAt || now,
    });
  }

  /**
   * Actualiza un organizador con nuevas propiedades
   */
  update(props: OrganizerUpdateProps): Organizer {
    return new Organizer({
      ...this.toObject(),
      ...props,
      social: {
        ...this.social,
        ...props.social,
      },
      updatedAt: new Date(),
    });
  }

  /**
   * Verifica un organizador
   */
  verify(verified: boolean): Organizer {
    return new Organizer({
      ...this.toObject(),
      verified,
      updatedAt: new Date(),
    });
  }

  /**
   * Actualiza la calificación de un organizador
   */
  updateRating(rating: number): Organizer {
    return new Organizer({
      ...this.toObject(),
      rating,
      updatedAt: new Date(),
    });
  }

  /**
   * Incrementa el contador de eventos
   */
  incrementEventCount(): Organizer {
    return new Organizer({
      ...this.toObject(),
      eventCount: this.eventCount + 1,
      updatedAt: new Date(),
    });
  }

  /**
   * Decrementa el contador de eventos
   */
  decrementEventCount(): Organizer {
    return new Organizer({
      ...this.toObject(),
      eventCount: Math.max(0, this.eventCount - 1),
      updatedAt: new Date(),
    });
  }

  /**
   * Convierte la entidad a un objeto plano
   */
  toObject(): OrganizerProps {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      description: this.description,
      imageUrl: this.imageUrl,
      website: this.website,
      social: {
        facebook: this.social.facebook,
        twitter: this.social.twitter,
        instagram: this.social.instagram,
        linkedin: this.social.linkedin,
      },
      verified: this.verified,
      rating: this.rating,
      eventCount: this.eventCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof Organizer)) {
      return false;
    }
    return this.id === entity.id;
  }
} 