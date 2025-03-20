import { EventStatus, EventStatusEnum } from '../../../src/events';

describe('EventStatus Value Object', () => {
  describe('constructor', () => {
    it('debe crear un EventStatus válido con un valor del enum', () => {
      const status = new EventStatus(EventStatusEnum.PUBLISHED);
      
      expect(status).toBeDefined();
      expect(status.value()).toBe(EventStatusEnum.PUBLISHED);
    });

    it('debe crear un EventStatus válido con un string válido', () => {
      const status = new EventStatus('DRAFT');
      
      expect(status.value()).toBe(EventStatusEnum.DRAFT);
    });

    it('debe lanzar error al crear con un valor inválido', () => {
      expect(() => {
        new EventStatus('INVALID_STATUS' as EventStatusEnum);
      }).toThrow('Estado no válido');
    });
  });

  describe('métodos estáticos de fábrica', () => {
    it('debe crear un estado DRAFT con el método estático', () => {
      const status = EventStatus.draft();
      
      expect(status.value()).toBe(EventStatusEnum.DRAFT);
      expect(status.isDraft()).toBe(true);
    });

    it('debe crear un estado PUBLISHED con el método estático', () => {
      const status = EventStatus.published();
      
      expect(status.value()).toBe(EventStatusEnum.PUBLISHED);
      expect(status.isPublished()).toBe(true);
    });

    it('debe crear un estado CANCELLED con el método estático', () => {
      const status = EventStatus.cancelled();
      
      expect(status.value()).toBe(EventStatusEnum.CANCELLED);
      expect(status.isCancelled()).toBe(true);
    });

    it('debe crear un estado COMPLETED con el método estático', () => {
      const status = EventStatus.completed();
      
      expect(status.value()).toBe(EventStatusEnum.COMPLETED);
      expect(status.isCompleted()).toBe(true);
    });

    it('debe crear un estado SUSPENDED con el método estático', () => {
      const status = EventStatus.suspended();
      
      expect(status.value()).toBe(EventStatusEnum.SUSPENDED);
      expect(status.isSuspended()).toBe(true);
    });
  });

  describe('métodos de verificación', () => {
    it('isPublished debe devolver true solo para estado PUBLISHED', () => {
      const published = new EventStatus(EventStatusEnum.PUBLISHED);
      const draft = new EventStatus(EventStatusEnum.DRAFT);
      
      expect(published.isPublished()).toBe(true);
      expect(draft.isPublished()).toBe(false);
    });

    it('isDraft debe devolver true solo para estado DRAFT', () => {
      const draft = new EventStatus(EventStatusEnum.DRAFT);
      const published = new EventStatus(EventStatusEnum.PUBLISHED);
      
      expect(draft.isDraft()).toBe(true);
      expect(published.isDraft()).toBe(false);
    });

    it('isCancelled debe devolver true solo para estado CANCELLED', () => {
      const cancelled = new EventStatus(EventStatusEnum.CANCELLED);
      const draft = new EventStatus(EventStatusEnum.DRAFT);
      
      expect(cancelled.isCancelled()).toBe(true);
      expect(draft.isCancelled()).toBe(false);
    });

    it('isCompleted debe devolver true solo para estado COMPLETED', () => {
      const completed = new EventStatus(EventStatusEnum.COMPLETED);
      const draft = new EventStatus(EventStatusEnum.DRAFT);
      
      expect(completed.isCompleted()).toBe(true);
      expect(draft.isCompleted()).toBe(false);
    });

    it('isSuspended debe devolver true solo para estado SUSPENDED', () => {
      const suspended = new EventStatus(EventStatusEnum.SUSPENDED);
      const draft = new EventStatus(EventStatusEnum.DRAFT);
      
      expect(suspended.isSuspended()).toBe(true);
      expect(draft.isSuspended()).toBe(false);
    });
  });

  describe('equals', () => {
    it('debe considerar iguales dos objetos con el mismo valor', () => {
      const status1 = new EventStatus(EventStatusEnum.PUBLISHED);
      const status2 = new EventStatus(EventStatusEnum.PUBLISHED);
      
      expect(status1.equals(status2)).toBe(true);
    });

    it('debe considerar diferentes dos objetos con diferente valor', () => {
      const status1 = new EventStatus(EventStatusEnum.PUBLISHED);
      const status2 = new EventStatus(EventStatusEnum.DRAFT);
      
      expect(status1.equals(status2)).toBe(false);
    });
  });

  describe('toString', () => {
    it('debe convertir correctamente a string', () => {
      const status = new EventStatus(EventStatusEnum.PUBLISHED);
      
      expect(status.toString()).toBe('PUBLISHED');
    });
  });
}); 