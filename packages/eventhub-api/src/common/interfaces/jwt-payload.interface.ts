/**
 * Interfaz para representar la carga útil del token JWT
 */
export interface JwtPayload {
  id: string;
  name: string;
  email: string;
  role: string;
} 