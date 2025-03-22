import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  NotFoundException, 
  BadRequestException 
} from '@nestjs/common';
import { 
  CreateCategoryUseCase,
  GetCategoriesUseCase,
  CategoryDto,
  CreateCategoryParams
} from 'eventhub-application';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { 
  ApiTags, 
  ApiOperation, 
  ApiParam, 
  ApiResponse, 
  ApiBearerAuth 
} from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly getCategoriesUseCase: GetCategoriesUseCase
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear una nueva categoría (solo admin)' })
  @ApiResponse({ status: 201, description: 'Categoría creada correctamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido' })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryParams
  ): Promise<CategoryDto> {
    try {
      return await this.createCategoryUseCase.execute(createCategoryDto);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Lista de categorías obtenida correctamente' })
  async getCategories(): Promise<CategoryDto[]> {
    return await this.getCategoriesUseCase.execute();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por su ID' })
  @ApiParam({ name: 'id', description: 'ID de la categoría' })
  @ApiResponse({ status: 200, description: 'Categoría obtenida correctamente' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async getCategory(
    @Param('id') id: string
  ): Promise<CategoryDto> {
    const category = await this.getCategoriesUseCase.getCategory(id);
    if (!category) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return category;
  }

  @Public()
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Obtener una categoría por su slug' })
  @ApiParam({ name: 'slug', description: 'Slug de la categoría' })
  @ApiResponse({ status: 200, description: 'Categoría obtenida correctamente' })
  @ApiResponse({ status: 404, description: 'Categoría no encontrada' })
  async getCategoryBySlug(
    @Param('slug') slug: string
  ): Promise<CategoryDto> {
    const category = await this.getCategoriesUseCase.getCategoryBySlug(slug);
    if (!category) {
      throw new NotFoundException(`Categoría con slug "${slug}" no encontrada`);
    }
    return category;
  }
} 