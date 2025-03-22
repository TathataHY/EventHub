/**
 * Interfaz que define la estructura del payload de JWT
 */
export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
  userId?: string; // Alias para 'id' para mantener compatibilidad
} 