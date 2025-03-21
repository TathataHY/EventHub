# EventHub Showcase

Este repositorio contiene el sitio web demostrativo de EventHub, una plataforma para la gestión de eventos empresariales y networking profesional.

## 🌐 Demo en vivo

**Ver el sitio web desplegado:** [https://tathatahy.github.io/eventhub-showcase/](https://tathatahy.github.io/eventhub-showcase/)

El sitio se actualiza automáticamente con cada push a la rama main gracias a GitHub Actions.

## 🚀 Características

- **Diseño Moderno y Responsivo**: Adaptado a todos los dispositivos
- **Landing Page Informativa**: Presenta la plataforma EventHub
- **Páginas Demostrativas**: Muestra las funcionalidades y casos de uso
- **Formulario de Contacto**: Permite a visitantes solicitar información
- **Despliegue Automático**: Configurado con GitHub Actions para despliegue en GitHub Pages

## 📁 Estructura del Proyecto

```
eventhub-showcase/
├── public/                # Archivos estáticos (imágenes, favicon)
├── src/
│   ├── assets/            # Recursos gráficos
│   ├── layouts/           # Plantilla principal (Layout.astro)
│   ├── pages/             # Páginas (index, funcionalidades, etc.)
│   └── components/        # Componentes reutilizables (vacío)
└── astro.config.mjs       # Configuración de Astro y despliegue
```

## 💻 Tecnologías

- **Astro**: Framework para sitios web estáticos
- **TailwindCSS**: Framework CSS para diseño responsivo
- **GitHub Pages**: Plataforma de despliegue

## 🔧 Instalación

```bash
# Clonar este repositorio
git clone https://github.com/TathataHY/eventhub-showcase.git

# Entrar al directorio
cd eventhub-showcase

# Instalar dependencias
npm install
```

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Compilar para producción
npm run build

# Previsualizar versión de producción
npm run preview
```

## 🔄 Relación con EventHub

Este showcase es la landing page promocional para el ecosistema EventHub, que incluye:

- Aplicación móvil
- API backend
- Sistema completo de gestión de eventos

## 📝 Personalización

Para añadir nuevas páginas, crear archivos `.astro` en `src/pages/` usando el componente Layout como base.

Para modificar el diseño global, editar `src/layouts/Layout.astro`.
