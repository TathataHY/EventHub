/**
 * Adaptador para convertir entre tipos de Review de la capa de dominio y la capa de aplicación.
 * Esta clase actúa como una capa de compatibilidad para evitar errores de tipo.
 */
export class ReviewAdapter {
  /**
   * Adapta una entidad Review del dominio para ser usada por la capa de aplicación
   * @param domainReview Entidad Review del dominio
   */
  static toApplication(domainReview: any): any {
    if (!domainReview) return null;
    
    return {
      id: domainReview.id || domainReview._id,
      userId: domainReview.userId || '',
      eventId: domainReview.eventId || '',
      score: domainReview.score || 0,
      content: domainReview.content || '',
      isVerified: domainReview.isVerified || false,
      isActive: domainReview.isActive || true,
      createdAt: domainReview.createdAt || new Date(),
      updatedAt: domainReview.updatedAt || new Date(),
      
      // Métodos necesarios para compatibilidad
      toObject: function() {
        return {
          id: this.id,
          userId: this.userId,
          eventId: this.eventId,
          score: this.score,
          content: this.content,
          isVerified: this.isVerified,
          isActive: this.isActive,
          createdAt: this.createdAt,
          updatedAt: this.updatedAt
        };
      },
      
      verify: function() {
        const updated = {...this};
        updated.isVerified = true;
        updated.updatedAt = new Date();
        return updated;
      }
    };
  }

  /**
   * Adapta una revisión de aplicación al formato esperado por el dominio
   * @param appReview Objeto Review de la capa de aplicación
   */
  static toDomain(appReview: any): any {
    if (!appReview) return null;
    
    return {
      id: appReview.id,
      userId: appReview.userId,
      eventId: appReview.eventId,
      score: appReview.score,
      content: appReview.content,
      isVerified: appReview.isVerified,
      isActive: appReview.isActive,
      createdAt: appReview.createdAt,
      updatedAt: appReview.updatedAt
    };
  }
} 