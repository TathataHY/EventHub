// Data mock para la aplicación

// Usuarios mock
export const mockUsers = [
  {
    id: 'user1',
    name: 'Carlos Rodríguez',
    email: 'carlos@ejemplo.com',
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Amante de los eventos de tecnología y conciertos en vivo.',
    interests: ['Tecnología', 'Música', 'Deportes'],
    eventsAttended: ['event1', 'event3', 'event5'],
    eventsOrganized: ['event2'],
    following: ['user2', 'user3'],
    followers: ['user2', 'user4', 'user5'],
  },
  {
    id: 'user2',
    name: 'María González',
    email: 'maria@ejemplo.com',
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg',
    bio: 'Organizadora de eventos culturales y educativos.',
    interests: ['Arte', 'Educación', 'Cultura'],
    eventsAttended: ['event2', 'event4'],
    eventsOrganized: ['event3', 'event6'],
    following: ['user1', 'user4'],
    followers: ['user1', 'user3'],
  },
  {
    id: 'user3',
    name: 'Juan López',
    email: 'juan@ejemplo.com',
    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg',
    bio: 'Fan del deporte y eventos al aire libre.',
    interests: ['Deportes', 'Naturaleza', 'Aventura'],
    eventsAttended: ['event1', 'event5'],
    eventsOrganized: ['event4'],
    following: ['user1', 'user2'],
    followers: ['user2', 'user5'],
  },
];

// Categorías de eventos
export const mockCategories = [
  { id: 'cat1', name: 'Música', icon: 'musical-notes' },
  { id: 'cat2', name: 'Tecnología', icon: 'desktop' },
  { id: 'cat3', name: 'Deportes', icon: 'football' },
  { id: 'cat4', name: 'Arte y Cultura', icon: 'color-palette' },
  { id: 'cat5', name: 'Negocios', icon: 'briefcase' },
  { id: 'cat6', name: 'Gastronomía', icon: 'restaurant' },
  { id: 'cat7', name: 'Educación', icon: 'school' },
  { id: 'cat8', name: 'Salud y Bienestar', icon: 'fitness' },
];

// Eventos mock
export const mockEvents = [
  {
    id: 'event1',
    title: 'Concierto de Rock en Vivo',
    description: 'Disfruta de las mejores bandas de rock de la escena local en un ambiente increíble.',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-11-15T20:00:00',
    endDate: '2023-11-15T23:30:00',
    location: {
      name: 'Arena Ciudad',
      address: 'Av. Principal 123, Ciudad Central',
      coordinates: { latitude: -33.447487, longitude: -70.673676 }
    },
    category: 'cat1',
    organizer: 'user1',
    price: 25000,
    currency: 'CLP',
    capacity: 500,
    attendees: ['user1', 'user3', 'user5'],
    isActive: true,
    isFeatured: true,
    rating: 4.8,
    tags: ['rock', 'música en vivo', 'bandas locales'],
    photos: [
      'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ],
  },
  {
    id: 'event2',
    title: 'Conferencia Tech Trends 2023',
    description: 'Conoce las últimas tendencias en tecnología y cómo afectarán el futuro del trabajo.',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-12-05T09:00:00',
    endDate: '2023-12-05T18:00:00',
    location: {
      name: 'Centro de Convenciones Futuro',
      address: 'Calle Innovación 456, Distrito Tech',
      coordinates: { latitude: -33.437487, longitude: -70.653676 }
    },
    category: 'cat2',
    organizer: 'user2',
    price: 50000,
    currency: 'CLP',
    capacity: 300,
    attendees: ['user2', 'user4', 'user5'],
    isActive: true,
    isFeatured: true,
    rating: 4.5,
    tags: ['tecnología', 'innovación', 'networking'],
    photos: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ],
  },
  {
    id: 'event3',
    title: 'Festival Gastronómico Internacional',
    description: 'Degustación de platos típicos de diferentes países, con chefs reconocidos internacionalmente.',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-11-20T12:00:00',
    endDate: '2023-11-22T22:00:00',
    location: {
      name: 'Parque Gastronómico',
      address: 'Av. de los Sabores 789, Zona Gourmet',
      coordinates: { latitude: -33.417487, longitude: -70.643676 }
    },
    category: 'cat6',
    organizer: 'user3',
    price: 15000,
    currency: 'CLP',
    capacity: 1000,
    attendees: ['user1', 'user2'],
    isActive: true,
    isFeatured: false,
    rating: 4.7,
    tags: ['gastronomía', 'comida internacional', 'chefs'],
    photos: [
      'https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ],
  },
  {
    id: 'event4',
    title: 'Maratón por la Salud',
    description: 'Corre por una buena causa. Los fondos recaudados serán destinados a hospitales infantiles.',
    image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-12-10T07:00:00',
    endDate: '2023-12-10T12:00:00',
    location: {
      name: 'Parque Metropolitano',
      address: 'Av. de los Deportes 101, Zona Verde',
      coordinates: { latitude: -33.407487, longitude: -70.633676 }
    },
    category: 'cat3',
    organizer: 'user3',
    price: 10000,
    currency: 'CLP',
    capacity: 2000,
    attendees: ['user2', 'user4'],
    isActive: true,
    isFeatured: false,
    rating: 4.6,
    tags: ['deporte', 'maratón', 'caridad', 'salud'],
    photos: [
      'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ],
  },
  {
    id: 'event5',
    title: 'Exposición de Arte Moderno',
    description: 'Descubre las obras de los artistas emergentes más destacados del momento.',
    image: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-11-25T10:00:00',
    endDate: '2023-12-15T20:00:00',
    location: {
      name: 'Galería Nova',
      address: 'Calle Artes 234, Barrio Cultural',
      coordinates: { latitude: -33.427487, longitude: -70.623676 }
    },
    category: 'cat4',
    organizer: 'user2',
    price: 5000,
    currency: 'CLP',
    capacity: 200,
    attendees: ['user1', 'user3'],
    isActive: true,
    isFeatured: true,
    rating: 4.9,
    tags: ['arte', 'cultura', 'exposición'],
    photos: [
      'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      'https://images.unsplash.com/photo-1544967082-d9d25d867d66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ],
  },
  {
    id: 'event6',
    title: 'Workshop de Emprendimiento',
    description: 'Aprende estrategias efectivas para lanzar tu startup y conseguir financiamiento.',
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    date: '2023-12-08T14:00:00',
    endDate: '2023-12-08T18:00:00',
    location: {
      name: 'Hub de Innovación',
      address: 'Calle Emprendedores 567, Distrito Financiero',
      coordinates: { latitude: -33.437487, longitude: -70.613676 }
    },
    category: 'cat5',
    organizer: 'user2',
    price: 30000,
    currency: 'CLP',
    capacity: 50,
    attendees: [],
    isActive: true,
    isFeatured: false,
    rating: 0,
    tags: ['negocios', 'emprendimiento', 'startups'],
    photos: [
      'https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
    ],
  },
];

// Comentarios de eventos
export const mockComments = [
  {
    id: 'comment1',
    eventId: 'event1',
    userId: 'user3',
    text: '¡Increíble concierto! La banda estuvo espectacular.',
    date: '2023-11-16T10:30:00',
    rating: 5,
  },
  {
    id: 'comment2',
    eventId: 'event1',
    userId: 'user5',
    text: 'Buena música pero el sonido podría haber sido mejor.',
    date: '2023-11-16T11:45:00',
    rating: 4,
  },
  {
    id: 'comment3',
    eventId: 'event2',
    userId: 'user4',
    text: 'Excelentes ponentes y muy buena organización.',
    date: '2023-12-06T09:15:00',
    rating: 5,
  },
  {
    id: 'comment4',
    eventId: 'event3',
    userId: 'user1',
    text: 'La variedad de comidas fue increíble. Definitivamente volveré el próximo año.',
    date: '2023-11-23T14:20:00',
    rating: 5,
  },
  {
    id: 'comment5',
    eventId: 'event4',
    userId: 'user2',
    text: 'Muy bien organizado y por una buena causa.',
    date: '2023-12-11T08:00:00',
    rating: 4,
  },
];

// Notificaciones
export const mockNotifications = [
  {
    id: 'notif1',
    userId: 'user1',
    title: 'Recordatorio de evento',
    message: 'El Concierto de Rock en Vivo comenzará en 2 horas',
    date: '2023-11-15T18:00:00',
    read: false,
    type: 'reminder',
    eventId: 'event1',
  },
  {
    id: 'notif2',
    userId: 'user1',
    title: 'Nuevo evento recomendado',
    message: 'Basado en tus intereses: Festival Gastronómico Internacional',
    date: '2023-11-10T09:30:00',
    read: true,
    type: 'recommendation',
    eventId: 'event3',
  },
  {
    id: 'notif3',
    userId: 'user1',
    title: 'Comentario nuevo',
    message: 'Juan López comentó en el Concierto de Rock en Vivo',
    date: '2023-11-16T10:35:00',
    read: false,
    type: 'comment',
    eventId: 'event1',
  },
];

// Tickets de eventos
export const mockTickets = [
  {
    id: 'ticket1',
    eventId: 'event1',
    userId: 'user1',
    purchaseDate: '2023-11-01T15:30:00',
    status: 'confirmed',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket1',
    price: 25000,
    currency: 'CLP',
  },
  {
    id: 'ticket2',
    eventId: 'event2',
    userId: 'user2',
    purchaseDate: '2023-11-10T12:45:00',
    status: 'confirmed',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket2',
    price: 50000,
    currency: 'CLP',
  },
  {
    id: 'ticket3',
    eventId: 'event3',
    userId: 'user1',
    purchaseDate: '2023-11-05T09:20:00',
    status: 'confirmed',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket3',
    price: 15000,
    currency: 'CLP',
  },
];

// Usuario actual (para simular sesión)
export const mockCurrentUser = mockUsers[0]; 