import { z } from 'zod';

/**
 * Esquema para validar variables de entorno con Zod
 * Proporciona valores por defecto para desarrollo
 */
export const envSchema = z.object({
  // Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().transform(val => parseInt(val, 10)).default('3306'),
  DB_USERNAME: z.string().default('root'),
  DB_PASSWORD: z.string().default('password'),
  DB_NAME: z.string().default('eventhub'),
  
  // JWT
  JWT_SECRET: z.string().min(32).default('tu_clave_secreta_debe_tener_al_menos_32_caracteres'),
  JWT_EXPIRES_IN: z.string().default('24h'),
  
  // Server
  PORT: z.string().transform(val => parseInt(val, 10)).default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

/**
 * Tipo generado a partir del esquema de validación
 */
export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Valida y retorna las variables de entorno validadas
 */
export function validateEnv(): EnvConfig {
  return envSchema.parse(process.env);
} 