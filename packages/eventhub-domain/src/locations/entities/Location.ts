import { Entity } from '../../core/interfaces/Entity';
import { Address } from '../value-objects/Address';
import { Coordinates } from '../value-objects/Coordinates';
import { LocationCreateException } from '../exceptions/LocationCreateException';
import { LocationUpdateException } from '../exceptions/LocationUpdateException';

export interface LocationProps {
  id: string;
  name: string;
  address: Address;
  coordinates?: Coordinates;
  capacity?: number;
  isActive: boolean;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationCreateProps {
  id: string;
  name: string;
  address: Address;
  coordinates?: Coordinates;
  capacity?: number;
  description?: string;
}

export interface LocationUpdateProps {
  name?: string;
  address?: Address;
  coordinates?: Coordinates;
  capacity?: number;
  description?: string;
}

export class Location implements Entity<string> {
  readonly id: string;
  readonly createdAt: Date;
  private _updatedAt: Date;
  private _isActive: boolean;
  private _name: string;
  private _address: Address;
  private _coordinates?: Coordinates;
  private _capacity?: number;
  private _description?: string;

  private constructor(props: LocationProps) {
    this.id = props.id;
    this._name = props.name;
    this._address = props.address;
    this._coordinates = props.coordinates;
    this._capacity = props.capacity;
    this._isActive = props.isActive;
    this._description = props.description;
    this.createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  public static create(props: LocationCreateProps): Location {
    if (!props.name || props.name.trim() === '') {
      throw new LocationCreateException('El nombre de la ubicación es obligatorio');
    }

    if (!props.address) {
      throw new LocationCreateException('La dirección es obligatoria');
    }

    if (props.capacity !== undefined && props.capacity < 0) {
      throw new LocationCreateException('La capacidad no puede ser negativa');
    }

    const now = new Date();
    return new Location({
      ...props,
      isActive: true,
      createdAt: now,
      updatedAt: now
    });
  }

  get name(): string {
    return this._name;
  }

  get address(): Address {
    return this._address;
  }

  get coordinates(): Coordinates | undefined {
    return this._coordinates;
  }

  get capacity(): number | undefined {
    return this._capacity;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get description(): string | undefined {
    return this._description;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  public update(props: LocationUpdateProps): void {
    let updated = false;

    if (props.name !== undefined) {
      if (props.name.trim() === '') {
        throw new LocationUpdateException('El nombre de la ubicación no puede estar vacío');
      }
      this._name = props.name;
      updated = true;
    }

    if (props.address !== undefined) {
      this._address = props.address;
      updated = true;
    }

    if (props.coordinates !== undefined) {
      this._coordinates = props.coordinates;
      updated = true;
    }

    if (props.capacity !== undefined) {
      if (props.capacity < 0) {
        throw new LocationUpdateException('La capacidad no puede ser negativa');
      }
      this._capacity = props.capacity;
      updated = true;
    }

    if (props.description !== undefined) {
      this._description = props.description;
      updated = true;
    }

    if (updated) {
      this._updatedAt = new Date();
    }
  }

  public activate(): void {
    if (this._isActive) {
      return;
    }
    
    this._isActive = true;
    this._updatedAt = new Date();
  }

  public deactivate(): void {
    if (!this._isActive) {
      return;
    }
    
    this._isActive = false;
    this._updatedAt = new Date();
  }

  public toObject(): LocationProps {
    return {
      id: this.id,
      name: this._name,
      address: this._address,
      coordinates: this._coordinates,
      capacity: this._capacity,
      isActive: this._isActive,
      description: this._description,
      createdAt: this.createdAt,
      updatedAt: this._updatedAt
    };
  }
} 