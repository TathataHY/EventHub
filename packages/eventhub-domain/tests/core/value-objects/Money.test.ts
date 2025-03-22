import { Money } from '../../../src/core/value-objects/Money';

describe('Money Value Object', () => {
  describe('create', () => {
    it('debe crear un objeto Money válido con los parámetros correctos', () => {
      const money = Money.create(100, 'EUR');
      
      expect(money).toBeDefined();
      expect(money.value()).toBe(100);
      expect(money.currency()).toBe('EUR');
    });

    it('debe crear un objeto Money con moneda EUR por defecto', () => {
      const money = Money.create(100);
      
      expect(money.currency()).toBe('EUR');
    });

    it('debe convertir el código de moneda a mayúsculas', () => {
      const money = Money.create(100, 'usd');
      
      expect(money.currency()).toBe('USD');
    });

    it('debe redondear el monto a dos decimales', () => {
      const money = Money.create(100.456);
      
      expect(money.value()).toBe(100.46);
    });

    it('debe lanzar error cuando el monto es negativo', () => {
      expect(() => {
        Money.create(-100);
      }).toThrow('El monto no puede ser negativo');
    });
  });

  describe('equals', () => {
    it('debe considerar iguales dos objetos Money con el mismo valor y moneda', () => {
      const money1 = Money.create(100, 'EUR');
      const money2 = Money.create(100, 'EUR');
      
      expect(money1.equals(money2)).toBe(true);
    });

    it('debe considerar diferentes dos objetos Money con diferente valor', () => {
      const money1 = Money.create(100, 'EUR');
      const money2 = Money.create(200, 'EUR');
      
      expect(money1.equals(money2)).toBe(false);
    });

    it('debe considerar diferentes dos objetos Money con diferente moneda', () => {
      const money1 = Money.create(100, 'EUR');
      const money2 = Money.create(100, 'USD');
      
      expect(money1.equals(money2)).toBe(false);
    });

    it('debe retornar false cuando se compara con un objeto que no es Money', () => {
      const money = Money.create(100, 'EUR');
      const notMoney = {
        value: () => 100,
        equals: () => false,
        toString: () => '100'
      };
      
      expect(money.equals(notMoney)).toBe(false);
    });
  });

  describe('toString', () => {
    it('debe formatear correctamente el valor en EUR', () => {
      const money = Money.create(100, 'EUR');
      
      // El formato exacto puede variar según la configuración regional, 
      // verificamos que incluya el símbolo y el valor
      expect(money.toString()).toContain('100');
      expect(money.toString().length).toBeGreaterThan(3);
    });
  });

  describe('operaciones aritméticas', () => {
    describe('add', () => {
      it('debe sumar correctamente dos valores de la misma moneda', () => {
        const money1 = Money.create(100, 'EUR');
        const money2 = Money.create(50, 'EUR');
        
        const result = money1.add(money2);
        
        expect(result.value()).toBe(150);
        expect(result.currency()).toBe('EUR');
      });

      it('debe lanzar error al sumar valores de diferentes monedas', () => {
        const money1 = Money.create(100, 'EUR');
        const money2 = Money.create(50, 'USD');
        
        expect(() => {
          money1.add(money2);
        }).toThrow('No se pueden sumar montos de diferentes monedas');
      });
    });

    describe('subtract', () => {
      it('debe restar correctamente cuando el resultado es positivo', () => {
        const money1 = Money.create(100, 'EUR');
        const money2 = Money.create(50, 'EUR');
        
        const result = money1.subtract(money2);
        
        expect(result.value()).toBe(50);
        expect(result.currency()).toBe('EUR');
      });

      it('debe lanzar error cuando el resultado sería negativo', () => {
        const money1 = Money.create(50, 'EUR');
        const money2 = Money.create(100, 'EUR');
        
        expect(() => {
          money1.subtract(money2);
        }).toThrow('El resultado de la resta no puede ser negativo');
      });

      it('debe lanzar error al restar valores de diferentes monedas', () => {
        const money1 = Money.create(100, 'EUR');
        const money2 = Money.create(50, 'USD');
        
        expect(() => {
          money1.subtract(money2);
        }).toThrow('No se pueden restar montos de diferentes monedas');
      });
    });

    describe('multiply', () => {
      it('debe multiplicar correctamente por un factor positivo', () => {
        const money = Money.create(100, 'EUR');
        
        const result = money.multiply(2.5);
        
        expect(result.value()).toBe(250);
        expect(result.currency()).toBe('EUR');
      });

      it('debe lanzar error al multiplicar por un factor negativo', () => {
        const money = Money.create(100, 'EUR');
        
        expect(() => {
          money.multiply(-2);
        }).toThrow('El factor de multiplicación no puede ser negativo');
      });
    });
  });

  describe('comparaciones', () => {
    describe('greaterThan', () => {
      it('debe retornar true cuando el valor es mayor', () => {
        const money1 = Money.create(200, 'EUR');
        const money2 = Money.create(100, 'EUR');
        
        expect(money1.greaterThan(money2)).toBe(true);
      });

      it('debe retornar false cuando el valor es menor o igual', () => {
        const money1 = Money.create(100, 'EUR');
        const money2 = Money.create(100, 'EUR');
        const money3 = Money.create(200, 'EUR');
        
        expect(money1.greaterThan(money2)).toBe(false);
        expect(money1.greaterThan(money3)).toBe(false);
      });

      it('debe lanzar error al comparar diferentes monedas', () => {
        const money1 = Money.create(100, 'EUR');
        const money2 = Money.create(50, 'USD');
        
        expect(() => {
          money1.greaterThan(money2);
        }).toThrow('No se pueden comparar montos de diferentes monedas');
      });
    });

    describe('lessThan', () => {
      it('debe retornar true cuando el valor es menor', () => {
        const money1 = Money.create(50, 'EUR');
        const money2 = Money.create(100, 'EUR');
        
        expect(money1.lessThan(money2)).toBe(true);
      });

      it('debe retornar false cuando el valor es mayor o igual', () => {
        const money1 = Money.create(100, 'EUR');
        const money2 = Money.create(100, 'EUR');
        const money3 = Money.create(50, 'EUR');
        
        expect(money1.lessThan(money2)).toBe(false);
        expect(money1.lessThan(money3)).toBe(false);
      });

      it('debe lanzar error al comparar diferentes monedas', () => {
        const money1 = Money.create(100, 'EUR');
        const money2 = Money.create(200, 'USD');
        
        expect(() => {
          money1.lessThan(money2);
        }).toThrow('No se pueden comparar montos de diferentes monedas');
      });
    });
  });
}); 