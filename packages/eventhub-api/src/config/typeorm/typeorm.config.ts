import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

/**
 * Configuración de conexión a base de datos para TypeORM
 * 
 * @param configService Servicio de configuración para obtener variables de entorno
 * @returns Opciones de configuración para el módulo TypeORM
 */
export function getTypeOrmConfig(configService: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 3306),
    username: configService.get('DB_USERNAME', 'root'),
    password: configService.get('DB_PASSWORD', 'root'),
    database: configService.get('DB_NAME', 'eventhub'),
    entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
    autoLoadEntities: true,
    synchronize: configService.get('DB_SYNC', 'false') === 'true',
    logging: configService.get('DB_LOGGING', 'false') === 'true',
    migrations: [join(__dirname, '../../migrations/**/*{.ts,.js}')],
    migrationsRun: true,
  };
}

/**
 * Configuración para entorno de pruebas
 * 
 * @returns Opciones de configuración para el módulo TypeORM en entorno de pruebas
 */
export const testTypeOrmConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:',
  entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
  synchronize: true,
  dropSchema: true,
  logging: false,
}; 