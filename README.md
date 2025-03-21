# EventHub - Plataforma de Eventos

EventHub es una plataforma para la gestión de eventos empresariales y networking profesional.

## Web Demostrativa

Este repositorio incluye una web demostrativa que presenta las características principales de la aplicación EventHub.

### Estructura del Proyecto

- **packages/eventhub-showcase**: Sitio web demostrativo creado con Astro
- **packages/eventhub-mobile**: Aplicación móvil (React Native)
- **packages/eventhub-api**: API backend
- **packages/eventhub-domain**: Capa de dominio
- **packages/eventhub-infrastructure**: Capa de infraestructura
- **packages/eventhub-application**: Capa de aplicación
- **packages/eventhub-shared**: Componentes compartidos

## Despliegue en GitHub Pages

El proyecto está configurado para desplegarse automáticamente en GitHub Pages. Para desplegar:

1. Sube el repositorio a GitHub:

```bash
git init
git add .
git commit -m "Versión inicial"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/EventHub.git
git push -u origin main
```

2. En GitHub, ve a **Settings > Pages**:
   - En **Source**, selecciona "GitHub Actions"
   - Espera a que termine el despliegue automático

3. La web demostrativa estará disponible en: `https://TU-USUARIO.github.io/EventHub/`

### Desarrollo Local

Para ejecutar el proyecto localmente:

```bash
# Instalar dependencias
cd packages/eventhub-showcase
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El sitio estará disponible en `http://localhost:4321/`

### Construir para Producción

```bash
cd packages/eventhub-showcase
npm run build
```

Los archivos de la build se generarán en `packages/eventhub-showcase/dist/`.

## Configuración

Si necesitas ajustar la configuración del despliegue, puedes modificar:

- `packages/eventhub-showcase/astro.config.mjs`: Configuración de Astro
- `.github/workflows/deploy.yml`: Configuración del workflow de GitHub Actions

## Licencia

MIT
