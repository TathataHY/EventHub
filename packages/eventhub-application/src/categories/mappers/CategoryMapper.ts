import { Category } from '@eventhub/domain/dist/categories/entities/Category';
import { CategoryDTO } from '../dtos/CategoryDTO';

/**
 * Clase para mapear entre entidades de dominio Category y DTOs de aplicación
 */
export class CategoryMapper {
  /**
   * Convierte una entidad Category de dominio a un DTO de aplicación
   * @param domain Entidad de dominio
   * @returns DTO de aplicación
   */
  static toDTO(domain: Category): CategoryDTO {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      parentId: domain.parentId,
      createdAt: domain.createdAt,
      updatedAt: domain.updatedAt
    };
  }

  /**
   * Convierte una lista de entidades Category a una lista de DTOs
   * @param domains Lista de entidades
   * @returns Lista de DTOs
   */
  static toDTOList(domains: Category[]): CategoryDTO[] {
    return domains.map(domain => this.toDTO(domain));
  }

  /**
   * Convierte un DTO a una entidad de dominio parcial (para actualizaciones)
   * @param dto DTO parcial con propiedades a actualizar
   * @returns Objeto con propiedades actualizables
   */
  static toPartialDomain(dto: Partial<CategoryDTO>): Partial<Category> {
    const partialCategory: Partial<Category> = {};

    if (dto.name !== undefined) partialCategory.name = dto.name;
    if (dto.description !== undefined) partialCategory.description = dto.description;
    if (dto.parentId !== undefined) partialCategory.parentId = dto.parentId;

    return partialCategory;
  }
} 