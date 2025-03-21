# Estructura de la Aplicación EventHub Mobile

Este directorio contiene la estructura principal de la aplicación EventHub Mobile organizada de manera modular.

## Estructura de carpetas

```
eventhub-mobile/
├── app/                  # Carpeta Expo Router (páginas y rutas)
├── src/                  # Código fuente principal
│   ├── app/              # Configuración y componentes principales (punto de entrada)
│   ├── core/             # Funcionalidad central (servicios, navegación, etc.)
│   │   ├── api/          # Configuración y servicios de API
│   │   ├── context/      # Contextos globales (tema, autenticación, etc.)
│   │   ├── mocks/        # Datos de prueba
│   │   ├── navigation/   # Configuración de navegación
│   │   ├── services/     # Servicios compartidos 
│   │   └── storage/      # Almacenamiento local
│   ├── modules/          # Módulos funcionales de la aplicación
│   │   ├── auth/         # Autenticación
│   │   ├── events/       # Gestión de eventos
│   │   ├── users/        # Gestión de usuarios
│   │   └── ...           # Otros módulos
│   ├── shared/           # Componentes y utilidades compartidas
│   │   ├── components/   # Componentes UI reutilizables
│   │   ├── hooks/        # Hooks personalizados
│   │   ├── layouts/      # Layouts reutilizables
│   │   ├── forms/        # Componentes de formulario
│   │   ├── types/        # Interfaces y tipos
│   │   └── utils/        # Utilidades generales
│   └── theme/            # Configuración de estilos y tema
```

## Guía de organización

1. **app/**: Contiene los componentes principales y configuración central.
   - `AppProvider.tsx`: Proveedor global de contextos.
   - `AppLayout.tsx`: Estructura de navegación principal.

2. **modules/**: Cada módulo funcional debe estar autocontenido:
   - `components/`: Componentes específicos del módulo
   - `screens/`: Pantallas del módulo
   - `services/`: Servicios específicos del módulo
   - `hooks/`: Hooks específicos del módulo
   - `types/`: Tipos e interfaces del módulo

3. **shared/**: Componentes y utilidades compartidas entre módulos
   - Solo debe contener elementos reutilizables en múltiples módulos
   
4. **core/**: Funcionalidad central y servicios globales
   - Maneja operaciones fundamentales como autenticación, almacenamiento, etc.

## Buenas prácticas

1. **Modularidad**: Cada módulo debe ser independiente y autocontenido
2. **Reutilización**: Promover componentes compartidos en `shared/`
3. **Tipos**: Utilizar TypeScript para todas las definiciones de tipos
4. **Exportaciones**: Cada carpeta debe tener un `index.ts` que exporte sus componentes 