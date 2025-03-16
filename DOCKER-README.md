# Configuración de Docker para EventHub

Este documento explica cómo ejecutar EventHub utilizando Docker para desarrollo local.

## Requisitos previos

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Servicios

- **API (NestJS)**: Backend de la aplicación, corre en el puerto 3000
- **MySQL**: Base de datos, accesible en el puerto 3306

## Instrucciones de uso

### Iniciar los servicios

```bash
yarn docker:up
```

O si no tienes yarn:

```bash
npm run docker:up
```

La primera vez que ejecutes este comando, Docker descargará las imágenes necesarias y construirá los contenedores. Esto puede tomar varios minutos.

### Ver los logs

```bash
yarn docker:logs
```

### Detener los servicios

```bash
yarn docker:down
```

### Reconstruir los contenedores

Si haces cambios en el Dockerfile o necesitas reconstruir los contenedores:

```bash
yarn docker:build
```

### Reiniciar los servicios

```bash
yarn docker:restart
```

### Verificar si la API está funcionando

```bash
yarn check:api
```

## Acceso a los servicios

- **API**: http://localhost:3000
- **API Documentación (Swagger)**: http://localhost:3000/api
- **MySQL**:
  - Host: localhost
  - Puerto: 3306
  - Usuario: eventhub
  - Contraseña: eventhubpass
  - Base de datos: eventhub

## Estructura de directorios

```
.
├── docker-compose.yml        # Configuración de Docker Compose
├── check-api.js              # Script para verificar la API
├── packages/
│   ├── eventhub-api/         # Aplicación backend (NestJS)
│   │   ├── Dockerfile        # Configuración de Docker para la API
│   │   └── ...
│   ├── eventhub-mobile/      # Aplicación móvil
│   └── eventhub-shared/      # Código compartido
```

## Solución de problemas

### La API no inicia correctamente

1. Verifica los logs: `yarn docker:logs api`
2. Asegúrate de que la base de datos esté funcionando: `yarn docker:logs mysql`
3. Intenta reiniciar el servicio: `yarn docker:restart api`

### La base de datos no se inicializa

1. Elimina el volumen y reinicia: `docker volume rm eventhub_mysql-data`
2. Reinicia los servicios: `yarn docker:restart` 