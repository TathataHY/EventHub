import { Event } from '../Event';
import { EventCreateException } from '../../exceptions/EventCreateException';
import { EventUpdateException } from '../../exceptions/EventUpdateException';
import { EventAttendanceException } from '../../exceptions/EventAttendanceException';

describe('Event Entity', () => {
  // Fechas de prueba
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  describe('Creation', () => {
    it('should create a valid event', () => {
      const event = new Event({
        id: '1',
        title: 'Tech Conference',
        description: 'A conference about technology',
        startDate: tomorrow,
        endDate: dayAfterTomorrow,
        location: 'Convention Center',
        organizerId: 'user123',
        capacity: 100
      });

      expect(event.id).toBe('1');
      expect(event.title).toBe('Tech Conference');
      expect(event.description).toBe('A conference about technology');
      expect(event.startDate).toEqual(tomorrow);
      expect(event.endDate).toEqual(dayAfterTomorrow);
      expect(event.location).toBe('Convention Center');
      expect(event.organizerId).toBe('user123');
      expect(event.capacity).toBe(100);
      expect(event.attendees).toEqual([]);
      expect(event.isActive).toBe(true);
      expect(event.isCancelled).toBe(false);
      expect(event.tags).toEqual([]);
      expect(event.createdAt).toBeInstanceOf(Date);
      expect(event.updatedAt).toBeInstanceOf(Date);
    });

    it('should create an event with a random UUID if id is not provided', () => {
      const event = new Event({
        title: 'Tech Conference',
        description: 'A conference about technology',
        startDate: tomorrow,
        endDate: dayAfterTomorrow,
        location: 'Convention Center',
        organizerId: 'user123'
      });

      expect(event.id).toBeDefined();
      expect(event.id.length).toBeGreaterThan(0);
    });

    it('should create an event with unlimited capacity when capacity is not provided', () => {
      const event = new Event({
        title: 'Tech Conference',
        description: 'A conference about technology',
        startDate: tomorrow,
        endDate: dayAfterTomorrow,
        location: 'Convention Center',
        organizerId: 'user123'
      });

      expect(event.capacity).toBeNull();
      expect(event.hasAvailableSpace()).toBe(true);
    });

    it('should throw an error if title is not provided', () => {
      expect(() => {
        new Event({
          title: '',
          description: 'A conference about technology',
          startDate: tomorrow,
          endDate: dayAfterTomorrow,
          location: 'Convention Center',
          organizerId: 'user123'
        });
      }).toThrow(EventCreateException);
    });

    it('should throw an error if description is not provided', () => {
      expect(() => {
        new Event({
          title: 'Tech Conference',
          description: '',
          startDate: tomorrow,
          endDate: dayAfterTomorrow,
          location: 'Convention Center',
          organizerId: 'user123'
        });
      }).toThrow(EventCreateException);
    });

    it('should throw an error if location is not provided', () => {
      expect(() => {
        new Event({
          title: 'Tech Conference',
          description: 'A conference about technology',
          startDate: tomorrow,
          endDate: dayAfterTomorrow,
          location: '',
          organizerId: 'user123'
        });
      }).toThrow(EventCreateException);
    });

    it('should throw an error if organizerId is not provided', () => {
      expect(() => {
        new Event({
          title: 'Tech Conference',
          description: 'A conference about technology',
          startDate: tomorrow,
          endDate: dayAfterTomorrow,
          location: 'Convention Center',
          organizerId: ''
        });
      }).toThrow(EventCreateException);
    });

    it('should throw an error if end date is before start date', () => {
      expect(() => {
        new Event({
          title: 'Tech Conference',
          description: 'A conference about technology',
          startDate: dayAfterTomorrow,
          endDate: tomorrow,
          location: 'Convention Center',
          organizerId: 'user123'
        });
      }).toThrow(EventCreateException);
    });

    it('should throw an error if capacity is zero or negative', () => {
      expect(() => {
        new Event({
          title: 'Tech Conference',
          description: 'A conference about technology',
          startDate: tomorrow,
          endDate: dayAfterTomorrow,
          location: 'Convention Center',
          organizerId: 'user123',
          capacity: 0
        });
      }).toThrow(EventCreateException);

      expect(() => {
        new Event({
          title: 'Tech Conference',
          description: 'A conference about technology',
          startDate: tomorrow,
          endDate: dayAfterTomorrow,
          location: 'Convention Center',
          organizerId: 'user123',
          capacity: -10
        });
      }).toThrow(EventCreateException);
    });
  });

  describe('Update', () => {
    let event: Event;

    beforeEach(() => {
      event = new Event({
        id: '1',
        title: 'Tech Conference',
        description: 'A conference about technology',
        startDate: tomorrow,
        endDate: dayAfterTomorrow,
        location: 'Convention Center',
        organizerId: 'user123',
        capacity: 100
      });
    });

    it('should update event properties', () => {
      const newTitle = 'Updated Tech Conference';
      const newDescription = 'Updated conference description';
      const newLocation = 'New Convention Center';
      const newCapacity = 200;

      event.update({
        title: newTitle,
        description: newDescription,
        location: newLocation,
        capacity: newCapacity
      });

      expect(event.title).toBe(newTitle);
      expect(event.description).toBe(newDescription);
      expect(event.location).toBe(newLocation);
      expect(event.capacity).toBe(newCapacity);
    });

    it('should only update provided properties', () => {
      const originalDescription = event.description;
      const originalLocation = event.location;
      const originalCapacity = event.capacity;
      const newTitle = 'Updated Tech Conference';

      event.update({
        title: newTitle
      });

      expect(event.title).toBe(newTitle);
      expect(event.description).toBe(originalDescription);
      expect(event.location).toBe(originalLocation);
      expect(event.capacity).toBe(originalCapacity);
    });

    it('should throw an error if updated title is invalid', () => {
      expect(() => {
        event.update({
          title: ''
        });
      }).toThrow(EventUpdateException);
    });

    it('should throw an error if updated description is invalid', () => {
      expect(() => {
        event.update({
          description: ''
        });
      }).toThrow(EventUpdateException);
    });

    it('should throw an error if updated location is invalid', () => {
      expect(() => {
        event.update({
          location: ''
        });
      }).toThrow(EventUpdateException);
    });

    it('should throw an error if updated dates are invalid', () => {
      expect(() => {
        event.update({
          startDate: dayAfterTomorrow,
          endDate: tomorrow
        });
      }).toThrow(EventUpdateException);
    });

    it('should throw an error if updated capacity is invalid', () => {
      expect(() => {
        event.update({
          capacity: -1
        });
      }).toThrow(EventUpdateException);

      expect(() => {
        event.update({
          capacity: 0
        });
      }).toThrow(EventUpdateException);
    });

    it('should throw an error when updating a cancelled event', () => {
      event.cancelEvent();
      
      expect(() => {
        event.update({
          title: 'New Title'
        });
      }).toThrow(EventUpdateException);
    });
  });

  describe('Attendees Management', () => {
    let event: Event;
    const userId1 = 'user1';
    const userId2 = 'user2';

    beforeEach(() => {
      event = new Event({
        id: '1',
        title: 'Tech Conference',
        description: 'A conference about technology',
        startDate: tomorrow,
        endDate: dayAfterTomorrow,
        location: 'Convention Center',
        organizerId: 'user123',
        capacity: 3
      });
    });

    it('should add an attendee successfully', () => {
      expect(event.attendees.length).toBe(0);
      
      event.addAttendee(userId1);
      
      expect(event.attendees.length).toBe(1);
      expect(event.attendees).toContain(userId1);
    });

    it('should throw an error when adding a duplicate attendee', () => {
      event.addAttendee(userId1);
      
      expect(() => {
        event.addAttendee(userId1);
      }).toThrow(EventAttendanceException);
    });

    it('should throw an error when capacity is reached', () => {
      event.addAttendee('user1');
      event.addAttendee('user2');
      event.addAttendee('user3');
      
      expect(() => {
        event.addAttendee('user4');
      }).toThrow(EventAttendanceException);
    });

    it('should throw an error when adding to a cancelled event', () => {
      event.cancelEvent();
      
      expect(() => {
        event.addAttendee(userId1);
      }).toThrow(EventAttendanceException);
    });

    it('should throw an error when adding to an inactive event', () => {
      // Create event with isActive=false
      event = new Event({
        id: '1',
        title: 'Tech Conference',
        description: 'A conference about technology',
        startDate: tomorrow,
        endDate: dayAfterTomorrow,
        location: 'Convention Center',
        organizerId: 'user123',
        isActive: false
      });
      
      expect(() => {
        event.addAttendee(userId1);
      }).toThrow(EventAttendanceException);
    });

    it('should throw an error when adding to a past event', () => {
      // Create event with past end date
      event = new Event({
        id: '1',
        title: 'Tech Conference',
        description: 'A conference about technology',
        startDate: yesterday,
        endDate: yesterday,
        location: 'Convention Center',
        organizerId: 'user123'
      });
      
      expect(() => {
        event.addAttendee(userId1);
      }).toThrow(EventAttendanceException);
    });

    it('should remove an attendee successfully', () => {
      event.addAttendee(userId1);
      expect(event.attendees.length).toBe(1);
      
      event.removeAttendee(userId1);
      
      expect(event.attendees.length).toBe(0);
      expect(event.attendees).not.toContain(userId1);
    });

    it('should throw an error when removing an attendee not in the list', () => {
      expect(() => {
        event.removeAttendee(userId1);
      }).toThrow(EventAttendanceException);
    });

    it('should throw an error when removing from a cancelled event', () => {
      event.addAttendee(userId1);
      event.cancelEvent();
      
      expect(() => {
        event.removeAttendee(userId1);
      }).toThrow(EventAttendanceException);
    });
  });

  describe('Event Cancellation', () => {
    let event: Event;

    beforeEach(() => {
      event = new Event({
        id: '1',
        title: 'Tech Conference',
        description: 'A conference about technology',
        startDate: tomorrow,
        endDate: dayAfterTomorrow,
        location: 'Convention Center',
        organizerId: 'user123'
      });
    });

    it('should cancel an active event', () => {
      expect(event.isActive).toBe(true);
      expect(event.isCancelled).toBe(false);
      
      event.cancelEvent();
      
      expect(event.isActive).toBe(false);
      expect(event.isCancelled).toBe(true);
    });

    it('should not change state when cancelling an already cancelled event', () => {
      event.cancelEvent();
      
      // Get the updateAt value after first cancellation
      const updatedAtAfterFirstCancel = event.updatedAt;
      
      // Wait a bit to ensure timestamp would change
      setTimeout(() => {
        event.cancelEvent();
        
        // updatedAt should not have changed since the event was already cancelled
        expect(event.updatedAt).toEqual(updatedAtAfterFirstCancel);
      }, 10);
    });
  });

  describe('Utility Methods', () => {
    it('should correctly identify the organizer', () => {
      const organizerId = 'user123';
      const event = new Event({
        title: 'Tech Conference',
        description: 'A conference about technology',
        startDate: tomorrow,
        endDate: dayAfterTomorrow,
        location: 'Convention Center',
        organizerId
      });
      
      expect(event.isOrganizer(organizerId)).toBe(true);
      expect(event.isOrganizer('anotherUser')).toBe(false);
    });

    it('should correctly determine if the event has ended', () => {
      const pastEvent = new Event({
        title: 'Past Event',
        description: 'This event has already ended',
        startDate: yesterday,
        endDate: yesterday,
        location: 'Convention Center',
        organizerId: 'user123'
      });
      
      const futureEvent = new Event({
        title: 'Future Event',
        description: 'This event is in the future',
        startDate: tomorrow,
        endDate: dayAfterTomorrow,
        location: 'Convention Center',
        organizerId: 'user123'
      });
      
      expect(pastEvent.hasEnded()).toBe(true);
      expect(futureEvent.hasEnded()).toBe(false);
    });

    it('should correctly determine if there is available space', () => {
      const eventWithCapacity = new Event({
        title: 'Limited Event',
        description: 'Event with limited space',
        startDate: tomorrow,
        endDate: dayAfterTomorrow,
        location: 'Convention Center',
        organizerId: 'user123',
        capacity: 2
      });
      
      const eventWithoutCapacity = new Event({
        title: 'Unlimited Event',
        description: 'Event with unlimited space',
        startDate: tomorrow,
        endDate: dayAfterTomorrow,
        location: 'Convention Center',
        organizerId: 'user123'
      });
      
      expect(eventWithCapacity.hasAvailableSpace()).toBe(true);
      expect(eventWithoutCapacity.hasAvailableSpace()).toBe(true);
      
      // Add attendees up to capacity
      eventWithCapacity.addAttendee('user1');
      expect(eventWithCapacity.hasAvailableSpace()).toBe(true);
      
      eventWithCapacity.addAttendee('user2');
      expect(eventWithCapacity.hasAvailableSpace()).toBe(false);
    });
  });
}); 