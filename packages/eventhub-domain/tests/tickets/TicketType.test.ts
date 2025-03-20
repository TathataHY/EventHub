import { TicketType, TicketTypeEnum } from '../../src/tickets';

describe('TicketType Value Object', () => {
  describe('create', () => {
    it('debe crear un TicketType válido para GENERAL', () => {
      const ticketType = TicketType.create(TicketTypeEnum.GENERAL);
      
      expect(ticketType).toBeDefined();
      expect(ticketType.value()).toBe(TicketTypeEnum.GENERAL);
      expect(ticketType.isGeneral()).toBe(true);
      expect(ticketType.isVIP()).toBe(false);
    });
    
    it('debe crear un TicketType válido para VIP', () => {
      const ticketType = TicketType.create(TicketTypeEnum.VIP);
      
      expect(ticketType).toBeDefined();
      expect(ticketType.value()).toBe(TicketTypeEnum.VIP);
      expect(ticketType.isVIP()).toBe(true);
      expect(ticketType.isGeneral()).toBe(false);
    });
    
    it('debe crear un TicketType válido para EARLY_BIRD', () => {
      const ticketType = TicketType.create(TicketTypeEnum.EARLY_BIRD);
      
      expect(ticketType).toBeDefined();
      expect(ticketType.value()).toBe(TicketTypeEnum.EARLY_BIRD);
      expect(ticketType.isEarlyBird()).toBe(true);
    });
    
    it('debe crear un TicketType válido para STUDENT', () => {
      const ticketType = TicketType.create(TicketTypeEnum.STUDENT);
      
      expect(ticketType).toBeDefined();
      expect(ticketType.value()).toBe(TicketTypeEnum.STUDENT);
      expect(ticketType.isStudent()).toBe(true);
    });
    
    it('debe crear un TicketType válido para SENIOR', () => {
      const ticketType = TicketType.create(TicketTypeEnum.SENIOR);
      
      expect(ticketType).toBeDefined();
      expect(ticketType.value()).toBe(TicketTypeEnum.SENIOR);
      expect(ticketType.isSenior()).toBe(true);
    });
    
    it('debe crear un TicketType válido para GROUP', () => {
      const ticketType = TicketType.create(TicketTypeEnum.GROUP);
      
      expect(ticketType).toBeDefined();
      expect(ticketType.value()).toBe(TicketTypeEnum.GROUP);
      expect(ticketType.isGroup()).toBe(true);
    });
    
    it('debe crear un TicketType válido para SPECIAL', () => {
      const ticketType = TicketType.create(TicketTypeEnum.SPECIAL);
      
      expect(ticketType).toBeDefined();
      expect(ticketType.value()).toBe(TicketTypeEnum.SPECIAL);
      expect(ticketType.isSpecial()).toBe(true);
    });
  });
  
  describe('equals', () => {
    it('debe considerar iguales dos TicketType con el mismo valor', () => {
      const type1 = TicketType.create(TicketTypeEnum.VIP);
      const type2 = TicketType.create(TicketTypeEnum.VIP);
      
      expect(type1.equals(type2)).toBe(true);
    });
    
    it('debe considerar diferentes dos TicketType con distinto valor', () => {
      const type1 = TicketType.create(TicketTypeEnum.VIP);
      const type2 = TicketType.create(TicketTypeEnum.GENERAL);
      
      expect(type1.equals(type2)).toBe(false);
    });
  });
  
  describe('toString', () => {
    it('debe convertir correctamente a string', () => {
      const ticketType = TicketType.create(TicketTypeEnum.VIP);
      
      expect(ticketType.toString()).toBe('VIP');
    });
  });
}); 