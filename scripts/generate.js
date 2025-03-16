#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuración
const BASE_PATH = path.resolve(__dirname, '..');
const DOMAIN_PATH = path.resolve(BASE_PATH, 'packages/eventhub-domain/src');
const APPLICATION_PATH = path.resolve(BASE_PATH, 'packages/eventhub-application/src');
const INFRASTRUCTURE_PATH = path.resolve(BASE_PATH, 'packages/eventhub-infrastructure/src');
const API_PATH = path.resolve(BASE_PATH, 'packages/eventhub-api/src');

// Plantillas
const ENTITY_TEMPLATE = `export class {{EntityName}} {
  private _id: string;
  private _createdAt: Date;
  private _updatedAt: Date;

  constructor(params: {{EntityName}}Params) {
    this._id = params.id;
    this._createdAt = params.createdAt || new Date();
    this._updatedAt = params.updatedAt || new Date();
    
    this.validate();
  }

  private validate(): void {
    // Implementar validaciones
  }

  // Getters
  get id(): string {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Métodos de dominio
}

export interface {{EntityName}}Params {
  id: string;
  createdAt?: Date;
  updatedAt?: Date;
}
`;

const REPOSITORY_INTERFACE_TEMPLATE = `import { {{EntityName}} } from '../entities/{{EntityName}}';

export interface {{EntityName}}Repository {
  findById(id: string): Promise<{{EntityName}} | null>;
  findAll(): Promise<{{EntityName}}[]>;
  save(entity: {{EntityName}}): Promise<{{EntityName}}>;
  update(entity: {{EntityName}}): Promise<{{EntityName}}>;
  delete(id: string): Promise<void>;
}
`;

const USE_CASE_TEMPLATE = `import { Injectable } from '@nestjs/common';
import { {{EntityName}} } from 'eventhub-domain/src/entities/{{EntityName}}';
import { {{EntityName}}Repository } from 'eventhub-domain/src/repositories/{{EntityName}}Repository';
import { Create{{EntityName}}Dto } from '../dtos/{{entityName}}/Create{{EntityName}}Dto';
import { {{EntityName}}Dto } from '../dtos/{{entityName}}/{{EntityName}}Dto';

@Injectable()
export class Create{{EntityName}}UseCase {
  constructor(private readonly {{entityName}}Repository: {{EntityName}}Repository) {}

  async execute(dto: Create{{EntityName}}Dto): Promise<{{EntityName}}Dto> {
    // Implementar lógica
    // Transformar DTO a entidad
    // Guardar entidad
    // Transformar entidad a DTO para respuesta
  }
}
`;

const DTO_TEMPLATE = `export interface {{EntityName}}Dto {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
`;

const CREATE_DTO_TEMPLATE = `export interface Create{{EntityName}}Dto {
  // Definir propiedades necesarias para crear la entidad
}
`;

const TYPEORM_ENTITY_TEMPLATE = `import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('{{entityName}}s')
export class {{EntityName}}Entity {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
`;

const TYPEORM_REPOSITORY_TEMPLATE = `import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { {{EntityName}} } from 'eventhub-domain/src/entities/{{EntityName}}';
import { {{EntityName}}Repository } from 'eventhub-domain/src/repositories/{{EntityName}}Repository';
import { {{EntityName}}Entity } from '../entities/{{EntityName}}Entity';

@Injectable()
export class TypeOrm{{EntityName}}Repository implements {{EntityName}}Repository {
  constructor(
    @InjectRepository({{EntityName}}Entity)
    private readonly repository: Repository<{{EntityName}}Entity>,
  ) {}

  async findById(id: string): Promise<{{EntityName}} | null> {
    const entity = await this.repository.findOne({ where: { id } });
    if (!entity) return null;
    return this.toDomain(entity);
  }

  async findAll(): Promise<{{EntityName}}[]> {
    const entities = await this.repository.find();
    return entities.map(entity => this.toDomain(entity));
  }

  async save(domain: {{EntityName}}): Promise<{{EntityName}}> {
    const entity = this.toEntity(domain);
    const savedEntity = await this.repository.save(entity);
    return this.toDomain(savedEntity);
  }

  async update(domain: {{EntityName}}): Promise<{{EntityName}}> {
    const entity = this.toEntity(domain);
    const updatedEntity = await this.repository.save(entity);
    return this.toDomain(updatedEntity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  private toDomain(entity: {{EntityName}}Entity): {{EntityName}} {
    return new {{EntityName}}({
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  }

  private toEntity(domain: {{EntityName}}): {{EntityName}}Entity {
    const entity = new {{EntityName}}Entity();
    entity.id = domain.id;
    return entity;
  }
}
`;

const CONTROLLER_TEMPLATE = `import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { Create{{EntityName}}UseCase } from 'eventhub-application/src/use-cases/{{entityName}}/Create{{EntityName}}UseCase';
import { Get{{EntityName}}UseCase } from 'eventhub-application/src/use-cases/{{entityName}}/Get{{EntityName}}UseCase';
import { Create{{EntityName}}Dto } from 'eventhub-application/src/dtos/{{entityName}}/Create{{EntityName}}Dto';
import { {{EntityName}}Dto } from 'eventhub-application/src/dtos/{{entityName}}/{{EntityName}}Dto';

@Controller('{{entityNamePlural}}')
export class {{EntityName}}Controller {
  constructor(
    private readonly create{{EntityName}}UseCase: Create{{EntityName}}UseCase,
    private readonly get{{EntityName}}UseCase: Get{{EntityName}}UseCase,
  ) {}

  @Post()
  async create(@Body() dto: Create{{EntityName}}Dto): Promise<{{EntityName}}Dto> {
    return this.create{{EntityName}}UseCase.execute(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<{{EntityName}}Dto> {
    return this.get{{EntityName}}UseCase.execute(id);
  }
}
`;

// Funciones auxiliares
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeFileIfNotExists(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Creado: ${filePath}`);
    return true;
  }
  console.log(`⚠️ Ya existe: ${filePath}`);
  return false;
}

function toCamelCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function toPlural(str) {
  // Reglas básicas de pluralización - se podría mejorar
  if (str.endsWith('y')) {
    return str.slice(0, -1) + 'ies';
  }
  return str + 's';
}

// Función principal para generar componentes
function generateComponents(entityName) {
  const EntityName = entityName; // PascalCase
  const entityNameCamelCase = toCamelCase(EntityName); // camelCase
  const entityNamePlural = toPlural(entityNameCamelCase); // Plural para rutas

  // Reemplazar los placeholders en las plantillas
  const replacePlaceholders = (template) => {
    return template
      .replace(/{{EntityName}}/g, EntityName)
      .replace(/{{entityName}}/g, entityNameCamelCase)
      .replace(/{{entityNamePlural}}/g, entityNamePlural);
  };

  // 1. Dominio
  // 1.1 Entidad
  const entityDir = path.join(DOMAIN_PATH, 'entities');
  ensureDirectoryExists(entityDir);
  writeFileIfNotExists(
    path.join(entityDir, `${EntityName}.ts`),
    replacePlaceholders(ENTITY_TEMPLATE)
  );

  // 1.2 Interfaz de Repositorio
  const repoInterfaceDir = path.join(DOMAIN_PATH, 'repositories');
  ensureDirectoryExists(repoInterfaceDir);
  writeFileIfNotExists(
    path.join(repoInterfaceDir, `${EntityName}Repository.ts`),
    replacePlaceholders(REPOSITORY_INTERFACE_TEMPLATE)
  );

  // 2. Aplicación
  // 2.1 DTOs
  const dtoDir = path.join(APPLICATION_PATH, 'dtos', entityNameCamelCase);
  ensureDirectoryExists(dtoDir);
  writeFileIfNotExists(
    path.join(dtoDir, `${EntityName}Dto.ts`),
    replacePlaceholders(DTO_TEMPLATE)
  );
  writeFileIfNotExists(
    path.join(dtoDir, `Create${EntityName}Dto.ts`),
    replacePlaceholders(CREATE_DTO_TEMPLATE)
  );

  // 2.2 Casos de Uso
  const useCaseDir = path.join(APPLICATION_PATH, 'use-cases', entityNameCamelCase);
  ensureDirectoryExists(useCaseDir);
  writeFileIfNotExists(
    path.join(useCaseDir, `Create${EntityName}UseCase.ts`),
    replacePlaceholders(USE_CASE_TEMPLATE)
  );

  // 3. Infraestructura
  // 3.1 Entidad TypeORM
  const typeOrmEntityDir = path.join(INFRASTRUCTURE_PATH, 'entities');
  ensureDirectoryExists(typeOrmEntityDir);
  writeFileIfNotExists(
    path.join(typeOrmEntityDir, `${EntityName}Entity.ts`),
    replacePlaceholders(TYPEORM_ENTITY_TEMPLATE)
  );

  // 3.2 Repositorio TypeORM
  const typeOrmRepoDir = path.join(INFRASTRUCTURE_PATH, 'repositories');
  ensureDirectoryExists(typeOrmRepoDir);
  writeFileIfNotExists(
    path.join(typeOrmRepoDir, `TypeOrm${EntityName}Repository.ts`),
    replacePlaceholders(TYPEORM_REPOSITORY_TEMPLATE)
  );

  // 4. API (Presentación)
  // 4.1 Controlador
  const controllerDir = path.join(API_PATH, 'controllers');
  ensureDirectoryExists(controllerDir);
  writeFileIfNotExists(
    path.join(controllerDir, `${EntityName}Controller.ts`),
    replacePlaceholders(CONTROLLER_TEMPLATE)
  );

  console.log(`\n🚀 Componentes generados para la entidad ${EntityName}`);
}

// Manejo de argumentos
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('❌ Error: Debe proporcionar un nombre de entidad');
  console.log('Uso: node generate.js NombreEntidad');
  process.exit(1);
}

const entityName = args[0];
generateComponents(entityName); 