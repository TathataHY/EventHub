import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';

/**
 * Servicio para gestionar caché en la aplicación usando Redis
 */
@Injectable()
export class CacheService {
  private readonly redis: Redis.Redis;
  private readonly defaultTtl: number = 3600; // 1 hora en segundos

  constructor() {
    // Configuración desde variables de entorno
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
    
    // Crear cliente Redis
    this.redis = new Redis({
      host: redisHost,
      port: redisPort,
      lazyConnect: true,
    });

    // Conectar al servidor Redis
    this.connect();
  }

  /**
   * Establece la conexión con Redis
   */
  private async connect(): Promise<void> {
    try {
      await this.redis.connect();
      console.log('Conexión a Redis establecida');
    } catch (error) {
      console.error('Error al conectar con Redis:', error);
    }
  }

  /**
   * Obtiene un valor de la caché
   * @param key Clave del valor en la caché
   * @returns Valor almacenado o null si no existe
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      
      if (!value) {
        return null;
      }
      
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error al obtener valor de caché (${key}):`, error);
      return null;
    }
  }

  /**
   * Almacena un valor en la caché
   * @param key Clave para almacenar el valor
   * @param value Valor a almacenar
   * @param ttl Tiempo de vida en segundos (opcional)
   */
  async set<T>(key: string, value: T, ttl: number = this.defaultTtl): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.setex(key, ttl, serializedValue);
    } catch (error) {
      console.error(`Error al almacenar valor en caché (${key}):`, error);
    }
  }

  /**
   * Elimina un valor de la caché
   * @param key Clave del valor a eliminar
   */
  async delete(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error(`Error al eliminar valor de caché (${key}):`, error);
    }
  }

  /**
   * Elimina valores que coinciden con un patrón
   * @param pattern Patrón para las claves a eliminar (ej: "user:*")
   */
  async deleteByPattern(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (error) {
      console.error(`Error al eliminar valores por patrón (${pattern}):`, error);
    }
  }

  /**
   * Obtiene un valor de la caché o lo calcula y almacena si no existe
   * @param key Clave del valor en la caché
   * @param factory Función que genera el valor si no existe en caché
   * @param ttl Tiempo de vida en segundos (opcional)
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    ttl: number = this.defaultTtl
  ): Promise<T> {
    // Intentar obtener de caché
    const cachedValue = await this.get<T>(key);
    
    // Si existe en caché, devolverlo
    if (cachedValue !== null) {
      return cachedValue;
    }
    
    // Si no existe, calcularlo
    const value = await factory();
    
    // Almacenar en caché
    await this.set(key, value, ttl);
    
    return value;
  }

  /**
   * Verifica si una clave existe en la caché
   * @param key Clave a verificar
   */
  async exists(key: string): Promise<boolean> {
    try {
      const exists = await this.redis.exists(key);
      return exists === 1;
    } catch (error) {
      console.error(`Error al verificar existencia en caché (${key}):`, error);
      return false;
    }
  }

  /**
   * Cierra la conexión con Redis
   */
  async close(): Promise<void> {
    await this.redis.quit();
  }
} 