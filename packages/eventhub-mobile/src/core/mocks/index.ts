// Exportar datos de mock
export * from './data'; 

/**
 * Datos simulados para tickets
 */
export const mockTickets = [
  {
    id: 'ticket-1',
    eventId: 'event-1',
    userId: 'user-1',
    ticketNumber: 'T-0001',
    ticketType: 'VIP',
    seat: 'A1',
    price: 100,
    status: 'valid',
    purchaseDate: '2023-07-15T10:30:00Z',
    qrCode: 'EH-event-1-123456',
    ticketHolder: {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '+34600123456'
    }
  },
  {
    id: 'ticket-2',
    eventId: 'event-2',
    userId: 'user-1',
    ticketNumber: 'T-0002',
    ticketType: 'General',
    price: 50,
    status: 'valid',
    purchaseDate: '2023-08-10T15:45:00Z',
    qrCode: 'EH-event-2-234567',
    ticketHolder: {
      name: 'Juan Pérez',
      email: 'juan@example.com'
    }
  },
  {
    id: 'ticket-3',
    eventId: 'event-3',
    userId: 'user-1',
    ticketNumber: 'T-0003',
    ticketType: 'Palco',
    seat: 'B5',
    price: 75,
    status: 'used',
    purchaseDate: '2023-06-20T09:15:00Z',
    qrCode: 'EH-event-3-345678',
    ticketHolder: {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      phone: '+34600123456'
    }
  },
  {
    id: 'ticket-4',
    eventId: 'event-4',
    userId: 'user-2',
    ticketNumber: 'T-0004',
    ticketType: 'VIP',
    price: 120,
    status: 'valid',
    purchaseDate: '2023-09-05T18:30:00Z',
    qrCode: 'EH-event-4-456789',
    ticketHolder: {
      name: 'María López',
      email: 'maria@example.com',
      phone: '+34600654321'
    }
  },
  {
    id: 'ticket-5',
    eventId: 'event-5',
    userId: 'user-2',
    ticketNumber: 'T-0005',
    ticketType: 'General',
    price: 40,
    status: 'cancelled',
    purchaseDate: '2023-09-10T14:20:00Z',
    qrCode: 'EH-event-5-567890',
    ticketHolder: {
      name: 'María López',
      email: 'maria@example.com'
    }
  }
]; 