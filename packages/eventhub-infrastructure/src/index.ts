// Exportaciones de la capa de infraestructura
// Aquí se exportarán implementaciones de repositorios, servicios externos, etc.

// Entidades
export { EventEntity } from './entities/typeorm/EventEntity';
export { UserEntity } from './entities/typeorm/UserEntity';
export { NotificationEntity } from './entities/typeorm/NotificationEntity';
export { NotificationPreferenceEntity } from './entities/typeorm/NotificationPreferenceEntity';
export { CommentEntity } from './entities/typeorm/CommentEntity';
export { RatingEntity } from './entities/typeorm/RatingEntity';

// Repositorios en memoria (para desarrollo/testing)
export { EventRepositoryImpl } from './repositories/in-memory/EventRepositoryImpl';
export { UserRepositoryImpl } from './repositories/in-memory/UserRepositoryImpl';
export { NotificationRepositoryImpl } from './repositories/in-memory/NotificationRepositoryImpl';
export { NotificationPreferenceRepositoryImpl } from './repositories/in-memory/NotificationPreferenceRepositoryImpl';
export { CommentRepositoryImpl } from './repositories/in-memory/CommentRepositoryImpl';
export { RatingRepositoryImpl } from './repositories/in-memory/RatingRepositoryImpl';

// Repositorios con TypeORM (para producción)
export { TypeOrmEventRepository } from './repositories/typeorm/TypeOrmEventRepository';
export { TypeOrmUserRepository } from './repositories/typeorm/TypeOrmUserRepository';
export { TypeOrmNotificationRepository } from './repositories/typeorm/TypeOrmNotificationRepository';
export { TypeOrmNotificationPreferenceRepository } from './repositories/typeorm/TypeOrmNotificationPreferenceRepository';
export { TypeOrmCommentRepository } from './repositories/typeorm/TypeOrmCommentRepository';
export { TypeOrmRatingRepository } from './repositories/typeorm/TypeOrmRatingRepository';

// Servicios
export * from './services/transaction.service';
export * from './services/cache.service';
export * from './services/jwt.service';
export * from './services/password.service';
export * from './services/email.service';

// Repositorios
export * from './repositories/TypeOrmEventRepository';
export * from './repositories/TypeOrmUserRepository';
export * from './repositories/TypeOrmNotificationRepository';
export * from './repositories/TicketRepositoryTypeORM';
export * from './repositories/PaymentRepositoryTypeORM';
export * from './repositories/NotificationTemplateRepositoryTypeORM';
export * from './repositories/NotificationPreferenceRepositoryTypeORM';
export * from './repositories/comment.repository';
export * from './repositories/rating.repository';

// Repositorios en memoria (para pruebas)
export * from './repositories/in-memory/InMemoryTicketRepository';
export * from './repositories/InMemoryEventRepository';

// Entidades
export * from './entities/EventEntity';
export * from './entities/UserEntity';
export * from './entities/NotificationEntity';
export * from './entities/NotificationPreferenceEntity';
export * from './entities/NotificationTemplateEntity';
export * from './entities/PaymentEntity';
export * from './entities/TicketEntity';
export * from './entities/comment.entity';
export * from './entities/rating.entity';

// Mappers
export * from './mappers/EventMapper';
export * from './mappers/UserMapper';
export * from './mappers/NotificationMapper';

// Módulos
export * from './modules/user.module';
export * from './modules/auth.module';
export * from './modules/event.module';
export * from './modules/stripe.module';
export * from './modules/storage.module';
export * from './modules/email.module';
export * from './modules/comment.module';
export * from './modules/rating.module';
export * from './modules/notification.module';

// Repositorios
export * from './repositories/user.repository';
export * from './repositories/event.repository';
export * from './repositories/ticket.repository';
export * from './repositories/payment.repository';
export * from './repositories/notification.repository';
export * from './repositories/notification-preference.repository';

// Servicios
export * from './services/jwt.service';
export * from './services/bcrypt.service';
export * from './services/stripe.service';
export * from './services/webhook.service';
export * from './services/s3-storage.service';
export * from './services/nodemailer.service';
export * from './services/notification.service';

// Entidades
export * from './entities/user.entity';
export * from './entities/event.entity';
export * from './entities/ticket.entity';
export * from './entities/payment.entity';
export * from './entities/notification.entity';
export * from './entities/notification-preference.entity';

// Exportaciones principales de eventhub-infrastructure

// Módulos
export { AuthModule } from './modules/auth.module';
export { UserModule } from './modules/user.module';
export { EventModule } from './modules/event.module';
export { TicketModule } from './modules/ticket.module';
export { CommentModule } from './modules/comment.module';
export { RatingModule } from './modules/rating.module';
export { CategoryModule } from './modules/category.module';
export { PaymentModule } from './modules/payment.module';
export { StripeModule } from './modules/stripe.module';
export { StorageModule } from './modules/storage.module';
export { EmailModule } from './modules/email.module';
export { AnalyticsModule } from './modules/analytics.module';
export { NotificationModule } from './modules/notification.module';

// Entidades
export { UserEntity } from './entities/user.entity';
export { EventEntity } from './entities/event.entity';
export { TicketEntity } from './entities/ticket.entity';
export { CommentEntity } from './entities/comment.entity';
export { RatingEntity } from './entities/rating.entity';
export { CategoryEntity } from './entities/category.entity';
export { PaymentEntity } from './entities/payment.entity';
export { NotificationEntity } from './entities/notification.entity';
export { NotificationPreferenceEntity } from './entities/notification-preference.entity';

// Repositorios
export { TypeOrmUserRepository } from './repositories/user.repository';
export { TypeOrmEventRepository } from './repositories/event.repository';
export { TypeOrmTicketRepository } from './repositories/ticket.repository';
export { TypeOrmCommentRepository } from './repositories/comment.repository';
export { TypeOrmRatingRepository } from './repositories/rating.repository';
export { TypeOrmCategoryRepository } from './repositories/category.repository';
export { TypeOrmPaymentRepository } from './repositories/payment.repository';
export { TypeOrmNotificationRepository } from './repositories/notification.repository';
export { TypeOrmNotificationPreferenceRepository } from './repositories/notification-preference.repository';

// Servicios
export { JwtTokenService } from './services/jwt-token.service';
export { BcryptPasswordService } from './services/bcrypt-password.service';
export { S3StorageService } from './services/s3-storage.service';
export { NodemailerEmailService } from './services/nodemailer-email.service';
export { StripePaymentService } from './services/stripe-payment.service';
export { StripeWebhookService } from './services/stripe-webhook.service';
export { NotificationService } from './services/notification.service'; 