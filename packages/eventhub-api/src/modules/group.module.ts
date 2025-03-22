import { Module } from '@nestjs/common';
import { GroupController } from '../../controllers/GroupController';

/**
 * Módulo para la gestión de grupos
 */
@Module({
  controllers: [GroupController],
  providers: [],
})
export class GroupModule {} 