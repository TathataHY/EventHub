import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { Category } from 'eventhub-application';
import { CategoryRepository as CategoryRepositoryInterface } from 'eventhub-application';

@Injectable()
export class CategoryRepository implements CategoryRepositoryInterface {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async findById(id: string): Promise<Category | null> {
    const categoryEntity = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent', 'children']
    });

    if (!categoryEntity) {
      return null;
    }

    return this.mapToDomain(categoryEntity);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const categoryEntity = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['parent', 'children']
    });

    if (!categoryEntity) {
      return null;
    }

    return this.mapToDomain(categoryEntity);
  }

  async findAll(): Promise<Category[]> {
    const categoryEntities = await this.categoryRepository.find({
      relations: ['parent', 'children']
    });

    return categoryEntities.map(entity => this.mapToDomain(entity));
  }

  async findChildren(parentId: string): Promise<Category[]> {
    const childrenEntities = await this.categoryRepository.find({
      where: { parentId },
      relations: ['parent']
    });

    return childrenEntities.map(entity => this.mapToDomain(entity));
  }

  async findByIds(ids: string[]): Promise<Category[]> {
    const categoryEntities = await this.categoryRepository.findByIds(ids, {
      relations: ['parent', 'children']
    });

    return categoryEntities.map(entity => this.mapToDomain(entity));
  }

  async save(category: Category): Promise<Category> {
    const categoryEntity = this.mapToEntity(category);
    const savedEntity = await this.categoryRepository.save(categoryEntity);
    
    // Recargar la entidad con relaciones
    const refreshedEntity = await this.categoryRepository.findOne({
      where: { id: savedEntity.id },
      relations: ['parent', 'children']
    });

    if (!refreshedEntity) {
      throw new Error(`Categoría con ID ${savedEntity.id} no encontrada después de guardar`);
    }

    return this.mapToDomain(refreshedEntity);
  }

  async update(category: Category): Promise<Category> {
    const categoryEntity = this.mapToEntity(category);
    await this.categoryRepository.update({ id: category.id }, categoryEntity);
    
    // Recargar la entidad actualizada con relaciones
    const updatedEntity = await this.categoryRepository.findOne({
      where: { id: category.id },
      relations: ['parent', 'children']
    });

    if (!updatedEntity) {
      throw new Error(`Categoría con ID ${category.id} no encontrada después de actualizar`);
    }

    return this.mapToDomain(updatedEntity);
  }

  async delete(id: string): Promise<boolean> {
    // Comprobar si hay categorías que dependen de esta
    const hasChildren = await this.categoryRepository.count({
      where: { parentId: id }
    });

    if (hasChildren > 0) {
      throw new Error('No se puede eliminar una categoría que tiene subcategorías');
    }

    // Eliminar la categoría
    const result = await this.categoryRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  private mapToDomain(entity: CategoryEntity): Category {
    const category = new Category();
    category.id = entity.id;
    category.name = entity.name;
    category.description = entity.description;
    category.slug = entity.slug;
    category.color = entity.color;
    category.icon = entity.icon;
    category.parentId = entity.parentId;
    category.createdAt = entity.createdAt;
    category.updatedAt = entity.updatedAt;
    
    // Manejar relaciones
    if (entity.parent) {
      category.parent = this.mapToDomain(entity.parent);
    }
    
    if (entity.children) {
      category.children = entity.children.map(child => this.mapToDomain(child));
    }
    
    return category;
  }

  private mapToEntity(domain: Category): CategoryEntity {
    const entity = new CategoryEntity();
    
    if (domain.id) {
      entity.id = domain.id;
    }
    
    entity.name = domain.name;
    entity.description = domain.description;
    entity.slug = domain.slug;
    entity.color = domain.color;
    entity.icon = domain.icon;
    entity.parentId = domain.parentId;
    
    return entity;
  }
} 