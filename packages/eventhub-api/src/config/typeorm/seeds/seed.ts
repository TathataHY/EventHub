import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { Repository } from 'typeorm';
import { PasswordService } from '../../../common/services/password.service';
import { Logger } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';

// Simulación de la entidad User para el seed
class UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Enum de roles simulado
enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  ORGANIZER = 'ORGANIZER'
}

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
    // Nota: Obtenemos el repositorio directamente
    const userRepository = app.get<Repository<UserEntity>>(getRepositoryToken(UserEntity));
    const passwordService = app.get(PasswordService);
    
    // Verificar si ya existe un administrador
    const existingAdmin = await userRepository.findOne({ 
      where: { email: 'admin@eventhub.com' } 
    });
    
    if (!existingAdmin) {
      logger.log('Creando usuario administrador...');
      
      // Generar un ID único para el usuario
      const id = Math.random().toString(36).substring(2, 15) + 
                 Math.random().toString(36).substring(2, 15);
      
      // Crear contraseña hasheada
      const hashedPassword = await passwordService.hash('admin123');
      
      // Crear usuario administrador
      const adminUser = userRepository.create({
        id,
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