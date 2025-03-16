# Resumen de la Documentación - EventHub

Este documento proporciona un resumen de toda la documentación disponible para el proyecto EventHub, detallando la organización de las carpetas y el propósito de cada documento.

## Estructura General

La documentación del proyecto está organizada en una estructura jerárquica para facilitar la navegación y comprensión:

```
docs/
│
├── architecture/          // Documentación arquitectónica
│   ├── clean_architecture.md
│   ├── diagramas_arquitectura.md
│   └── diseno_general.md
│
├── requirements/          // Requisitos y análisis
│   ├── acceptance/        // Criterios de aceptación
│   │   └── criterios_aceptacion.md
│   │
│   ├── altornivel/        // Requerimientos de alto nivel
│   │   └── requerimientos.md
│   │
│   ├── flows/             // Diagramas de flujo
│   │   ├── flujos_procesos.md
│   │   └── instrucciones_plantuml.md
│   │
│   ├── usecases/          // Casos de uso
│   │   └── casos_uso.md
│   │
│   └── userstories/       // Historias de usuario
│       └── historias_usuario.md
│
├── technical/             // Documentación técnica
│   ├── esquema_basedatos.md
│   └── plan_implementacion.md
│
├── user/                  // Documentación para usuarios
│   └── guia_usuario.md
│
└── README.md              // Índice principal de la documentación
```

## Documentos por Categoría

### Arquitectura

1. **clean_architecture.md**: Explica cómo se implementa Clean Architecture en el proyecto, detallando las diferentes capas y sus responsabilidades. Incluye la estructura del monorepo y cómo se organizan las capas en los diferentes paquetes (`eventhub-api`, `eventhub-mobile`, `eventhub-shared`).

2. **diagramas_arquitectura.md**: Contiene diagramas visuales de la arquitectura del sistema, incluyendo diagramas del monorepo, Clean Architecture, flujo de datos, navegación con Expo Router y modelo de datos.

3. **diseno_general.md**: Describe el diseño general del sistema, incluyendo la estructura del monorepo, tecnologías utilizadas (NestJS, Expo, MySQL), y la organización de Expo Router para la navegación basada en archivos.

### Requisitos

#### Requerimientos de Alto Nivel

1. **requerimientos.md**: Lista detallada de todos los requerimientos funcionales y no funcionales del sistema, organizados por módulos y prioridad.

#### Casos de Uso

1. **casos_uso.md**: Descripción detallada de los principales casos de uso del sistema, organizados en módulos funcionales. Incluye actores, precondiciones, flujos principales y alternativos, y postcondiciones.

#### Flujos de Procesos

1. **flujos_procesos.md**: Diagramas de flujo que representan los principales procesos del sistema utilizando PlantUML, incluyendo registro, gestión de eventos, búsqueda, pagos, etc. Los diagramas están en formato de código para facilitar su mantenimiento y evolución.

2. **instrucciones_plantuml.md**: Guía completa para visualizar, editar y generar los diagramas de flujo utilizando PlantUML. Incluye instrucciones de instalación, uso de herramientas online y mejores prácticas.

#### Historias de Usuario

1. **historias_usuario.md**: Historias de usuario en formato "Como [rol], quiero [objetivo], para [beneficio]", con criterios de aceptación detallados para cada una.

#### Criterios de Aceptación

1. **criterios_aceptacion.md**: Criterios de aceptación generales agrupados por área funcional, incluyendo interfaz de usuario, funcionalidades, rendimiento, seguridad, etc.

### Documentación Técnica

1. **esquema_basedatos.md**: Documentación del esquema de la base de datos MySQL, incluyendo tablas, relaciones, índices y consideraciones importantes.

2. **plan_implementacion.md**: Plan detallado para la implementación del proyecto, incluyendo la estructura del monorepo, tecnologías específicas (Expo Router, NestJS, TypeORM con MySQL), fases de implementación, y cronograma detallado. Incluye diagramas del stack tecnológico y la organización de carpetas para ambos proyectos.

### Documentación para Usuarios

1. **guia_usuario.md**: Guía completa para los usuarios finales, explicando cómo usar las diferentes funcionalidades de la aplicación.

## Estructura del Proyecto (Monorepo)

El proyecto está organizado como un monorepo usando Yarn Workspaces, con la siguiente estructura:

```
EventHub/
├── packages/                      # Directorio de paquetes del monorepo
│   ├── eventhub-shared/           # Tipos y modelos compartidos
│   ├── eventhub-api/              # Backend (NestJS con Clean Architecture)
│   └── eventhub-mobile/           # Frontend móvil (React Native/Expo)
├── docs/                          # Documentación
└── bitbucket-pipelines.yml        # Configuración de CI/CD
```

## Uso de la Documentación

Esta documentación está diseñada para ser consultada por diferentes personas involucradas en el proyecto:

- **Desarrolladores**: Deben revisar principalmente la documentación de arquitectura y técnica para implementar correctamente las funcionalidades. Los diagramas PlantUML son especialmente útiles para entender los flujos de proceso. La documentación de Clean Architecture es esencial para entender la estructura del código.

- **Diseñadores**: Pueden consultar las historias de usuario y criterios de aceptación para entender mejor las necesidades de la interfaz.

- **Gerentes de Proyecto**: El plan de implementación y los requerimientos de alto nivel son especialmente relevantes.

- **Testers**: Los criterios de aceptación y casos de uso son esenciales para crear casos de prueba efectivos. Los diagramas de flujo en PlantUML ayudan a identificar escenarios de prueba.

- **DevOps**: La documentación del monorepo y de CI/CD es crucial para configurar correctamente los entornos de desarrollo, prueba y producción.

- **Usuarios Finales**: La guía de usuario está específicamente diseñada para ellos.

## Actualización de la Documentación

Esta documentación debe actualizarse regularmente a medida que el proyecto evoluciona:

1. Cualquier cambio en los requerimientos debe reflejarse en los documentos correspondientes.

2. Los desarrolladores deben actualizar la documentación técnica cuando implementen cambios significativos.

3. Los diagramas de flujo deben actualizarse cuando se modifiquen los procesos, aprovechando la facilidad de mantenimiento que ofrece PlantUML.

4. Cuando se modifique la estructura del monorepo o se añadan nuevos paquetes, los documentos de arquitectura y el plan de implementación deben actualizarse.

5. El índice principal (README.md) debe actualizarse cuando se agreguen nuevos documentos.

6. Todos los documentos deben seguir el formato Markdown y las convenciones de nombrado establecidas. 