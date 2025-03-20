import { EventTags } from '../../../src/events';

describe('EventTags Value Object', () => {
  describe('constructor', () => {
    it('debe crear un EventTags válido con un array de etiquetas', () => {
      const tags = new EventTags(['música', 'concierto', 'rock']);
      
      expect(tags).toBeDefined();
      expect(tags.value()).toEqual(['concierto', 'música', 'rock']); // Ordenados alfabéticamente
      expect(tags.count).toBe(3);
    });

    it('debe normalizar y eliminar duplicados', () => {
      const tags = new EventTags(['  Rock  ', 'rock', ' MÚSICA ', 'Concierto']);
      
      expect(tags.value()).toEqual(['concierto', 'música', 'rock']);
      expect(tags.count).toBe(3);
    });

    it('debe crear un EventTags vacío por defecto', () => {
      const tags = new EventTags();
      
      expect(tags.value()).toEqual([]);
      expect(tags.count).toBe(0);
    });

    it('debe lanzar error si se excede el número máximo de etiquetas', () => {
      const manyTags = Array(11).fill(0).map((_, i) => `tag${i}`);
      
      expect(() => {
        new EventTags(manyTags);
      }).toThrow('No se pueden añadir más de 10 etiquetas');
    });

    it('debe lanzar error si alguna etiqueta excede la longitud máxima', () => {
      const longTag = 'a'.repeat(31);
      
      expect(() => {
        new EventTags(['tag1', longTag]);
      }).toThrow('Las etiquetas no pueden tener más de 30 caracteres');
    });

    it('debe lanzar error si alguna etiqueta contiene caracteres no permitidos', () => {
      expect(() => {
        new EventTags(['tag1', 'tag$%&']);
      }).toThrow('contiene caracteres no permitidos');
    });
  });

  describe('value', () => {
    it('debe devolver una copia de las etiquetas', () => {
      const tags = new EventTags(['música', 'concierto']);
      const value = tags.value();
      
      // Modificar el array obtenido no debe afectar al original
      value.push('otra');
      
      expect(tags.value()).toEqual(['concierto', 'música']);
      expect(tags.count).toBe(2);
    });
  });

  describe('equals', () => {
    it('debe considerar iguales dos objetos con las mismas etiquetas', () => {
      const tags1 = new EventTags(['música', 'concierto']);
      const tags2 = new EventTags(['concierto', 'música']); // Distinto orden
      
      expect(tags1.equals(tags2)).toBe(true);
    });

    it('debe considerar diferentes dos objetos con etiquetas diferentes', () => {
      const tags1 = new EventTags(['música', 'concierto']);
      const tags2 = new EventTags(['música', 'festival']);
      
      expect(tags1.equals(tags2)).toBe(false);
    });

    it('debe considerar diferentes si tienen distinta cantidad de etiquetas', () => {
      const tags1 = new EventTags(['música', 'concierto']);
      const tags2 = new EventTags(['música', 'concierto', 'rock']);
      
      expect(tags1.equals(tags2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('debe convertir correctamente a string', () => {
      const tags = new EventTags(['música', 'concierto', 'rock']);
      
      expect(tags.toString()).toBe('concierto, música, rock');
    });

    it('debe devolver cadena vacía para EventTags sin etiquetas', () => {
      const tags = new EventTags([]);
      
      expect(tags.toString()).toBe('');
    });
  });

  describe('has', () => {
    it('debe verificar correctamente si contiene una etiqueta', () => {
      const tags = new EventTags(['música', 'concierto', 'rock']);
      
      expect(tags.has('música')).toBe(true);
      expect(tags.has('MÚSICA')).toBe(true); // Case insensitive
      expect(tags.has('  rock  ')).toBe(true); // Normaliza espacios
      expect(tags.has('pop')).toBe(false);
    });
  });

  describe('add', () => {
    it('debe añadir nuevas etiquetas manteniendo inmutabilidad', () => {
      const tags = new EventTags(['música', 'concierto']);
      const newTags = tags.add(['rock', 'pop']);
      
      // El original no debe modificarse
      expect(tags.value()).toEqual(['concierto', 'música']);
      
      // La nueva instancia debe tener todas las etiquetas
      expect(newTags.value()).toEqual(['concierto', 'música', 'pop', 'rock']);
      expect(newTags.count).toBe(4);
    });

    it('debe normalizar y eliminar duplicados al añadir', () => {
      const tags = new EventTags(['música', 'concierto']);
      const newTags = tags.add(['MÚSICA', 'rock']);
      
      expect(newTags.value()).toEqual(['concierto', 'música', 'rock']);
      expect(newTags.count).toBe(3);
    });
  });

  describe('remove', () => {
    it('debe eliminar etiquetas manteniendo inmutabilidad', () => {
      const tags = new EventTags(['música', 'concierto', 'rock', 'pop']);
      const newTags = tags.remove(['concierto', 'pop']);
      
      // El original no debe modificarse
      expect(tags.value()).toEqual(['concierto', 'música', 'pop', 'rock']);
      
      // La nueva instancia debe tener solo las etiquetas no eliminadas
      expect(newTags.value()).toEqual(['música', 'rock']);
      expect(newTags.count).toBe(2);
    });

    it('debe ignorar etiquetas que no existen', () => {
      const tags = new EventTags(['música', 'concierto']);
      const newTags = tags.remove(['clasica', 'jazz']);
      
      expect(newTags.value()).toEqual(['concierto', 'música']);
      expect(newTags.count).toBe(2);
    });
  });

  describe('métodos estáticos', () => {
    it('fromString debe crear correctamente desde un string', () => {
      const tags = EventTags.fromString('música, concierto, rock');
      
      expect(tags.value()).toEqual(['concierto', 'música', 'rock']);
      expect(tags.count).toBe(3);
    });

    it('fromString debe manejar strings vacíos', () => {
      const tags1 = EventTags.fromString('');
      const tags2 = EventTags.fromString('   ');
      
      expect(tags1.value()).toEqual([]);
      expect(tags2.value()).toEqual([]);
    });

    it('empty debe crear un EventTags sin etiquetas', () => {
      const tags = EventTags.empty();
      
      expect(tags.value()).toEqual([]);
      expect(tags.count).toBe(0);
    });
  });
}); 