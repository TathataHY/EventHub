/**
 * Adaptador para convertir entre tipos de Event de la capa de dominio y la capa de aplicación.
 * Esta clase actúa como una capa de compatibilidad para evitar errores de tipo.
 */
export class EventAdapter {
  /**
   * Adapta una entidad Event del dominio para ser usada por la capa de aplicación
   * @param domainEvent Entidad Event del dominio
   */
  static toApplication(domainEvent: any): any {
    if (!domainEvent) return null;
    
    return {
      id: domainEvent.id || domainEvent._id,
      organizerId: domainEvent.organizerId || '',
      title: domainEvent.title || '',
      description: domainEvent.description || '',
      startDate: domainEvent.startDate || new Date(),
      endDate: domainEvent.endDate || new Date(),
      location: domainEvent.location || {},
      capacity: domainEvent.capacity || 0,
      categoryIds: domainEvent.categoryIds || [],
      tags: domainEvent.tags || [],
      status: domainEvent.status || 'draft',
      isPublished: domainEvent.isPublished || false,
      price: domainEvent.price || 0,
      imageUrl: domainEvent.imageUrl || '',
      createdAt: domainEvent.createdAt || new Date(),
      updatedAt: domainEvent.updatedAt || new Date(),
      
      // Métodos necesarios para compatibilidad
      toObject: function() {
        return {
          id: this.id,
          organizerId: this.organizerId,
          title: this.title,
          description: this.description,
          startDate: this.startDate,
          endDate: this.endDate,
          location: this.location,
          capacity: this.capacity,
          categoryIds: this.categoryIds,
          tags: this.tags,
          status: this.status,
          isPublished: this.isPublished,
          price: this.price,
          imageUrl: this.imageUrl,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt
        };
      },
      
      publish: function() {
        const updated = {...this};
        updated.isPublished = true;
        updated.status = 'published';
        updated.updatedAt = new Date();
        return updated;
      }
    };
  }

  /**
   * Adapta un evento de aplicación al formato esperado por el dominio
   * @param appEvent Objeto Event de la capa de aplicación
   */
  static toDomain(appEvent: any): any {
    if (!appEvent) return null;
    
    return {
      id: appEvent.id,
      organizerId: appEvent.organizerId,
      title: appEvent.title,
      description: appEvent.description,
      startDate: appEvent.startDate,
      endDate: appEvent.endDate,
      location: appEvent.location,
      capacity: appEvent.capacity,
      categoryIds: appEvent.categoryIds,
      tags: appEvent.tags,
      status: appEvent.status,
      isPublished: appEvent.isPublished,
      price: appEvent.price,
      imageUrl: appEvent.imageUrl,
      createdAt: appEvent.createdAt,
      updatedAt: appEvent.updatedAt
    };
  }
} 