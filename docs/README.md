# Documentación de EventHub

Esta carpeta contiene toda la documentación relacionada con el proyecto EventHub.

## Estructura de la Documentación

### 1. Arquitectura

- [**Clean Architecture**](./architecture/clean_architecture.md) - Detalla la implementación de Clean Architecture en el proyecto, incluyendo el estado actual de cada capa
- [**Diagramas de Arquitectura**](./architecture/diagramas_arquitectura.md) - Diagramas visuales de la arquitectura del sistema
- [**Diseño General**](./architecture/diseno_general.md) - Descripción del diseño general del sistema y estructura del monorepo

### 2. Documentación Técnica

- [**Estado Actual del Proyecto**](./technical/estado_actual.md) - Resumen actualizado del estado del proyecto, componentes implementados y pendientes
- [**Avance del Backend**](./technical/avance_backend.md) - Detalle del avance en el desarrollo del backend por módulos
- [**Esquema de Base de Datos**](./technical/esquema_basedatos.md) - Documentación del esquema de la base de datos MySQL
- [**Plan de Implementación**](./technical/plan_implementacion.md) - Plan detallado para la implementación del proyecto
- [**Roadmap Técnico**](./technical/roadmap.md) - Planificación detallada de los próximos sprints y prioridades
- [**API Endpoints**](./technical/api_endpoints.md) - Documentación detallada de todos los endpoints de la API

### 3. Requerimientos

#### Alto Nivel
- [**Requerimientos Generales**](./requirements/altornivel/requerimientos.md) - Lista detallada de requerimientos funcionales y no funcionales

#### Casos de Uso
- [**Casos de Uso**](./requirements/usecases/casos_uso.md) - Descripción detallada de los casos de uso del sistema

#### Flujos de Procesos
- [**Flujos de Procesos**](./requirements/flows/flujos_procesos.md) - Diagramas de flujo de los principales procesos
- [**Instrucciones PlantUML**](./requirements/flows/instrucciones_plantuml.md) - Guía para visualizar y editar diagramas PlantUML

#### Historias de Usuario
- [**Historias de Usuario**](./requirements/userstories/historias_usuario.md) - Historias de usuario con criterios de aceptación

#### Criterios de Aceptación
- [**Criterios de Aceptación**](./requirements/acceptance/criterios_aceptacion.md) - Criterios de aceptación generales

### 4. Documentación para Usuarios
- [**Guía de Usuario**](./user/guia_usuario.md) - Guía completa para los usuarios finales

## Estado del Proyecto

El proyecto EventHub se encuentra actualmente en desarrollo activo. Las principales características del backend ya han sido implementadas, incluyendo:

- Autenticación y gestión de usuarios
- Gestión de eventos
- Sistema de tickets
- Procesamiento de pagos
- Notificaciones
- Comentarios y valoraciones
- Sistema de búsqueda
- Analíticas

Las prioridades actuales son:
1. Completar la refactorización de controladores a la nueva arquitectura limpia
2. Mejorar la validación de entradas
3. Desarrollar pruebas unitarias y de integración
4. Optimizar el rendimiento de consultas complejas

Para más detalles sobre el estado actual y próximos pasos, consulta el [Estado Actual del Proyecto](./technical/estado_actual.md), el [Avance del Backend](./technical/avance_backend.md) y el [Roadmap Técnico](./technical/roadmap.md).

## Cómo Utilizar Esta Documentación

Esta documentación está diseñada para ser consultada por diferentes personas involucradas en el proyecto:

- **Desarrolladores**: Consultar principalmente la documentación de arquitectura, técnica y la documentación de [API Endpoints](./technical/api_endpoints.md).
- **Diseñadores**: Revisar las historias de usuario y criterios de aceptación.
- **Gerentes de Proyecto**: Utilizar el [Plan de Implementación](./technical/plan_implementacion.md) y el [Roadmap Técnico](./technical/roadmap.md).
- **Testers**: Enfocarse en los criterios de aceptación, casos de uso y endpoints de API.

Se recomienda comenzar con el [Estado Actual del Proyecto](./technical/estado_actual.md) para obtener una visión general del progreso actual.

## Actualización de la Documentación

Esta documentación debe actualizarse regularmente a medida que el proyecto evoluciona. Cualquier cambio significativo en el código debe reflejarse en los documentos correspondientes.

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