// Exportaciones de la capa de infraestructura
// Aquí se exportarán implementaciones de repositorios, servicios externos, etc.

// Entidades
export { EventEntity } from './entities/typeorm/EventEntity';
export { UserEntity } from './entities/typeorm/UserEntity';
export { NotificationEntity } from './entities/typeorm/NotificationEntity';
export { NotificationPreferenceEntity } from './entities/typeorm/NotificationPreferenceEntity';

// Repositorios en memoria (para desarrollo/testing)
export { EventRepositoryImpl } from './repositories/in-memory/EventRepositoryImpl';
export { UserRepositoryImpl } from './repositories/in-memory/UserRepositoryImpl';
export { NotificationRepositoryImpl } from './repositories/in-memory/NotificationRepositoryImpl';
export { NotificationPreferenceRepositoryImpl } from './repositories/in-memory/NotificationPreferenceRepositoryImpl';

// Repositorios con TypeORM (para producción)
export { TypeOrmEventRepository } from './repositories/typeorm/TypeOrmEventRepository';
export { TypeOrmUserRepository } from './repositories/typeorm/TypeOrmUserRepository';
export { TypeOrmNotificationRepository } from './repositories/typeorm/TypeOrmNotificationRepository';
export { TypeOrmNotificationPreferenceRepository } from './repositories/typeorm/TypeOrmNotificationPreferenceRepository';

export {}; // Exportación vacía por ahora 