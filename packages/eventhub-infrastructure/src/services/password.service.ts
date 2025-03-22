import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * Servicio para manejo de contraseñas
 */
@Injectable()
export class PasswordService {
  private readonly saltRounds = 10;

  /**
   * Encripta una contraseña en texto plano
   * @param plainPassword Contraseña en texto plano
   * @returns Contraseña encriptada
   */
  async hash(plainPassword: string): Promise<string> {
    return bcrypt.hash(plainPassword, this.saltRounds);
  }

  /**
   * Compara una contraseña en texto plano con una encriptada
   * @param plainPassword Contraseña en texto plano
   * @param hashedPassword Contraseña encriptada
   * @returns true si la contraseña coincide
   */
  async compare(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
} 