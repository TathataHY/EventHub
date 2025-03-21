/**
 * Adaptador para convertir entre tipos de User de la capa de dominio y la capa de aplicación.
 * Esta clase actúa como una capa de compatibilidad para evitar errores de tipo.
 */
export class UserAdapter {
  /**
   * Adapta una entidad User del dominio para ser usada por la capa de aplicación
   * @param domainUser Entidad User del dominio
   */
  static toApplication(domainUser: any): any {
    if (!domainUser) return null;
    
    return {
      id: domainUser.id || domainUser._id,
      email: domainUser.email || '',
      name: domainUser.name || '',
      role: domainUser.role || 'USER',
      isActive: domainUser.isActive || true,
      createdAt: domainUser.createdAt || new Date(),
      updatedAt: domainUser.updatedAt || new Date()
    };
  }

  /**
   * Adapta un usuario de aplicación al formato esperado por el dominio
   * @param appUser Objeto User de la capa de aplicación
   */
  static toDomain(appUser: any): any {
    if (!appUser) return null;
    
    return {
      id: appUser.id,
      email: appUser.email,
      name: appUser.name,
      role: appUser.role,
      isActive: appUser.isActive,
      createdAt: appUser.createdAt,
      updatedAt: appUser.updatedAt
    };
  }
} 