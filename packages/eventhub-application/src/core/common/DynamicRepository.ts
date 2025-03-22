/**
 * Interfaz de repositorio flexible que extiende las funcionalidades básicas
 * para permitir más libertad en los tipos durante la compilación
 */
export interface DynamicRepository<T> {
  findById(id: any): Promise<T | null>;
  findAll(filters?: any, pagination?: any): Promise<T[]>;
  save(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(id: any): Promise<boolean>;
} 