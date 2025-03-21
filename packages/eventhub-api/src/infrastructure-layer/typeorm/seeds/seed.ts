import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../modules/app.module';
import { UserRepositoryImpl } from '../repositories/user.repository';
import { PasswordService } from '../../services/password.service';
import { User } from 'eventhub-domain';
import { Role } from 'eventhub-domain';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';

/**
 * Script para sembrar datos iniciales en la base de datos
 */
async function bootstrap() {
  const logger = new Logger('Seed');
  
  try {
    logger.log('Iniciando proceso de siembra de datos...');
    
    // Crear la aplicación NestJS
    const app = await NestFactory.create(AppModule);
    
    // Obtener servicios necesarios
    const userRepository = app.get(UserRepositoryImpl);
    const passwordService = app.get(PasswordService);
    
    // Verificar si ya existe un administrador
    const existingAdmin = await userRepository.findByEmail('admin@eventhub.com');
    
    if (!existingAdmin) {
      logger.log('Creando usuario administrador...');
      
      // Crear contraseña hasheada
      const hashedPassword = await passwordService.hash('admin123');
      
      // Crear usuario administrador
      const adminUser = new User({
        id: uuidv4(),
        name: 'Administrador',
        email: 'admin@eventhub.com',
        password: hashedPassword,
        role: Role.ADMIN,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      // Guardar usuario
      await userRepository.save(adminUser);
      logger.log('Usuario administrador creado con éxito');
    } else {
      logger.log('El usuario administrador ya existe, omitiendo creación');
    }
    
    logger.log('Datos sembrados con éxito');
    
    // Cerrar aplicación
    await app.close();
  } catch (error) {
    logger.error('Error al sembrar datos:', error.stack);
    process.exit(1);
  }
}

// Ejecutar el script
bootstrap(); 