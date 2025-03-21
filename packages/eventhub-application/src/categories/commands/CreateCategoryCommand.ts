import { Command } from '../../core/interfaces/Command';
import { ValidationException, UnauthorizedException } from '../../core/exceptions';
import { CategoryRepository } from '@eventhub/domain/dist/categories/repositories/CategoryRepository';
import { UserRepository } from '@eventhub/domain/dist/users/repositories/UserRepository';
import { RoleEnum } from '@eventhub/domain/dist/users/value-objects/Role';

/**
 * Comando para crear una nueva categoría
 */
export class CreateCategoryCommand implements Command<string> {
  constructor(
    private readonly name: string,
    private readonly description: string,
    private readonly userId: string,
    private readonly categoryRepository: CategoryRepository,
    private readonly userRepository: UserRepository
  ) {}

  /**
   * Ejecuta el comando para crear una nueva categoría
   * @returns Promise<string> El ID de la categoría creada
   * @throws ValidationException si hay problemas de validación
   * @throws UnauthorizedException si el usuario no tiene permisos
   */
  async execute(): Promise<string> {
    // Validación básica
    if (!this.name || !this.name.trim()) {
      throw new ValidationException('El nombre de la categoría es requerido');
    }

    if (this.name.length < 2 || this.name.length > 50) {
      throw new ValidationException('El nombre debe tener entre 2 y 50 caracteres');
    }

    if (!this.userId) {
      throw new ValidationException('El ID de usuario es requerido');
    }

    // Verificar si la descripción supera el límite
    if (this.description && this.description.length > 200) {
      throw new ValidationException('La descripción no puede exceder los 200 caracteres');
    }

    // Verificar permisos de usuario (solo administradores pueden crear categorías)
    const user = await this.userRepository.findById(this.userId);
    
    if (!user) {
      throw new ValidationException('Usuario no encontrado');
    }

    if (user.role !== RoleEnum.ADMIN) {
      throw new UnauthorizedException('Solo los administradores pueden crear categorías');
    }

    // Verificar si ya existe una categoría con el mismo nombre
    const existingCategory = await this.categoryRepository.findByName(this.name.trim());
    
    if (existingCategory) {
      throw new ValidationException(`Ya existe una categoría con el nombre "${this.name}"`);
    }

    // Crear nueva categoría
    const newCategory = {
      name: this.name.trim(),
      description: this.description ? this.description.trim() : null,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: this.userId
    };

    // Guardar en el repositorio
    const categoryId = await this.categoryRepository.save(newCategory);

    return categoryId;
  }
} 