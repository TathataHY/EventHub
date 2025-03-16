import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * Servicio para encriptar y comparar contraseñas
 */
@Injectable()
export class PasswordService {
  /**
   * Número de rondas para el algoritmo de hash
   */
  private readonly SALT_ROUNDS = 10;

  /**
   * Genera un hash de la contraseña
   * @param password Contraseña en texto plano
   * @returns Hash de la contraseña
   */
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  /**
   * Verifica si una contraseña coincide con su hash
   * @param password Contraseña en texto plano
   * @param hash Hash almacenado
   * @returns true si coinciden, false si no
   */
  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
} 