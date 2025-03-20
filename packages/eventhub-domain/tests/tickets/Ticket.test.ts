import { 
  Ticket, 
  TicketCreateProps,
  TicketType,
  TicketTypeEnum, 
  TicketStatus,
  TicketStatusEnum,
  TicketCreateException, 
  TicketUpdateException
} from '../../src/tickets';
import { Event } from '../../src/events';
import { User } from '../../src/users';
import { Money } from '../../src/core/value-objects/Money';

// Mock de Money ya que es un Value Object
jest.mock('../../src/core/value-objects/Money', () => {
  return {
    Money: {
      create: jest.fn().mockImplementation((value: number, currency: string = 'EUR') => ({
        value,
        currency,
      })),
    },
  };
});

// Mocks para Event y User
const mockEvent = {
  id: 'event-1',
} as Event;

const mockUser = {
  id: 'user-1',
} as User;

describe('Ticket Entity', () => {
  // Datos válidos para crear un ticket
  const validTicketProps: TicketCreateProps = {
    name: 'Entrada General',
    description: 'Acceso a todas las zonas del evento',
    price: Money.create(100),
    quantity: 50,
    type: TicketType.create(TicketTypeEnum.GENERAL),
    event: mockEvent,
  };

  describe('create', () => {
    it('debe crear un ticket válido con los parámetros correctos', () => {
      const ticket = Ticket.create(validTicketProps);
      
      expect(ticket).toBeDefined();
      expect(ticket.id).toBeDefined();
      expect(ticket.name).toBe('Entrada General');
      expect(ticket.description).toBe('Acceso a todas las zonas del evento');
      expect(ticket.price.value).toBe(100);
      expect(ticket.quantity).toBe(50);
      expect(ticket.availableQuantity).toBe(50);
      expect(ticket.type.value).toBe(TicketTypeEnum.GENERAL);
      expect(ticket.status.value).toBe(TicketStatusEnum.AVAILABLE);
      expect(ticket.event).toBe(mockEvent);
      expect(ticket.isActive).toBe(true);
      expect(ticket.purchasedBy).toBeUndefined();
      expect(ticket.purchasedAt).toBeUndefined();
    });

    it('debe lanzar una excepción cuando el nombre está vacío', () => {
      const invalidProps = { ...validTicketProps, name: '' };
      
      expect(() => {
        Ticket.create(invalidProps);
      }).toThrow(TicketCreateException);
    });

    it('debe lanzar una excepción cuando la descripción está vacía', () => {
      const invalidProps = { ...validTicketProps, description: '' };
      
      expect(() => {
        Ticket.create(invalidProps);
      }).toThrow(TicketCreateException);
    });

    it('debe lanzar una excepción cuando el precio es menor o igual a 0', () => {
      const invalidProps = { ...validTicketProps, price: Money.create(0) };
      
      expect(() => {
        Ticket.create(invalidProps);
      }).toThrow(TicketCreateException);
    });

    it('debe lanzar una excepción cuando la cantidad es menor o igual a 0', () => {
      const invalidProps = { ...validTicketProps, quantity: 0 };
      
      expect(() => {
        Ticket.create(invalidProps);
      }).toThrow(TicketCreateException);
    });

    it('debe lanzar una excepción cuando no se proporciona el tipo', () => {
      const invalidProps = { ...validTicketProps } as any;
      invalidProps.type = undefined;
      
      expect(() => {
        Ticket.create(invalidProps);
      }).toThrow(TicketCreateException);
    });

    it('debe lanzar una excepción cuando no se proporciona el evento', () => {
      const invalidProps = { ...validTicketProps } as any;
      invalidProps.event = undefined;
      
      expect(() => {
        Ticket.create(invalidProps);
      }).toThrow(TicketCreateException);
    });
  });

  describe('update', () => {
    it('debe actualizar correctamente las propiedades del ticket', () => {
      const ticket = Ticket.create(validTicketProps);
      
      ticket.update({
        name: 'Ticket VIP',
        description: 'Acceso VIP al evento',
        price: Money.create(200),
        quantity: 75,
        type: TicketType.create(TicketTypeEnum.VIP),
      });

      expect(ticket.name).toBe('Ticket VIP');
      expect(ticket.description).toBe('Acceso VIP al evento');
      expect(ticket.price.value).toBe(200);
      expect(ticket.quantity).toBe(75);
      expect(ticket.availableQuantity).toBe(75);
      expect(ticket.type.value).toBe(TicketTypeEnum.VIP);
    });

    it('debe lanzar una excepción cuando se intenta actualizar el nombre con un valor vacío', () => {
      const ticket = Ticket.create(validTicketProps);
      
      expect(() => {
        ticket.update({ name: '' });
      }).toThrow(TicketUpdateException);
    });

    it('debe lanzar una excepción cuando se intenta reducir la cantidad por debajo de los tickets vendidos', () => {
      const ticket = Ticket.create(validTicketProps);
      
      // Simulamos que se han vendido 10 tickets
      for (let i = 0; i < 10; i++) {
        ticket.purchase(mockUser);
      }
      
      expect(() => {
        ticket.update({ quantity: 5 });
      }).toThrow(TicketUpdateException);
    });
  });

  describe('purchase', () => {
    it('debe marcar un ticket como vendido y asignar el comprador', () => {
      const ticket = Ticket.create(validTicketProps);
      
      ticket.purchase(mockUser);
      
      expect(ticket.availableQuantity).toBe(49);
      expect(ticket.status.value).toBe(TicketStatusEnum.SOLD);
      expect(ticket.purchasedBy).toBe(mockUser);
      expect(ticket.purchasedAt).toBeDefined();
    });

    it('debe lanzar una excepción cuando el ticket está inactivo', () => {
      const ticket = Ticket.create(validTicketProps);
      ticket.deactivate();
      
      expect(() => {
        ticket.purchase(mockUser);
      }).toThrow(TicketUpdateException);
    });

    it('debe lanzar una excepción cuando no hay tickets disponibles', () => {
      const ticketProps = { ...validTicketProps, quantity: 1 };
      const ticket = Ticket.create(ticketProps);
      ticket.purchase(mockUser);
      
      expect(() => {
        ticket.purchase(mockUser);
      }).toThrow(TicketUpdateException);
    });
  });

  describe('cancel', () => {
    it('debe restaurar un ticket vendido a disponible', () => {
      const ticket = Ticket.create(validTicketProps);
      ticket.purchase(mockUser);
      
      ticket.cancel();
      
      expect(ticket.availableQuantity).toBe(50);
      expect(ticket.status.value).toBe(TicketStatusEnum.AVAILABLE);
      expect(ticket.purchasedBy).toBeUndefined();
      expect(ticket.purchasedAt).toBeUndefined();
    });

    it('debe lanzar una excepción al cancelar un ticket que no está vendido', () => {
      const ticket = Ticket.create(validTicketProps);
      
      expect(() => {
        ticket.cancel();
      }).toThrow(TicketUpdateException);
    });
  });

  describe('activate/deactivate', () => {
    it('debe activar un ticket inactivo', () => {
      const ticket = Ticket.create(validTicketProps);
      ticket.deactivate();
      
      ticket.activate();
      
      expect(ticket.isActive).toBe(true);
    });

    it('debe desactivar un ticket activo', () => {
      const ticket = Ticket.create(validTicketProps);
      
      ticket.deactivate();
      
      expect(ticket.isActive).toBe(false);
    });
  });
}); 