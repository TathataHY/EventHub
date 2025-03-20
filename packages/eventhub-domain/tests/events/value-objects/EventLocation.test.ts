import { EventLocation } from '../../../src/events';

describe('EventLocation Value Object', () => {
  describe('constructor', () => {
    it('debe crear un EventLocation válido con datos completos', () => {
      const location = new EventLocation({
        address: 'Calle Principal 123',
        city: 'Madrid',
        state: 'Madrid',
        postalCode: '28001',
        country: 'España',
        virtualEvent: false,
        latitude: 40.4167,
        longitude: -3.7033
      });
      
      expect(location).toBeDefined();
      expect(location.isVirtual).toBe(false);
      expect(location.address).toBe('Calle Principal 123');
      expect(location.city).toBe('Madrid');
      expect(location.state).toBe('Madrid');
      expect(location.postalCode).toBe('28001');
      expect(location.country).toBe('España');
      expect(location.latitude).toBe(40.4167);
      expect(location.longitude).toBe(-3.7033);
    });

    it('debe crear un EventLocation válido para evento virtual', () => {
      const location = new EventLocation({
        address: 'N/A',
        city: 'Online',
        country: 'Global',
        virtualEvent: true,
        virtualUrl: 'https://meet.google.com/abc-defg-hij'
      });
      
      expect(location).toBeDefined();
      expect(location.isVirtual).toBe(true);
      expect(location.virtualUrl).toBe('https://meet.google.com/abc-defg-hij');
      expect(location.address).toBe('N/A');
    });

    it('debe crear un EventLocation con campos opcionales nulos', () => {
      const location = new EventLocation({
        address: 'Calle Principal 123',
        city: 'Madrid',
        country: 'España'
      });
      
      expect(location).toBeDefined();
      expect(location.state).toBeNull();
      expect(location.postalCode).toBeNull();
      expect(location.isVirtual).toBe(false);
      expect(location.virtualUrl).toBeNull();
      expect(location.latitude).toBeNull();
      expect(location.longitude).toBeNull();
    });

    it('debe lanzar error si falta la dirección', () => {
      expect(() => {
        new EventLocation({
          address: '',
          city: 'Madrid',
          country: 'España'
        });
      }).toThrow('La dirección es requerida para eventos presenciales');
    });

    it('debe lanzar error si falta la ciudad', () => {
      expect(() => {
        new EventLocation({
          address: 'Calle Principal 123',
          city: '',
          country: 'España'
        });
      }).toThrow('La ciudad es requerida para eventos presenciales');
    });

    it('debe lanzar error si falta el país', () => {
      expect(() => {
        new EventLocation({
          address: 'Calle Principal 123',
          city: 'Madrid',
          country: ''
        });
      }).toThrow('El país es requerido para eventos presenciales');
    });

    it('debe lanzar error si la URL virtual no es válida', () => {
      expect(() => {
        new EventLocation({
          address: 'Calle Principal 123',
          city: 'Madrid',
          country: 'España',
          virtualEvent: true,
          virtualUrl: 'invalid-url'
        });
      }).toThrow('La URL del evento virtual no es válida');
    });
  });

  describe('equals', () => {
    it('debe considerar iguales dos objetos con la misma información', () => {
      const location1 = new EventLocation({
        address: 'Calle Principal 123',
        city: 'Madrid',
        postalCode: '28001',
        country: 'España',
        latitude: 40.4167,
        longitude: -3.7033
      });
      
      const location2 = new EventLocation({
        address: 'Calle Principal 123',
        city: 'Madrid',
        postalCode: '28001',
        country: 'España',
        latitude: 40.4167,
        longitude: -3.7033
      });
      
      expect(location1.equals(location2)).toBe(true);
    });

    it('debe considerar iguales dos objetos virtuales con la misma información', () => {
      const location1 = new EventLocation({
        address: 'N/A',
        city: 'Online',
        country: 'Global',
        virtualEvent: true,
        virtualUrl: 'https://meet.google.com/abc-defg-hij'
      });
      
      const location2 = new EventLocation({
        address: 'N/A',
        city: 'Online',
        country: 'Global',
        virtualEvent: true,
        virtualUrl: 'https://meet.google.com/abc-defg-hij'
      });
      
      expect(location1.equals(location2)).toBe(true);
    });

    it('debe considerar diferentes dos objetos con tipo diferente', () => {
      const location1 = new EventLocation({
        address: 'N/A',
        city: 'Online',
        country: 'Global',
        virtualEvent: true,
        virtualUrl: 'https://meet.google.com/abc-defg-hij'
      });
      
      const location2 = new EventLocation({
        address: 'Calle Principal 123',
        city: 'Madrid',
        postalCode: '28001',
        country: 'España'
      });
      
      expect(location1.equals(location2)).toBe(false);
    });

    it('debe considerar diferentes dos objetos con información diferente', () => {
      const location1 = new EventLocation({
        address: 'Calle Principal 123',
        city: 'Madrid',
        postalCode: '28001',
        country: 'España'
      });
      
      const location2 = new EventLocation({
        address: 'Calle Secundaria 456',
        city: 'Barcelona',
        postalCode: '08001',
        country: 'España'
      });
      
      expect(location1.equals(location2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('debe devolver la dirección formateada correctamente', () => {
      const location = new EventLocation({
        address: 'Calle Principal 123',
        city: 'Madrid',
        postalCode: '28001',
        country: 'España'
      });
      
      expect(location.toString()).toContain('Calle Principal 123');
      expect(location.toString()).toContain('Madrid');
      expect(location.toString()).toContain('28001');
      expect(location.toString()).toContain('España');
    });

    it('debe manejar campos opcionales en la dirección', () => {
      const location = new EventLocation({
        address: 'Calle Principal 123',
        city: 'Madrid',
        country: 'España'
      });
      
      expect(location.toString()).toContain('Calle Principal 123');
      expect(location.toString()).toContain('Madrid');
      expect(location.toString()).toContain('España');
      expect(location.toString()).not.toContain('null');
    });

    it('debe mostrar la URL para eventos virtuales', () => {
      const location = new EventLocation({
        address: 'N/A',
        city: 'Online',
        country: 'Global',
        virtualEvent: true,
        virtualUrl: 'https://meet.google.com/abc-defg-hij'
      });
      
      expect(location.toString()).toContain('https://meet.google.com/abc-defg-hij');
    });
  });

  describe('métodos estáticos', () => {
    it('virtual debe crear correctamente un evento virtual', () => {
      const location = EventLocation.virtual('https://meet.google.com/abc-defg-hij');
      
      expect(location.isVirtual).toBe(true);
      expect(location.virtualUrl).toBe('https://meet.google.com/abc-defg-hij');
    });

    it('withCoordinates debe crear correctamente un evento con coordenadas', () => {
      const location = EventLocation.withCoordinates(
        {
          address: 'Calle Principal 123',
          city: 'Madrid',
          country: 'España'
        },
        40.4167,
        -3.7033
      );
      
      expect(location.latitude).toBe(40.4167);
      expect(location.longitude).toBe(-3.7033);
      expect(location.address).toBe('Calle Principal 123');
    });
  });
}); 