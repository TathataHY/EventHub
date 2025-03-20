import { ValueObject } from '../../../core/interfaces/ValueObject';

/**
 * Value Object para representar las etiquetas (tags) de un evento
 * Implementa la interfaz ValueObject para mantener consistencia
 */
export class EventTags implements ValueObject<string[]> {
  private readonly _tags: string[];
  private static readonly MAX_TAGS = 10;
  private static readonly MAX_TAG_LENGTH = 30;

  /**
   * Constructor de EventTags
   * @param tags Lista de etiquetas
   * @throws Error si alguna etiqueta no cumple con las reglas de validación
   */
  constructor(tags: string[] = []) {
    this.validate(tags);
    // Normalizar y ordenar tags (minúsculas, sin espacios extras, sin duplicados)
    this._tags = [...new Set(
      tags.map(tag => tag.trim().toLowerCase())
          .filter(tag => tag.length > 0)
    )].sort();
  }

  /**
   * Obtiene el valor de las etiquetas
   * @returns Array de etiquetas
   */
  value(): string[] {
    return [...this._tags]; // Retornar copia para evitar modificación externa
  }

  /**
   * Compara si dos conjuntos de etiquetas son iguales
   * @param vo Etiquetas a comparar
   * @returns true si las etiquetas son iguales (mismo contenido, no importa el orden)
   */
  equals(vo: ValueObject<string[]>): boolean {
    const otherTags = vo.value();
    if (this._tags.length !== otherTags.length) {
      return false;
    }
    
    // Comparar después de ordenar y normalizar
    const normalizedOther = [...new Set(
      otherTags.map(tag => tag.trim().toLowerCase())
    )].sort();
    
    const normalizedThis = [...this._tags].sort();
    
    return normalizedThis.every((tag, index) => tag === normalizedOther[index]);
  }

  /**
   * Representación en string de las etiquetas
   * @returns String con las etiquetas separadas por comas
   */
  toString(): string {
    return this._tags.join(', ');
  }

  /**
   * Obtiene el número de etiquetas
   */
  get count(): number {
    return this._tags.length;
  }

  /**
   * Verifica si contiene una etiqueta específica
   * @param tag Etiqueta a buscar
   * @returns true si la etiqueta está presente
   */
  has(tag: string): boolean {
    const normalizedTag = tag.trim().toLowerCase();
    return this._tags.includes(normalizedTag);
  }

  /**
   * Crea una nueva instancia con etiquetas adicionales
   * @param tags Etiquetas a añadir
   * @returns Nueva instancia de EventTags con las etiquetas adicionales
   */
  add(tags: string[]): EventTags {
    const newTags = [...this._tags, ...tags.map(tag => tag.trim().toLowerCase())];
    return new EventTags(newTags);
  }

  /**
   * Crea una nueva instancia sin las etiquetas especificadas
   * @param tags Etiquetas a eliminar
   * @returns Nueva instancia de EventTags sin las etiquetas especificadas
   */
  remove(tags: string[]): EventTags {
    const tagsToRemove = tags.map(tag => tag.trim().toLowerCase());
    const newTags = this._tags.filter(tag => !tagsToRemove.includes(tag));
    return new EventTags(newTags);
  }

  /**
   * Valida las etiquetas
   * @param tags Etiquetas a validar
   * @throws Error si las etiquetas no son válidas
   */
  private validate(tags: string[]): void {
    // Validar cantidad máxima de etiquetas
    if (tags.length > EventTags.MAX_TAGS) {
      throw new Error(`No se pueden añadir más de ${EventTags.MAX_TAGS} etiquetas`);
    }

    // Validar formato de cada etiqueta
    for (const tag of tags) {
      const trimmedTag = tag.trim();
      
      if (trimmedTag.length === 0) {
        throw new Error('Las etiquetas no pueden estar vacías');
      }
      
      if (trimmedTag.length > EventTags.MAX_TAG_LENGTH) {
        throw new Error(`Las etiquetas no pueden tener más de ${EventTags.MAX_TAG_LENGTH} caracteres`);
      }
      
      // Solo permitir caracteres alfanuméricos, guiones y espacios
      if (!/^[a-zA-Z0-9\u00C0-\u00FF\s-]+$/.test(trimmedTag)) {
        throw new Error(`La etiqueta "${trimmedTag}" contiene caracteres no permitidos`);
      }
    }
  }

  /**
   * Crea una instancia de EventTags a partir de un string separado por comas
   * @param tagsString String con etiquetas separadas por comas
   * @returns Nueva instancia de EventTags
   */
  static fromString(tagsString: string): EventTags {
    if (!tagsString || tagsString.trim().length === 0) {
      return new EventTags([]);
    }
    
    const tags = tagsString.split(',').map(tag => tag.trim());
    return new EventTags(tags);
  }

  /**
   * Crea una instancia vacía de EventTags
   * @returns Nueva instancia de EventTags sin etiquetas
   */
  static empty(): EventTags {
    return new EventTags([]);
  }
} 