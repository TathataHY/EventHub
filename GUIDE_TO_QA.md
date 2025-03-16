# Guía de Pruebas para QA

Esta guía contiene instrucciones detalladas para el equipo de QA sobre cómo probar la plataforma EventHub.

## Configuración del entorno

1. Clona el repositorio:
   ```bash
   git clone <url-del-repositorio>
   cd EventHub
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Configura la base de datos:
   - Asegúrate de tener PostgreSQL corriendo
   - Crea una base de datos llamada `eventhub_test`
   - Usa el archivo `.env.test` para la configuración

4. Ejecuta los seeds para poblar la base de datos de prueba:
   ```bash
   npm run seed:test
   ```

## Pruebas automatizadas

### Ejecutar pruebas e2e

```bash
npm run test:e2e
```

Para ver detalles de ejecución:
```bash
npm run test:e2e -- --verbose
```

### Pruebas específicas

Para ejecutar sólo un conjunto de pruebas:
```bash
npm run test:e2e -- -t "AuthController"
```

## Iniciar el servidor para pruebas manuales

```bash
npm run start:test
```

Accede a Swagger UI: http://localhost:3001/api/docs

## Credenciales para pruebas

- **Usuario Admin**:
  - Email: admin@eventhub.com
  - Password: admin123

## Flujos a probar

1. **Autenticación**:
   - Login exitoso con credenciales válidas
   - Rechazo de credenciales inválidas
   - Autorización JWT en endpoints protegidos

2. **Eventos**:
   - Creación de eventos
   - Listado de eventos
   - Detalles de un evento
   - Actualización de eventos
   - Asistencia a eventos
   - Cancelación de eventos

3. **Usuarios**:
   - Registro de nuevos usuarios
   - Acceso a perfil
   - Actualización de información

4. **Notificaciones**:
   - Recepción de notificaciones
   - Marcado como leídas
   - Contador de no leídas

## Reporte de bugs

Por favor, al reportar errores incluir:
- Endpoint afectado
- Pasos para reproducir
- Respuesta esperada vs recibida
- Capturas de pantalla (si aplica)
- Entorno de prueba (navegador, sistema operativo)

## Checklist de QA

- [ ] Validación de campos en formularios
- [ ] Manejo de errores y excepciones
- [ ] Seguridad de endpoints protegidos
- [ ] Rendimiento de endpoints de listado con filtros
- [ ] Consistencia de datos entre endpoints relacionados
- [ ] Validación de reglas de negocio (fechas, capacidad, etc.)
- [ ] Pruebas de concurrencia (múltiples usuarios)

## Contacto

Para dudas o problemas técnicos, contactar al equipo de desarrollo. 