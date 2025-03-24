// Realizar exportaciones explícitas para prevenir ambigüedades
export { LoginScreen, RegisterScreen, useAuth, authService } from './auth';
export { EventsScreen, EventDetailsScreen } from './events';
export { SearchScreen } from './search';
export { UserProfileScreen } from './users';
export { HomeScreen } from './home';
export { NotificationsScreen } from './notifications';
export { MapScreen } from './map';
export { SettingsScreen } from './settings';
export { UserTicketsScreen } from './tickets';

// Exportar tipos explícitamente para evitar conflictos
export type { User } from './auth/types/auth.types';
export type { Event } from './events/types';
export type { Ticket } from './tickets/types'; 