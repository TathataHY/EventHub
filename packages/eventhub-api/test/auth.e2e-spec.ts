import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { Role } from 'eventhub-domain';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authToken: string;

  beforeAll(() => {
    app = (global as any).app;
  });

  describe('POST /auth/login', () => {
    it('debería rechazar credenciales inválidas', async () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'no-existe@example.com', password: 'contraseña-incorrecta' })
        .expect(401);
    });

    it('debería autenticar al usuario con credenciales correctas', async () => {
      // Crear usuario para prueba (usando el seed o directamente)
      const adminUser = {
        email: 'admin@eventhub.com',
        password: 'admin123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(adminUser)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe('string');
      
      // Guardar token para pruebas posteriores
      authToken = response.body.token;
    });
  });

  describe('GET /auth/profile', () => {
    it('debería fallar sin token de autenticación', async () => {
      return request(app.getHttpServer())
        .get('/auth/profile')
        .expect(401);
    });

    it('debería obtener el perfil del usuario autenticado', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email', 'admin@eventhub.com');
      expect(response.body).toHaveProperty('role', Role.ADMIN);
    });
  });
}); 