# Proveedores de la Aplicación

Esta carpeta contiene los proveedores de contexto y configuración para toda la aplicación.

## Estructura

- `RootLayoutProvider.tsx`: Proveedor principal que combina todos los proveedores necesarios y establece la estructura de diseño raíz de la aplicación. Este proveedor envuelve toda la aplicación y proporciona:
  - Gestión de gestos (GestureHandlerRootView)
  - Tema de la aplicación (ThemeProvider)
  - Áreas seguras (SafeAreaProvider)
  - Barra de estado (StatusBar)
  - Diseño de navegación raíz (RootLayout)

- `index.ts`: Archivo que exporta todos los proveedores para facilitar su importación.

## Uso

El `RootLayoutProvider` se utiliza en el archivo `_layout.tsx` principal de la aplicación para envolver toda la aplicación con la configuración y proveedores necesarios:

```tsx
import { RootLayoutProvider } from '../src/core/providers';

export default function Layout() {
  return <RootLayoutProvider />;
}
```

## Cambios Recientes

Se ha consolidado toda la funcionalidad de proveedores en `RootLayoutProvider`:

1. **Eliminación de AppLayout.tsx**: La funcionalidad de este componente ha sido transferida completamente a `RootLayout` en el módulo de navegación.

2. **Consolidación de Proveedores**: Todos los proveedores ahora se encuentran en `RootLayoutProvider` en lugar de estar distribuidos entre diferentes componentes.

3. **Eliminación de Referencias Circulares**: Se han eliminado las referencias circulares entre módulos (app, core, navigation).

## Propósito

Esta estructura modular permite:

1. Separar los proveedores de la lógica de navegación
2. Facilitar las pruebas unitarias
3. Mejorar la organización del código
4. Permitir la reutilización de proveedores en diferentes partes de la aplicación 