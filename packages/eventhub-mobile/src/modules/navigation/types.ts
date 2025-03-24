/**
 * Definiciones de tipos para la navegación en la aplicación
 */

// Tipo para las rutas de navegación principales
export type AppRoutes = {
  '(tabs)': undefined;
  'ProfileEdit': undefined;
  'CreateEvent': undefined;
  'Events': undefined;
  'auth/login': undefined;
  'auth/register': undefined;
  'map': undefined;
  'search': undefined;
};

// Exportar para uso en componentes
declare global {
  namespace ReactNavigation {
    interface RootParamList extends AppRoutes {}
  }
} 