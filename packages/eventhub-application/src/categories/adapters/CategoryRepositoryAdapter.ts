import { CategoryRepository } from '@eventhub/domain/dist/categories/repositories/CategoryRepository';
import { CategoryAdapter } from './CategoryAdapter';

/**
 * Adaptador para el repositorio de categorías que resuelve incompatibilidades de tipos
 * entre la capa de dominio y aplicación
 */
export class CategoryRepositoryAdapter {
  constructor(private repository: CategoryRepository) {}

  async findById(id: string): Promise<any> {
    const category = await this.repository.findById(id);
    return CategoryAdapter.toApplication(category);
  }

  async findByName(name: string): Promise<any> {
    const category = await this.repository.findByName(name);
    return CategoryAdapter.toApplication(category);
  }

  async findBySlug(slug: string): Promise<any> {
    const category = await this.repository.findBySlug(slug);
    return CategoryAdapter.toApplication(category);
  }

  async findAll(): Promise<any[]> {
    const categories = await this.repository.findAll();
    return categories.map(category => CategoryAdapter.toApplication(category));
  }

  async findPopular(limit: number): Promise<any[]> {
    const categories = await this.repository.findPopular(limit);
    return categories.map(category => CategoryAdapter.toApplication(category));
  }

  async findChildren(parentId: string): Promise<any[]> {
    const categories = await this.repository.findChildren(parentId);
    return categories.map(category => CategoryAdapter.toApplication(category));
  }

  async getTree(): Promise<any[]> {
    const tree = await this.repository.getTree();
    return tree.map(category => CategoryAdapter.toApplication(category));
  }

  async save(category: any): Promise<void> {
    const domainCategory = CategoryAdapter.toDomain(category);
    await this.repository.save(domainCategory);
  }

  async delete(categoryId: string): Promise<void> {
    await this.repository.delete(categoryId);
  }
} 