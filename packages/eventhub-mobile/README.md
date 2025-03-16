# EventHub Mobile

Aplicación móvil para la plataforma EventHub, que permite a los usuarios descubrir, crear y gestionar eventos.

## Características

- **Autenticación de usuarios**: Registro, inicio de sesión y recuperación de contraseña.
- **Exploración de eventos**: Buscar y filtrar eventos por categoría o texto.
- **Gestión de eventos**: Crear, editar y eliminar eventos propios.
- **Asistencia a eventos**: Registrarse para asistir a eventos y cancelar asistencia.
- **Perfil de usuario**: Ver y editar información del perfil, así como gestionar eventos propios y asistencias.

## Tecnologías utilizadas

- React Native / Expo
- TypeScript
- Expo Router para la navegación
- Formik y Yup para la validación de formularios
- Axios para las peticiones HTTP
- AsyncStorage para el almacenamiento local
- date-fns para el manejo de fechas

## Estructura del proyecto

```
eventhub-mobile/
├── app/                    # Rutas y pantallas de la aplicación
│   ├── tabs/               # Pestañas principales (Eventos, Perfil)
│   ├── evento/             # Detalles de evento
│   ├── editar-evento/      # Edición de eventos
│   ├── _layout.tsx         # Configuración de layout principal
│   ├── crear-evento.tsx    # Pantalla de creación de eventos
│   ├── forgot-password.tsx # Recuperación de contraseña
│   ├── index.tsx           # Pantalla inicial
│   ├── login.tsx           # Inicio de sesión
│   ├── register.tsx        # Registro de usuario
│   └── reset-password.tsx  # Restablecimiento de contraseña
├── src/
│   ├── services/           # Servicios para comunicación con la API
│   │   ├── api.service.ts  # Configuración base de Axios
│   │   ├── auth.service.ts # Servicio de autenticación
│   │   ├── event.service.ts # Servicio de eventos
│   │   └── notification.service.ts # Servicio de notificaciones
│   └── utils/              # Utilidades y helpers
├── assets/                 # Imágenes, fuentes y otros recursos
├── package.json            # Dependencias y scripts
└── tsconfig.json           # Configuración de TypeScript
```

## Instalación

1. Asegúrate de tener Node.js y npm instalados
2. Instala Expo CLI: `npm install -g expo-cli`
3. Clona el repositorio
4. Navega al directorio del proyecto: `cd eventhub/packages/eventhub-mobile`
5. Instala las dependencias: `npm install`
6. Inicia la aplicación: `npm start`

## Uso

- Usa Expo Go en tu dispositivo móvil para escanear el código QR
- O ejecuta en un emulador con: `npm run android` o `npm run ios`

## Pantallas principales

### Autenticación
- **Login**: Inicio de sesión con email y contraseña
- **Registro**: Creación de nueva cuenta
- **Recuperación de contraseña**: Solicitud de restablecimiento por email

### Eventos
- **Lista de eventos**: Exploración de todos los eventos disponibles
- **Detalle de evento**: Información completa y opciones de asistencia
- **Crear/Editar evento**: Formulario para gestionar eventos propios

### Perfil
- **Perfil de usuario**: Información personal y estadísticas
- **Mis eventos**: Eventos creados por el usuario
- **Eventos asistiendo**: Eventos a los que el usuario asistirá

## API

La aplicación se comunica con el backend de EventHub a través de una API RESTful. Los principales endpoints utilizados son:

- `/auth`: Autenticación y gestión de usuarios
- `/events`: CRUD de eventos y gestión de asistencias
- `/notifications`: Gestión de notificaciones

## Estado del proyecto

Esta aplicación está en desarrollo activo. Las próximas características incluirán:
- Notificaciones push
- Compartir eventos en redes sociales
- Mapas y ubicaciones de eventos
- Galería de fotos para eventos 