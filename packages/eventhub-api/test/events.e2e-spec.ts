import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';

describe('EventController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let createdEventId: string;

  beforeAll(async () => {
    app = (global as any).app;
    
    // Obtener token de autenticación
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@eventhub.com', password: 'admin123' });
    
    authToken = loginResponse.body.token;
  });

  describe('GET /api/events', () => {
    it('debería devolver una lista de eventos', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/events')
        .expect(200);
      
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/events', () => {
    it('debería crear un nuevo evento', async () => {
      const newEvent = {
        title: 'Evento de prueba E2E',
        description: 'Descripción del evento de prueba',
        startDate: new Date(Date.now() + 86400000).toISOString(), // Mañana
        endDate: new Date(Date.now() + 172800000).toISOString(),  // Pasado mañana
        location: 'Lugar de prueba',
        capacity: 50,
        tags: ['prueba', 'e2e', 'automation']
      };

      const response = await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEvent)
        .expect(201);
      
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(newEvent.title);
      
      // Guardar ID para pruebas posteriores
      createdEventId = response.body.id;
    });

    it('debería rechazar un evento con fechas inválidas', async () => {
      const invalidEvent = {
        title: 'Evento con fechas inválidas',
        description: 'Descripción del evento',
        startDate: new Date(Date.now() + 172800000).toISOString(), // Pasado mañana
        endDate: new Date(Date.now() + 86400000).toISOString(),    // Mañana (antes que startDate)
        location: 'Lugar de prueba',
        capacity: 50
      };

      return request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidEvent)
        .expect(400);
    });
  });

  describe('GET /api/events/:id', () => {
    it('debería obtener un evento por ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/events/${createdEventId}`)
        .expect(200);
      
      expect(response.body).toHaveProperty('id', createdEventId);
    });

    it('debería devolver 404 para un ID inexistente', async () => {
      return request(app.getHttpServer())
        .get('/api/events/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });
  });

  // Más pruebas: actualizar evento, añadir asistentes, cancelar evento, etc.
}); 