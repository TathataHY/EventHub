// Exportaciones principales del módulo map
export { MapScreen } from './screens/MapScreen';

// Exportación de componentes
export { CategoryFilters } from './components/CategoryFilters';
export { EventMarker } from './components/EventMarker';

// Exportación de hooks
export { 
  useMapEvents, 
  useLocationServices, 
  useMapUtils 
} from './hooks';

// Exportación de tipos
export type { Event } from './hooks/useMapEvents'; 