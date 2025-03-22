// Interfaces para autenticación
export interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  role: string;
  createdAt: string;
}

// Interfaz para el perfil extendido del usuario
export interface UserProfile extends User {
  avatarUrl?: string;
  nombre?: string;
  eventosCreados?: any[];
  eventosAsistidos?: any[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
} 