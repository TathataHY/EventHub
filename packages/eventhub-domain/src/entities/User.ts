import { UserCreateException } from '../exceptions/UserCreateException';
import { UserUpdateException } from '../exceptions/UserUpdateException';
import { Role } from '../value-objects/Role';
import { v4 as uuidv4 } from 'uuid';

/**
 * Entidad de dominio para usuarios
 * Encapsula reglas de negocio relacionadas con usuarios
 */
export class User {
  private _id: string;
  private _name: string;
  private _email: string;
  private _password: string;
  private _role: Role;
  private _isActive: boolean;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(params: UserParams) {
    this._id = params.id || uuidv4();
    this._name = params.name;
    this._email = params.email;
    this._password = params.password;
    this._role = params.role || Role.USER;
    this._isActive = params.isActive !== undefined ? params.isActive : true;
    this._createdAt = params.createdAt || new Date();
    this._updatedAt = params.updatedAt || new Date();

    this.validate();
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get password(): string {
    return this._password;
  }

  get role(): Role {
    return this._role;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  /**
   * Validación de los datos del usuario
   * @throws UserCreateException si los datos no son válidos
   */
  private validate(): void {
    // Validar campos requeridos
    if (!this._name || this._name.trim().length === 0) {
      throw new UserCreateException('El nombre es requerido');
    }

    if (!this._email || this._email.trim().length === 0) {
      throw new UserCreateException('El email es requerido');
    }

    if (!this._password || this._password.trim().length === 0) {
      throw new UserCreateException('La contraseña es requerida');
    }

    // Validar longitud de campos
    if (this._name.length < 2 || this._name.length > 50) {
      throw new UserCreateException('El nombre debe tener entre 2 y 50 caracteres');
    }

    if (this._password.length < 8) {
      throw new UserCreateException('La contraseña debe tener al menos 8 caracteres');
    }

    // Validar formato de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this._email)) {
      throw new UserCreateException('El formato del email no es válido');
    }

    // Validar rol
    if (!Object.values(Role).includes(this._role)) {
      throw new UserCreateException('El rol especificado no es válido');
    }
  }

  /**
   * Actualiza los datos básicos del usuario
   * @throws UserUpdateException si los datos actualizados no son válidos
   */
  update(params: UserUpdateParams): void {
    if (!this._isActive) {
      throw new UserUpdateException('No se puede actualizar un usuario inactivo');
    }

    if (params.name !== undefined) {
      this._name = params.name;
    }

    if (params.email !== undefined) {
      this._email = params.email;
    }

    if (params.password !== undefined) {
      this._password = params.password;
    }

    if (params.role !== undefined) {
      this._role = params.role;
    }

    this._updatedAt = new Date();
    
    try {
      this.validate();
    } catch (error) {
      if (error instanceof UserCreateException) {
        // Convertir excepciones de creación a excepciones de actualización
        throw new UserUpdateException(error.message);
      }
      throw error;
    }
  }

  /**
   * Desactiva el usuario
   */
  deactivate(): void {
    if (!this._isActive) {
      return; // Ya está desactivado
    }

    this._isActive = false;
    this._updatedAt = new Date();
  }

  /**
   * Activa el usuario
   */
  activate(): void {
    if (this._isActive) {
      return; // Ya está activado
    }

    this._isActive = true;
    this._updatedAt = new Date();
  }

  /**
   * Cambia la contraseña del usuario
   * @throws UserUpdateException si la contraseña no cumple con las validaciones
   */
  changePassword(newPassword: string): void {
    if (!this._isActive) {
      throw new UserUpdateException('No se puede cambiar la contraseña de un usuario inactivo');
    }

    if (!newPassword || newPassword.trim().length === 0) {
      throw new UserUpdateException('La nueva contraseña es requerida');
    }

    if (newPassword.length < 8) {
      throw new UserUpdateException('La nueva contraseña debe tener al menos 8 caracteres');
    }

    this._password = newPassword;
    this._updatedAt = new Date();
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: Role): boolean {
    return this._role === role;
  }

  /**
   * Verifica si el usuario es administrador
   */
  isAdmin(): boolean {
    return this._role === Role.ADMIN;
  }
}

export interface UserParams {
  id?: string;
  name: string;
  email: string;
  password: string;
  role?: Role;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserUpdateParams {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
} 