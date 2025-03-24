// export * from './components';

// En vez de exportar componentes que no existen, exportamos un objeto vacío
// para evitar errores de compilación, hasta que los componentes reales sean creados
export const socialComponents = {};

// También podríamos exportar tipos básicos
export interface SocialProfile {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  followers: number;
  following: number;
}

// Constantes de ejemplo
export const SOCIAL_ACTIONS = {
  FOLLOW: 'follow',
  UNFOLLOW: 'unfollow',
  BLOCK: 'block',
  REPORT: 'report'
};
