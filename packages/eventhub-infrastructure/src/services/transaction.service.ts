import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager, QueryRunner } from 'typeorm';

/**
 * Servicio para gestionar transacciones en TypeORM
 */
@Injectable()
export class TransactionService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * Ejecuta una función dentro de una transacción
   * @param operation Función a ejecutar dentro de la transacción
   * @returns El resultado de la operación
   */
  async executeInTransaction<T>(operation: (entityManager: EntityManager) => Promise<T>): Promise<T> {
    // Obtener un QueryRunner desde la conexión
    const queryRunner = this.dataSource.createQueryRunner();
    
    // Conectar y comenzar la transacción
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      // Ejecutar la operación pasando el manager de la transacción
      const result = await operation(queryRunner.manager);
      
      // Si todo salió bien, confirmar la transacción
      await queryRunner.commitTransaction();
      
      return result;
    } catch (error) {
      // Si ocurrió algún error, revertir los cambios
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Siempre liberar el queryRunner al finalizar
      await queryRunner.release();
    }
  }

  /**
   * Ejecuta varias operaciones en serie dentro de una misma transacción
   * @param operations Array de funciones a ejecutar en orden
   * @returns Array con los resultados de cada operación
   */
  async executeSerialOperations<T>(
    operations: Array<(entityManager: EntityManager) => Promise<T>>
  ): Promise<T[]> {
    return this.executeInTransaction(async (entityManager) => {
      const results: T[] = [];
      
      for (const operation of operations) {
        const result = await operation(entityManager);
        results.push(result);
      }
      
      return results;
    });
  }

  /**
   * Obtiene un QueryRunner para gestionar manualmente una transacción
   * (para casos más complejos)
   * @returns QueryRunner de TypeORM
   */
  getQueryRunner(): QueryRunner {
    return this.dataSource.createQueryRunner();
  }
} 