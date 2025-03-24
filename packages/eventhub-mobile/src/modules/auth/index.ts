/**
 * Módulo de Autenticación
 * 
 * Este módulo gestiona todo lo relacionado con la autenticación de usuarios,
 * incluyendo inicio de sesión, registro, recuperación de contraseña, etc.
 */

// Exportar componentes específicos en lugar de todo el módulo
export { LoginScreen } from './screens/LoginScreen';
export { RegisterScreen } from './screens/RegisterScreen';
export { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
export { ResetPasswordScreen } from './screens/ResetPasswordScreen';
export { WelcomeScreen } from './screens/WelcomeScreen';

// Exportar servicios específicos
export { authService } from './services/auth.service';

// Exportar hooks explícitamente
export { useAuth } from './hooks/useAuth';

// Exportar tipos explícitos para evitar duplicados
export type { 
  User, 
  UserProfile, 
  LoginCredentials, 
  RegisterData, 
  AuthResponse 
} from './types/auth.types';
