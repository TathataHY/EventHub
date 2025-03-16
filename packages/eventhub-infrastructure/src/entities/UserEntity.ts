/**
 * Entidad ORM para usuarios
 * Representa la estructura de la tabla de usuarios en la base de datos
 */
export class UserEntity {
  id: string;
  email: string;
  password: string;
  name: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;

  constructor(params: {
    id: string;
    email: string;
    password: string;
    name: string;
    roles: string[];
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = params.id;
    this.email = params.email;
    this.password = params.password;
    this.name = params.name;
    this.roles = params.roles;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
  }
} 