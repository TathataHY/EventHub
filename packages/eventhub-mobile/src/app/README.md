# Configuración Global de la Aplicación

Este directorio contiene la configuración global y los componentes principales que definen la estructura base de la aplicación.

## Propósito

La carpeta `app` dentro de `src` se encarga de:

1. Proveer la configuración global de la aplicación
2. Definir los proveedores principales (ThemeProvider, AppProvider, etc.)
3. Establecer la estructura base de navegación
4. Centralizar las exportaciones de componentes principales

## Estructura

```
app/
├── AppProvider.tsx     # Proveedor principal que combina todos los proveedores
├── AppLayout.tsx      # Layout principal de la aplicación
└── index.ts          # Exportaciones centralizadas
```

## Uso

Los componentes y proveedores de esta carpeta son utilizados principalmente por:

1. El layout principal de la aplicación (`app/_layout.tsx`)
2. Los layouts específicos de cada sección
3. Otros módulos que requieren acceso a la configuración global

## Ejemplo de uso

```tsx
// En app/_layout.tsx
import { AppProvider } from '../src/app';

export default function RootLayout() {
  return (
    <AppProvider>
      {/* Contenido de la aplicación */}
    </AppProvider>
  );
}
```

## Notas importantes

- Este módulo NO debe contener lógica de negocio específica
- Debe mantenerse lo más ligero posible
- Solo debe exportar componentes y configuraciones esenciales
- La lógica específica debe estar en los módulos correspondientes 