// Core - contiene interfaces y clases base reutilizables
export * from './core';

// Importamos los módulos para evitar colisiones de nombres
import * as tickets from './tickets';
import * as reviews from './reviews';
import * as users from './users';
import * as events from './events';
import * as payments from './payments';
import * as categories from './categories';
import * as organizers from './organizers';
import * as locations from './locations';
import * as groups from './groups';
import * as eventTypes from './event-types';
import * as auth from './auth';
import * as attendances from './attendances';
import * as statistics from './statistics';
import * as media from './media';
import * as notifications from './notifications';
import * as notificationTemplates from './notification-templates';

// Exportamos los módulos como namespaces para evitar conflictos de nombres
export {
  tickets,
  reviews,
  users,
  events,
  payments,
  categories,
  organizers,
  locations,
  groups,
  eventTypes,
  auth,
  attendances,
  statistics,
  media,
  notifications,
  notificationTemplates
}; 