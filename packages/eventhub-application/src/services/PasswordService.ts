import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 10;

  /**
   * Genera un hash a partir de una contraseña en texto plano
   * @param password Contraseña en texto plano
   * @returns Contraseña hasheada
   */
  async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Verifica si una contraseña en texto plano coincide con un hash
   * @param plainTextPassword Contraseña en texto plano
   * @param hashedPassword Contraseña hasheada
   * @returns true si coinciden, false en caso contrario
   */
  async compare(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
} 