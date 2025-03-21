/**
 * Genera un código de invitación aleatorio
 * @param length Longitud del código (por defecto 8 caracteres)
 * @returns Código de invitación alfanumérico
 */
export function generateInvitationCode(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  
  // Generar caracteres aleatorios
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  
  return code;
}

/**
 * Valida si un código de invitación tiene un formato válido
 * @param code Código a validar
 * @returns true si el código es válido, false en caso contrario
 */
export function isValidInvitationCode(code: string): boolean {
  if (!code || typeof code !== 'string') {
    return false;
  }
  
  // Verificar longitud
  if (code.length < 6 || code.length > 12) {
    return false;
  }
  
  // Verificar que solo contiene caracteres alfanuméricos
  const validFormat = /^[A-Z0-9]+$/.test(code);
  return validFormat;
} 