import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../../../core/interfaces/Entity';
import { Email } from '../value-objects/Email';
import { Role, RoleEnum } from '../value-objects/Role';
import { UserCreateException } from '../exceptions/UserCreateException';
import { UserUpdateException } from '../exceptions/UserUpdateException';

/**
 * Entidad de dominio para usuarios
 * Encapsula reglas de negocio relacionadas con usuarios del sistema
 */
export class User implements Entity<string> {
  // Propiedades base de la entidad
  readonly id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly isActive: boolean;

  // Propiedades específicas del usuario
  readonly name: string;
  readonly email: Email;
  private _password: string;
  readonly role: Role;

  /**
   * Constructor privado de User
   * Se debe usar el método estático create() para crear instancias
   */
  private constructor(props: UserProps) {
    this.id = props.id || uuidv4();
    this.name = props.name;
    this.email = props.email;
    this._password = props.password;
    this.role = props.role;
    this.isActive = props.isActive !== undefined ? props.isActive : true;
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  /**
   * Crea una nueva instancia de User validando los datos
   * @param props Propiedades para crear el usuario
   * @returns Nueva instancia de User
   * @throws UserCreateException si los datos no son válidos
   */
  static create(props: UserCreateProps): User {
    // Validar nombre
    if (!props.name || props.name.trim().length === 0) {
      throw new UserCreateException('El nombre es requerido');
    }

    if (props.name.length < 2 || props.name.length > 50) {
      throw new UserCreateException('El nombre debe tener entre 2 y 50 caracteres');
    }

    // Validar contraseña
    if (!props.password || props.password.trim().length === 0) {
      throw new UserCreateException('La contraseña es requerida');
    }

    if (props.password.length < 8) {
      throw new UserCreateException('La contraseña debe tener al menos 8 caracteres');
    }

    // Convertir email en ValueObject si es string
    const emailVO = props.email instanceof Email ? props.email : new Email(props.email);

    // Convertir rol en ValueObject si es string o enum
    const roleVO = props.role instanceof Role ? 
      props.role : 
      new Role(props.role || RoleEnum.USER);

    // Crear usuario con los value objects
    return new User({
      ...props,
      email: emailVO,
      role: roleVO
    });
  }

  /**
   * Reconstruye un User desde almacenamiento (sin validaciones)
   * @param props Propiedades para reconstruir el usuario
   * @returns Instancia de User reconstruida
   */
  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  /**
   * Obtiene la contraseña (hash) del usuario
   * @returns Contraseña hasheada
   */
  get password(): string {
    return this._password;
  }

  /**
   * Compara si dos entidades User son iguales por su identidad
   * @param entity Entidad a comparar
   * @returns true si las entidades tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof User)) {
      return false;
    }
    
    return this.id === entity.id;
  }

  /**
   * Actualiza los datos del usuario
   * @param props Propiedades a actualizar
   * @returns Usuario actualizado
   * @throws UserUpdateException si los datos actualizados no son válidos
   */
  update(props: UserUpdateProps): User {
    if (!this.isActive) {
      throw new UserUpdateException('No se puede actualizar un usuario inactivo');
    }

    // Validar nombre si se proporciona
    if (props.name) {
      if (props.name.trim().length === 0) {
        throw new UserUpdateException('El nombre no puede estar vacío');
      }

      if (props.name.length < 2 || props.name.length > 50) {
        throw new UserUpdateException('El nombre debe tener entre 2 y 50 caracteres');
      }
    }

    // Validar contraseña si se proporciona
    if (props.password) {
      if (props.password.trim().length === 0) {
        throw new UserUpdateException('La contraseña no puede estar vacía');
      }

      if (props.password.length < 8) {
        throw new UserUpdateException('La contraseña debe tener al menos 8 caracteres');
      }
    }

    // Convertir email en ValueObject si se proporciona
    const emailVO = props.email instanceof Email ? 
      props.email : 
      props.email ? new Email(props.email) : this.email;

    // Convertir rol en ValueObject si se proporciona
    const roleVO = props.role instanceof Role ? 
      props.role : 
      props.role ? new Role(props.role) : this.role;

    // Crear usuario actualizado con los value objects
    return new User({
      id: this.id,
      name: props.name || this.name,
      email: emailVO,
      password: props.password || this._password,
      role: roleVO,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: new Date()
    });
  }

  /**
   * Desactiva el usuario
   * @returns Usuario desactivado
   */
  deactivate(): User {
    if (!this.isActive) {
      return this; // Ya está desactivado
    }

    return new User({
      ...this.toObject(),
      isActive: false,
      updatedAt: new Date()
    });
  }

  /**
   * Activa el usuario
   * @returns Usuario activado
   */
  activate(): User {
    if (this.isActive) {
      return this; // Ya está activado
    }

    return new User({
      ...this.toObject(),
      isActive: true,
      updatedAt: new Date()
    });
  }

  /**
   * Cambia la contraseña del usuario
   * @param newPassword Nueva contraseña
   * @returns Usuario con contraseña actualizada
   * @throws UserUpdateException si la contraseña no es válida
   */
  changePassword(newPassword: string): User {
    if (!this.isActive) {
      throw new UserUpdateException('No se puede cambiar la contraseña de un usuario inactivo');
    }

    if (!newPassword || newPassword.trim().length === 0) {
      throw new UserUpdateException('La nueva contraseña es requerida');
    }

    if (newPassword.length < 8) {
      throw new UserUpdateException('La nueva contraseña debe tener al menos 8 caracteres');
    }

    return new User({
      ...this.toObject(),
      password: newPassword,
      updatedAt: new Date()
    });
  }

  /**
   * Verifica si el usuario tiene un rol específico
   * @param roleToCheck Rol a verificar
   * @returns true si el usuario tiene el rol
   */
  hasRole(roleToCheck: RoleEnum | string | Role): boolean {
    if (roleToCheck instanceof Role) {
      return this.role.equals(roleToCheck);
    }
    
    return this.role.value() === roleToCheck;
  }

  /**
   * Verifica si el usuario es administrador
   * @returns true si el usuario es administrador
   */
  isAdmin(): boolean {
    return this.role.isAdmin();
  }

  /**
   * Convierte la entidad a un objeto plano
   * @returns Objeto plano con las propiedades del usuario
   */
  toObject(): UserProps {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      password: this._password,
      role: this.role,
      isActive: this.isActive,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

/**
 * Props para reconstruir un usuario existente
 */
export interface UserProps {
  id: string;
  name: string;
  email: Email;
  password: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Props para crear un nuevo usuario
 */
export interface UserCreateProps {
  id?: string;
  name: string;
  email: string | Email;
  password: string;
  role?: RoleEnum | string | Role;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Props para actualizar un usuario
 */
export interface UserUpdateProps {
  name?: string;
  email?: string | Email;
  password?: string;
  role?: RoleEnum | string | Role;
} 