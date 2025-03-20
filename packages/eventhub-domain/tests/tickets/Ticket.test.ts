import { 
  Ticket, 
  TicketCreateProps,
  TicketProps,
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
        value: () => value,
        currency: () => currency,
        equals: jest.fn().mockImplementation((other) => {
          return value === other.value() && currency === other.currency();
        }),
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
      expect(ticket.price.value()).toBe(100);
      expect(ticket.quantity).toBe(50);
      expect(ticket.availableQuantity).toBe(50);
      expect(ticket.type.value()).toBe(TicketTypeEnum.GENERAL);
      expect(ticket.status.value()).toBe(TicketStatusEnum.AVAILABLE);
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
      
      const updatedTicket = ticket.update({
        name: 'Ticket VIP',
        description: 'Acceso VIP al evento',
        price: Money.create(200),
        quantity: 75,
        type: TicketType.create(TicketTypeEnum.VIP),
      });

      expect(updatedTicket.name).toBe('Ticket VIP');
      expect(updatedTicket.description).toBe('Acceso VIP al evento');
      expect(updatedTicket.price.value()).toBe(200);
      expect(updatedTicket.quantity).toBe(75);
      expect(updatedTicket.availableQuantity).toBe(75);
      expect(updatedTicket.type.value()).toBe(TicketTypeEnum.VIP);
    });

    it('debe lanzar una excepción cuando se intenta actualizar el nombre con un valor vacío', () => {
      const ticket = Ticket.create(validTicketProps);
      
      expect(() => {
        ticket.update({ name: '' });
      }).toThrow(TicketUpdateException);
    });

    it('debe lanzar una excepción cuando se intenta reducir la cantidad por debajo de los tickets vendidos', () => {
      const ticket = Ticket.create(validTicketProps);
      
      // Simulamos un ticket donde se han vendido tickets
      // En lugar de comprar tickets uno por uno, vamos a simular que ya se han vendido
      // modificando las propiedades directamente
      const soldQuantity = 10;
      const ticketWithSales = Ticket.reconstitute({
        ...ticket.toObject(),
        availableQuantity: ticket.quantity - soldQuantity
      });
      
      expect(() => {
        ticketWithSales.update({ quantity: 5 });
      }).toThrow(TicketUpdateException);
    });

    it('debe devolver la misma instancia si no se actualiza ninguna propiedad', () => {
      const ticket = Ticket.create(validTicketProps);
      
      // Llamar a update con los mismos valores
      const updatedTicket = ticket.update({
        name: ticket.name,
        description: ticket.description,
      });
      
      // Debe ser la misma instancia
      expect(updatedTicket).toBe(ticket);
    });

    it('no debe permitir actualizar si el ticket ya está comprado', () => {
      const ticket = Ticket.create(validTicketProps);
      const soldTicket = ticket.purchase(mockUser);
      
      expect(() => {
        soldTicket.update({ name: 'Nuevo nombre' });
      }).toThrow(TicketUpdateException);
    });
  });

  describe('purchase', () => {
    it('debe marcar un ticket como vendido y asignar el comprador', () => {
      const ticket = Ticket.create(validTicketProps);
      
      const updatedTicket = ticket.purchase(mockUser);
      
      expect(updatedTicket.availableQuantity).toBe(49);
      expect(updatedTicket.status.value()).toBe(TicketStatusEnum.SOLD);
      expect(updatedTicket.purchasedBy).toBe(mockUser);
      expect(updatedTicket.purchasedAt).toBeDefined();
    });

    it('debe lanzar una excepción cuando el ticket está inactivo', () => {
      const ticket = Ticket.create(validTicketProps);
      const inactiveTicket = ticket.deactivate();
      
      expect(() => {
        inactiveTicket.purchase(mockUser);
      }).toThrow(TicketUpdateException);
    });

    it('debe lanzar una excepción cuando no hay tickets disponibles', () => {
      const ticketProps = { ...validTicketProps, quantity: 1 };
      const ticket = Ticket.create(ticketProps);
      const soldTicket = ticket.purchase(mockUser);
      
      expect(() => {
        soldTicket.purchase(mockUser);
      }).toThrow(TicketUpdateException);
    });
  });

  describe('cancel', () => {
    it('debe restaurar un ticket vendido a disponible', () => {
      const ticket = Ticket.create(validTicketProps);
      const soldTicket = ticket.purchase(mockUser);
      
      const cancelledTicket = soldTicket.cancel();
      
      expect(cancelledTicket.availableQuantity).toBe(50);
      expect(cancelledTicket.status.value()).toBe(TicketStatusEnum.AVAILABLE);
      expect(cancelledTicket.purchasedBy).toBeUndefined();
      expect(cancelledTicket.purchasedAt).toBeUndefined();
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
      const inactiveTicket = ticket.deactivate();
      
      const activatedTicket = inactiveTicket.activate();
      
      expect(activatedTicket.isActive).toBe(true);
    });

    it('debe desactivar un ticket activo', () => {
      const ticket = Ticket.create(validTicketProps);
      
      const deactivatedTicket = ticket.deactivate();
      
      expect(deactivatedTicket.isActive).toBe(false);
    });
  });

  describe('métodos de verificación', () => {
    it('debe verificar correctamente si un ticket está disponible', () => {
      const ticket = Ticket.create(validTicketProps);
      
      expect(ticket.isAvailable()).toBe(true);
      
      const soldTicket = ticket.purchase(mockUser);
      expect(soldTicket.isAvailable()).toBe(false);
    });
    
    it('debe verificar correctamente si un ticket está comprado', () => {
      const ticket = Ticket.create(validTicketProps);
      expect(ticket.isPurchased()).toBe(false);
      
      const soldTicket = ticket.purchase(mockUser);
      expect(soldTicket.isPurchased()).toBe(true);
    });
    
    it('debe verificar correctamente si un ticket está cancelado', () => {
      const ticket = Ticket.create(validTicketProps);
      expect(ticket.isCancelled()).toBe(false);
      
      // No podemos probar isCancelled=true directamente porque no hay forma fácil
      // de poner un ticket en estado CANCELLED, pero podemos verificar que el método funciona
    });
  });
  
  describe('equals', () => {
    it('debe considerar iguales dos tickets con el mismo ID', () => {
      const commonId = 'ticket-123';
      const ticket1 = Ticket.create({...validTicketProps, id: commonId});
      const ticket2 = Ticket.create({...validTicketProps, id: commonId});
      
      expect(ticket1.equals(ticket2)).toBe(true);
    });
    
    it('debe considerar diferentes dos tickets con distinto ID', () => {
      const ticket1 = Ticket.create(validTicketProps);
      const ticket2 = Ticket.create(validTicketProps);
      
      expect(ticket1.equals(ticket2)).toBe(false);
    });
  });
  
  describe('reconstitute', () => {
    it('debe reconstruir correctamente un ticket desde propiedades', () => {
      const date = new Date();
      const props: TicketProps = {
        id: 'ticket-123',
        createdAt: date,
        updatedAt: date,
        isActive: true,
        name: 'Reconstituido',
        description: 'Ticket reconstituido',
        price: Money.create(150),
        quantity: 25,
        availableQuantity: 10,
        type: TicketType.create(TicketTypeEnum.VIP),
        status: TicketStatus.create(TicketStatusEnum.SOLD),
        event: mockEvent,
        purchasedBy: mockUser,
        purchasedAt: date
      };
      
      const ticket = Ticket.reconstitute(props);
      
      expect(ticket.id).toBe('ticket-123');
      expect(ticket.name).toBe('Reconstituido');
      expect(ticket.availableQuantity).toBe(10);
      expect(ticket.status.value()).toBe(TicketStatusEnum.SOLD);
      expect(ticket.purchasedBy).toBe(mockUser);
    });
  });
  
  describe('toObject', () => {
    it('debe convertir correctamente un ticket a un objeto plano', () => {
      const ticket = Ticket.create(validTicketProps);
      
      const obj = ticket.toObject();
      
      expect(obj.id).toBe(ticket.id);
      expect(obj.name).toBe(ticket.name);
      expect(obj.description).toBe(ticket.description);
      expect(obj.price).toBe(ticket.price);
      expect(obj.quantity).toBe(ticket.quantity);
      expect(obj.availableQuantity).toBe(ticket.availableQuantity);
      expect(obj.type).toBe(ticket.type);
      expect(obj.status).toBe(ticket.status);
      expect(obj.event).toBe(ticket.event);
    });
  });
}); 