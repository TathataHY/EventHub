/**
 * Adaptador para convertir entre tipos de Category de la capa de dominio y la capa de aplicación.
 * Esta clase actúa como una capa de compatibilidad para evitar errores de tipo.
 */
export class CategoryAdapter {
  /**
   * Adapta una entidad Category del dominio para ser usada por la capa de aplicación
   * @param domainCategory Entidad Category del dominio
   */
  static toApplication(domainCategory: any): any {
    if (!domainCategory) return null;
    
    return {
      id: domainCategory.id || domainCategory._id,
      name: domainCategory.name || '',
      slug: domainCategory.slug || '',
      description: domainCategory.description || '',
      parentId: domainCategory.parentId || null,
      iconUrl: domainCategory.iconUrl || '',
      isActive: domainCategory.isActive || true,
      createdAt: domainCategory.createdAt || new Date(),
      updatedAt: domainCategory.updatedAt || new Date(),
      
      // Métodos necesarios para compatibilidad
      toObject: function() {
        return {
          id: this.id,
          name: this.name,
          slug: this.slug,
          description: this.description,
          parentId: this.parentId,
          iconUrl: this.iconUrl,
          isActive: this.isActive,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt
        };
      }
    };
  }

  /**
   * Adapta una categoría de aplicación al formato esperado por el dominio
   * @param appCategory Objeto Category de la capa de aplicación
   */
  static toDomain(appCategory: any): any {
    if (!appCategory) return null;
    
    return {
      id: appCategory.id,
      name: appCategory.name,
      slug: appCategory.slug,
      description: appCategory.description,
      parentId: appCategory.parentId,
      iconUrl: appCategory.iconUrl,
      isActive: appCategory.isActive,
      createdAt: appCategory.createdAt,
      updatedAt: appCategory.updatedAt
    };
  }
} 