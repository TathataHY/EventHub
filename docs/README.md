# Documentación del Proyecto EventHub

Este directorio contiene toda la documentación relacionada con el desarrollo del proyecto EventHub, una aplicación móvil para la gestión de eventos sociales y empresariales.

## Estructura de la Documentación

```
docs/
│
├── architecture/                // Documentación de arquitectura
│   └── clean_architecture.md   // Principios de Clean Architecture aplicados al proyecto
│
├── requirements/               // Requisitos y análisis
│   ├── altornivel/            // Requisitos de alto nivel
│   │   └── requerimientos.md  // Tabla de requerimientos generales
│   │
│   ├── acceptance/            // Criterios de aceptación
│   │   └── criterios_aceptacion.md  // Criterios de aceptación por área funcional
│   │
│   ├── usecases/              // Casos de uso
│   │   └── casos_uso.md       // Detalle de casos de uso del sistema
│   │
│   ├── flows/                 // Diagramas de flujo
│   │   ├── flujos_procesos.md // Descripción de flujos principales
│   │   └── instrucciones_plantuml.md // Instrucciones para usar PlantUML
│   │
│   └── userstories/           // Historias de usuario
│       └── historias_usuario.md // Historias desde perspectiva del usuario
│
├── technical/                  // Documentación técnica
│   └── plan_implementacion.md  // Plan de implementación técnica
│
└── user/                       // Documentación para usuarios finales
    └── guia_usuario.md         // Guía de uso de la aplicación
```

## Índice de Contenidos

### Arquitectura
- [Clean Architecture](architecture/clean_architecture.md) - Descripción de los principios de Clean Architecture aplicados al proyecto.

### Requisitos
- [Requerimientos de Alto Nivel](requirements/altornivel/requerimientos.md) - Lista completa de requerimientos del sistema.
- [Casos de Uso](requirements/usecases/casos_uso.md) - Descripción detallada de los casos de uso.
- [Flujos de Procesos](requirements/flows/flujos_procesos.md) - Diagramas y descripción de los principales flujos de la aplicación usando PlantUML.
- [Instrucciones PlantUML](requirements/flows/instrucciones_plantuml.md) - Guía para visualizar y editar los diagramas de flujo con PlantUML.
- [Historias de Usuario](requirements/userstories/historias_usuario.md) - Historias desde la perspectiva del usuario.
- [Criterios de Aceptación](requirements/acceptance/criterios_aceptacion.md) - Criterios de aceptación detallados por área funcional.

### Documentación Técnica
- [Plan de Implementación](technical/plan_implementacion.md) - Detalles sobre la implementación técnica del proyecto.

### Documentación de Usuario
- [Guía de Usuario](user/guia_usuario.md) - Guía completa para los usuarios finales de la aplicación.

## Cómo contribuir a la documentación

1. Utiliza Markdown para todos los documentos.
2. Sigue la estructura de carpetas existente.
3. Actualiza este README cuando añadas nuevos documentos.
4. Nombra los archivos en formato snake_case y en español.
5. Para diagramas de flujo, utiliza PlantUML siguiendo las instrucciones en [Instrucciones PlantUML](requirements/flows/instrucciones_plantuml.md).

## Convenciones de nombrado

- **Archivos**: snake_case.md (ej: casos_uso.md)
- **Carpetas**: minúsculas sin espacios (ej: requirements, usecases)
- **Títulos en archivos**: Título principal en formato # Título, subtítulos con ## y subsecciones con ###
- **Diagramas PlantUML**: Código en bloques de código con sintaxis `plantuml`

## Historial de actualizaciones

- 10/03/2025: Organización inicial de la documentación en carpetas.
- 10/03/2025: Creación de documentos de requerimientos, casos de uso, flujos, historias de usuario y criterios de aceptación.
- 15/03/2025: Conversión de diagramas de flujo a formato PlantUML para mejor visualización y mantenimiento.

## Información Adicional

Para más información sobre el proyecto, consulte la [página principal del proyecto](../README.md) o póngase en contacto con el equipo de desarrollo. 