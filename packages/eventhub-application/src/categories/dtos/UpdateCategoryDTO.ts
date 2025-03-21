/**
 * DTO para actualizar una categoría existente
 */
export interface UpdateCategoryDTO {
  /** Nombre de la categoría */
  name?: string;
  
  /** Slug para SEO de la categoría */
  slug?: string;
  
  /** Descripción opcional de la categoría */
  description?: string;
  
  /** ID de categoría padre (opcional) */
  parentId?: string | null;
  
  /** URL del ícono de la categoría (opcional) */
  iconUrl?: string;
  
  /** Indica si la categoría está activa */
  isActive?: boolean;
}