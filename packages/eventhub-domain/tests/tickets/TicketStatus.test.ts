import { TicketStatus, TicketStatusEnum } from '../../src/tickets';

describe('TicketStatus Value Object', () => {
  describe('create', () => {
    it('debe crear un TicketStatus válido para AVAILABLE', () => {
      const status = TicketStatus.create(TicketStatusEnum.AVAILABLE);
      
      expect(status).toBeDefined();
      expect(status.value()).toBe(TicketStatusEnum.AVAILABLE);
      expect(status.isAvailable()).toBe(true);
      expect(status.isSold()).toBe(false);
    });
    
    it('debe crear un TicketStatus válido para RESERVED', () => {
      const status = TicketStatus.create(TicketStatusEnum.RESERVED);
      
      expect(status).toBeDefined();
      expect(status.value()).toBe(TicketStatusEnum.RESERVED);
      expect(status.isReserved()).toBe(true);
      expect(status.isAvailable()).toBe(false);
    });
    
    it('debe crear un TicketStatus válido para SOLD', () => {
      const status = TicketStatus.create(TicketStatusEnum.SOLD);
      
      expect(status).toBeDefined();
      expect(status.value()).toBe(TicketStatusEnum.SOLD);
      expect(status.isSold()).toBe(true);
      expect(status.isAvailable()).toBe(false);
    });
    
    it('debe crear un TicketStatus válido para USED', () => {
      const status = TicketStatus.create(TicketStatusEnum.USED);
      
      expect(status).toBeDefined();
      expect(status.value()).toBe(TicketStatusEnum.USED);
      expect(status.isUsed()).toBe(true);
      expect(status.isSold()).toBe(false);
    });
    
    it('debe crear un TicketStatus válido para EXPIRED', () => {
      const status = TicketStatus.create(TicketStatusEnum.EXPIRED);
      
      expect(status).toBeDefined();
      expect(status.value()).toBe(TicketStatusEnum.EXPIRED);
      expect(status.isExpired()).toBe(true);
      expect(status.isAvailable()).toBe(false);
    });
    
    it('debe crear un TicketStatus válido para CANCELLED', () => {
      const status = TicketStatus.create(TicketStatusEnum.CANCELLED);
      
      expect(status).toBeDefined();
      expect(status.value()).toBe(TicketStatusEnum.CANCELLED);
      expect(status.isCancelled()).toBe(true);
      expect(status.isAvailable()).toBe(false);
    });
  });
  
  describe('equals', () => {
    it('debe considerar iguales dos TicketStatus con el mismo valor', () => {
      const status1 = TicketStatus.create(TicketStatusEnum.AVAILABLE);
      const status2 = TicketStatus.create(TicketStatusEnum.AVAILABLE);
      
      expect(status1.equals(status2)).toBe(true);
    });
    
    it('debe considerar diferentes dos TicketStatus con distinto valor', () => {
      const status1 = TicketStatus.create(TicketStatusEnum.AVAILABLE);
      const status2 = TicketStatus.create(TicketStatusEnum.SOLD);
      
      expect(status1.equals(status2)).toBe(false);
    });
  });
  
  describe('toString', () => {
    it('debe convertir correctamente a string', () => {
      const status = TicketStatus.create(TicketStatusEnum.AVAILABLE);
      
      expect(status.toString()).toBe('AVAILABLE');
    });
  });
  
  describe('métodos de verificación de estado', () => {
    it('isAvailable debe retornar true solo para AVAILABLE', () => {
      const available = TicketStatus.create(TicketStatusEnum.AVAILABLE);
      const sold = TicketStatus.create(TicketStatusEnum.SOLD);
      
      expect(available.isAvailable()).toBe(true);
      expect(sold.isAvailable()).toBe(false);
    });
    
    it('isReserved debe retornar true solo para RESERVED', () => {
      const reserved = TicketStatus.create(TicketStatusEnum.RESERVED);
      const available = TicketStatus.create(TicketStatusEnum.AVAILABLE);
      
      expect(reserved.isReserved()).toBe(true);
      expect(available.isReserved()).toBe(false);
    });
    
    it('isSold debe retornar true solo para SOLD', () => {
      const sold = TicketStatus.create(TicketStatusEnum.SOLD);
      const available = TicketStatus.create(TicketStatusEnum.AVAILABLE);
      
      expect(sold.isSold()).toBe(true);
      expect(available.isSold()).toBe(false);
    });
    
    it('isUsed debe retornar true solo para USED', () => {
      const used = TicketStatus.create(TicketStatusEnum.USED);
      const available = TicketStatus.create(TicketStatusEnum.AVAILABLE);
      
      expect(used.isUsed()).toBe(true);
      expect(available.isUsed()).toBe(false);
    });
    
    it('isExpired debe retornar true solo para EXPIRED', () => {
      const expired = TicketStatus.create(TicketStatusEnum.EXPIRED);
      const available = TicketStatus.create(TicketStatusEnum.AVAILABLE);
      
      expect(expired.isExpired()).toBe(true);
      expect(available.isExpired()).toBe(false);
    });
    
    it('isCancelled debe retornar true solo para CANCELLED', () => {
      const cancelled = TicketStatus.create(TicketStatusEnum.CANCELLED);
      const available = TicketStatus.create(TicketStatusEnum.AVAILABLE);
      
      expect(cancelled.isCancelled()).toBe(true);
      expect(available.isCancelled()).toBe(false);
    });
  });
}); 