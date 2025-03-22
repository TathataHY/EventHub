# Configuración Global de la Aplicación

Este directorio contiene la configuración global y los componentes principales que definen la estructura base de la aplicación.

## Propósito

La carpeta `app` dentro de `src` se encarga de:

1. Proveer la configuración global de la aplicación
2. Definir los proveedores principales (ThemeProvider, AppProvider, etc.)

## Estructura Actual y Problemas Detectados

Actualmente existe cierta duplicación entre este directorio y otras partes de la aplicación:

```
app/
├── AppProvider.tsx     # Proveedor principal que combina todos los proveedores
├── AppLayout.tsx       # Layout principal de la aplicación (duplicado con RootLayout)
└── index.ts           # Exportaciones centralizadas
```

Se ha detectado duplicación con:
- `src/modules/navigation/components/RootLayout.tsx` (similar a AppLayout.tsx)
- `src/core/providers/RootLayoutProvider.tsx` (similar a AppProvider.tsx)

Además, existe una referencia circular:
- `app/_layout.tsx` → `RootLayoutProvider` → `RootLayout` → `AppProvider`

## Propuesta de Mejora

Se sugiere consolidar estos componentes:

1. Mantener solo `AppProvider.tsx` en esta carpeta y eliminar `AppLayout.tsx`
2. Usar `RootLayout` desde `modules/navigation` como la definición única del layout
3. Reorganizar los imports para evitar referencias circulares

## Uso Recomendado

Una vez resueltos los problemas, el uso recomendado sería:

```tsx
// En app/_layout.tsx
import { RootLayoutProvider } from '../src/core/providers';

export default function RootLayout() {
  return <RootLayoutProvider />;
}
```

## Notas importantes

- Este módulo NO debe contener lógica de negocio específica
- Debe mantenerse lo más ligero posible
- Solo debe exportar componentes y configuraciones esenciales
- La lógica específica debe estar en los módulos correspondientes 