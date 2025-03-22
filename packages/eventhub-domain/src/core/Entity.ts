/**
 * Clase base para entidades de dominio
 */
export abstract class Entity {
  id?: string;

  constructor() {
    this.id = undefined;
  }

  equals(entity: Entity): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    return this.id === entity.id;
  }
} 