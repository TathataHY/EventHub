import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * Servicio para manejar operaciones relacionadas con contraseñas
 */
@Injectable()
export class PasswordService {
  /**
   * Genera un hash a partir de una contraseña en texto plano
   * @param password La contraseña en texto plano
   * @returns La contraseña hasheada
   */
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  /**
   * Compara una contraseña en texto plano con un hash
   * @param password La contraseña en texto plano
   * @param hashedPassword El hash de contraseña almacenado
   * @returns Booleano indicando si la contraseña coincide
   */
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
} 