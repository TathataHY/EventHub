import { v4 as uuidv4 } from 'uuid';
import { Entity } from '../../core/interfaces/Entity';
import { Email } from '../value-objects/Email';
import { Role, RoleEnum } from '../value-objects/Role';
import { UserCreateException } from '../exceptions/UserCreateException';
import { UserUpdateException } from '../exceptions/UserUpdateException';

/**
 * Entidad de dominio para usuarios
 * 
 * Representa a cualquier persona que interactúa con el sistema: administradores,
 * organizadores de eventos o asistentes. Encapsula todas las reglas de negocio
 * relacionadas con la gestión de usuarios, incluyendo registro, autenticación,
 * autorización y actualización de información personal.
 * 
 * Esta entidad es inmutable, cualquier modificación devuelve una nueva instancia
 * para garantizar la integridad de los datos y facilitar el seguimiento de cambios.
 * 
 * @implements {Entity<string>} Implementa la interfaz Entity con ID de tipo string
 */
export class User implements Entity<string> {
  /** Identificador único del usuario */
  readonly id: string;
  
  /** Fecha de creación del usuario en el sistema */
  readonly createdAt: Date;
  
  /** Fecha de última actualización del usuario */
  readonly updatedAt: Date;
  
  /** Indica si el usuario está activo en el sistema */
  readonly isActive: boolean;

  /** Nombre completo del usuario */
  readonly name: string;
  
  /** Dirección de correo electrónico del usuario (value object) */
  readonly email: Email;
  
  /** Contraseña encriptada del usuario (acceso limitado) */
  private _password: string;
  
  /** Rol del usuario en el sistema (value object) */
  readonly role: Role;

  /**
   * Constructor privado de User
   * 
   * Inicializa una nueva instancia con los valores proporcionados.
   * Este constructor es privado para garantizar que todas las instancias
   * se creen a través de métodos factory que apliquen las validaciones necesarias.
   * 
   * @param props Propiedades iniciales del usuario
   * @private Esta clase utiliza el patrón Factory para su creación
   */
  private constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this._password = props.password;
    this.role = props.role;
    this.isActive = props.isActive;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  /**
   * Crea un nuevo usuario con todas las validaciones de negocio
   * 
   * Este método factory es el punto de entrada principal para la creación
   * de usuarios y garantiza que se cumplan todas las reglas de negocio
   * relacionadas con el registro de usuarios.
   * 
   * @param props Propiedades para crear el usuario
   * @returns Nueva instancia de Usuario validada
   * @throws {UserCreateException} Si algún dato no cumple con las reglas de negocio
   */
  static create(props: UserCreateProps): User {
    // Validar nombre
    if (!props.name || props.name.trim().length === 0) {
      throw new UserCreateException('El nombre es requerido');
    }

    // Crear o validar email
    let email: Email;
    try {
      email = props.email instanceof Email ? props.email : Email.create(props.email);
    } catch (error) {
      throw new UserCreateException(`Email inválido: ${error.message}`);
    }

    // Validar contraseña
    if (!props.password || props.password.length < 6) {
      throw new UserCreateException('La contraseña debe tener al menos 6 caracteres');
    }

    // Crear o validar rol
    let role: Role;
    if (props.role instanceof Role) {
      role = props.role;
    } else if (props.role) {
      try {
        role = Role.create(props.role as string);
      } catch (error) {
        throw new UserCreateException(`Rol inválido: ${error.message}`);
      }
    } else {
      role = Role.user(); // Rol por defecto
    }

    const now = new Date();
    
    // Crear el usuario
    return new User({
      id: props.id || uuidv4(),
      name: props.name.trim(),
      email,
      password: props.password, // En la capa de aplicación se debe encriptar
      role,
      isActive: props.isActive !== undefined ? props.isActive : true,
      createdAt: props.createdAt || now,
      updatedAt: props.updatedAt || now
    });
  }

  /**
   * Reconstruye un usuario desde persistencia
   * 
   * A diferencia del método create, este método no aplica validaciones 
   * completas ya que asume que los datos provienen de una fuente confiable.
   * 
   * @param props Propiedades completas del usuario
   * @returns Instancia de Usuario reconstruida
   */
  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  /**
   * Obtiene la contraseña encriptada del usuario
   * 
   * Esta propiedad es de solo lectura y su acceso debería
   * estar restringido a casos específicos de autenticación.
   * 
   * @returns La contraseña encriptada
   */
  get password(): string {
    return this._password;
  }

  /**
   * Compara si dos usuarios son la misma entidad
   * 
   * Dos usuarios son iguales si tienen el mismo ID, independientemente
   * de sus otros atributos.
   * 
   * @param entity Otra entidad para comparar
   * @returns true si ambas entidades tienen el mismo ID
   */
  equals(entity: Entity<string>): boolean {
    if (!(entity instanceof User)) {
      return false;
    }
    
    return this.id === entity.id;
  }

  /**
   * Actualiza los datos del usuario
   * 
   * Crea una nueva instancia con los datos actualizados sin modificar
   * la instancia original, aplicando todas las validaciones necesarias.
   * 
   * @param props Propiedades a actualizar
   * @returns Nueva instancia de Usuario con los cambios aplicados
   * @throws {UserUpdateException} Si los datos no cumplen con las reglas de negocio
   */
  update(props: UserUpdateProps): User {
    // Iniciar con los valores actuales
    const currentProps = this.toObject();
    let updated = false;

    // Actualizar nombre si se proporciona
    if (props.name !== undefined) {
      if (props.name.trim().length === 0) {
        throw new UserUpdateException('El nombre no puede estar vacío');
      }
      currentProps.name = props.name.trim();
      updated = true;
    }

    // Actualizar email si se proporciona
    if (props.email !== undefined) {
      try {
        currentProps.email = props.email instanceof Email 
          ? props.email 
          : Email.create(props.email);
        updated = true;
      } catch (error) {
        throw new UserUpdateException(`Email inválido: ${error.message}`);
      }
    }

    // Actualizar contraseña si se proporciona
    if (props.password !== undefined) {
      if (props.password.length < 6) {
        throw new UserUpdateException('La contraseña debe tener al menos 6 caracteres');
      }
      currentProps.password = props.password;
      updated = true;
    }

    // Actualizar rol si se proporciona
    if (props.role !== undefined) {
      try {
        currentProps.role = props.role instanceof Role 
          ? props.role 
          : Role.create(props.role as string);
        updated = true;
      } catch (error) {
        throw new UserUpdateException(`Rol inválido: ${error.message}`);
      }
    }

    // Si no hay cambios, devolver la instancia actual
    if (!updated) {
      return this;
    }

    // Actualizar la fecha de modificación
    currentProps.updatedAt = new Date();

    // Crear nueva instancia con los datos actualizados
    return new User(currentProps);
  }

  /**
   * Desactiva la cuenta de usuario
   * 
   * Crea una nueva instancia con el usuario desactivado.
   * Un usuario desactivado no puede iniciar sesión ni acceder al sistema.
   * 
   * @returns Nueva instancia con el usuario desactivado
   */
  deactivate(): User {
    // Si ya está desactivado, no hacer nada
    if (!this.isActive) {
      return this;
    }
    
    // Crear nueva instancia con usuario desactivado
    return new User({
      ...this.toObject(),
      isActive: false,
      updatedAt: new Date()
    });
  }

  /**
   * Activa la cuenta de usuario
   * 
   * Crea una nueva instancia con el usuario activado.
   * Permite rehabilitar el acceso de un usuario previamente desactivado.
   * 
   * @returns Nueva instancia con el usuario activado
   */
  activate(): User {
    // Si ya está activado, no hacer nada
    if (this.isActive) {
      return this;
    }
    
    // Crear nueva instancia con usuario activado
    return new User({
      ...this.toObject(),
      isActive: true,
      updatedAt: new Date()
    });
  }

  /**
   * Cambia la contraseña del usuario
   * 
   * Crea una nueva instancia con la contraseña actualizada.
   * En la capa de aplicación, la contraseña debería ser encriptada
   * antes de llamar a este método.
   * 
   * @param newPassword Nueva contraseña (debe estar encriptada)
   * @returns Nueva instancia con la contraseña actualizada
   * @throws {UserUpdateException} Si la contraseña no cumple con los requisitos
   */
  changePassword(newPassword: string): User {
    // Validar que la nueva contraseña no esté vacía
    if (!newPassword || newPassword.length < 6) {
      throw new UserUpdateException('La nueva contraseña debe tener al menos 6 caracteres');
    }
    
    // Si la contraseña es la misma, no hacer nada
    if (this._password === newPassword) {
      return this;
    }
    
    // Crear nueva instancia con la contraseña actualizada
    return new User({
      ...this.toObject(),
      password: newPassword,
      updatedAt: new Date()
    });
  }

  /**
   * Verifica si el usuario tiene un rol específico
   * 
   * @param roleToCheck Rol a verificar (puede ser enum, string o Role)
   * @returns true si el usuario tiene el rol especificado
   */
  hasRole(roleToCheck: RoleEnum | string | Role): boolean {
    if (roleToCheck instanceof Role) {
      return this.role.equals(roleToCheck);
    }
    
    // Convertir a string para comparar
    const roleValue = typeof roleToCheck === 'string' ? roleToCheck : roleToCheck;
    return this.role.value() === roleValue;
  }

  /**
   * Verifica si el usuario es administrador
   * 
   * @returns true si el usuario tiene rol de administrador
   */
  isAdmin(): boolean {
    return this.role.isAdmin();
  }
  
  /**
   * Convierte la entidad a un objeto plano
   * 
   * @returns Objeto con todas las propiedades del usuario
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
 * Propiedades completas de un usuario
 * 
 * Define todos los atributos necesarios para representar completamente
 * un usuario en el sistema.
 */
export interface UserProps {
  /** Identificador único del usuario */
  id: string;
  
  /** Nombre completo del usuario */
  name: string;
  
  /** Dirección de correo electrónico (value object) */
  email: Email;
  
  /** Contraseña encriptada */
  password: string;
  
  /** Rol del usuario en el sistema (value object) */
  role: Role;
  
  /** Indica si el usuario está activo */
  isActive: boolean;
  
  /** Fecha de creación */
  createdAt: Date;
  
  /** Fecha de última actualización */
  updatedAt: Date;
}

/**
 * Propiedades para crear un nuevo usuario
 * 
 * Contiene los campos necesarios para la creación inicial de un usuario.
 * Algunos campos son opcionales y tendrán valores por defecto si no se proporcionan.
 */
export interface UserCreateProps {
  /** Identificador único opcional (se genera automáticamente si no se proporciona) */
  id?: string;
  
  /** Nombre completo del usuario (requerido) */
  name: string;
  
  /** Email del usuario (puede ser string o Email value object) */
  email: string | Email;
  
  /** Contraseña del usuario (requerida, debe tener al menos 6 caracteres) */
  password: string;
  
  /** Rol del usuario (opcional, por defecto será USER) */
  role?: RoleEnum | string | Role;
  
  /** Estado inicial del usuario (opcional, por defecto true) */
  isActive?: boolean;
  
  /** Fecha de creación (opcional, por defecto es la fecha actual) */
  createdAt?: Date;
  
  /** Fecha de actualización (opcional, por defecto es la fecha actual) */
  updatedAt?: Date;
}

/**
 * Propiedades para actualizar un usuario existente
 * 
 * Define los campos que pueden ser modificados después de la creación inicial.
 * Todos los campos son opcionales, permitiendo actualizaciones parciales.
 */
export interface UserUpdateProps {
  /** Nuevo nombre (opcional) */
  name?: string;
  
  /** Nuevo email (opcional) */
  email?: string | Email;
  
  /** Nueva contraseña (opcional, debe tener al menos 6 caracteres) */
  password?: string;
  
  /** Nuevo rol (opcional) */
  role?: RoleEnum | string | Role;
} 