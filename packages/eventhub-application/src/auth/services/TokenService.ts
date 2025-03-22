/**
 * Payload para el token de acceso
 */
export interface AccessTokenPayload {
  userId: string;
  email: string;
  role: string;
  [key: string]: any;
}

/**
 * Payload para el token de refresco
 */
export interface RefreshTokenPayload {
  userId: string;
  [key: string]: any;
}

/**
 * Interfaz para el servicio de tokens
 */
export interface TokenService {
  /**
   * Genera un token de acceso
   * @param payload Datos a incluir en el token
   * @returns Token generado
   */
  generateAccessToken(payload: AccessTokenPayload): string;

  /**
   * Genera un token de refresco
   * @param payload Datos a incluir en el token
   * @returns Token generado
   */
  generateRefreshToken(payload: RefreshTokenPayload): string;

  /**
   * Verifica un token de acceso
   * @param token Token a verificar
   * @returns Payload del token si es válido
   * @throws Error si el token es inválido
   */
  verifyAccessToken(token: string): AccessTokenPayload;

  /**
   * Verifica un token de refresco
   * @param token Token a verificar
   * @returns Payload del token si es válido
   * @throws Error si el token es inválido
   */
  verifyRefreshToken(token: string): RefreshTokenPayload;

  /**
   * Obtiene el tiempo de expiración del token de acceso en segundos
   * @returns Tiempo de expiración en segundos
   */
  getAccessTokenExpiresIn(): number;
} 