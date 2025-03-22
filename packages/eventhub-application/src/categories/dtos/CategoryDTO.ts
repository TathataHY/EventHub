/**
 * DTO para representar una categoría
 */
export interface CategoryDTO {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * DTO para crear una nueva categoría
 */
export interface CreateCategoryDTO {
  name: string;
  description?: string;
  parentId?: string;
}

/**
 * DTO para actualizar una categoría existente
 */
export interface UpdateCategoryDTO {
  name?: string;
  description?: string;
  parentId?: string;
} 