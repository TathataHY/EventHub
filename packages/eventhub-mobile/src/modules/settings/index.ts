import { SettingsScreen } from './components/SettingsScreen';

export { SettingsScreen };

export interface SettingsOption {
  key: string;
  title: string;
  description?: string;
  icon?: string;
  route?: string;
}

export const SETTING_CATEGORIES = {
  ACCOUNT: 'account',
  NOTIFICATIONS: 'notifications',
  PRIVACY: 'privacy',
  APPEARANCE: 'appearance',
  SUPPORT: 'support'
}; 