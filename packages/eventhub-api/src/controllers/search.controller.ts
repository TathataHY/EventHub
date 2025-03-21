import { 
  Controller, 
  Get, 
  Query, 
  ParseIntPipe, 
  DefaultValuePipe, 
  BadRequestException 
} from '@nestjs/common';
import { 
  SearchEventsUseCase,
  EventSearchFilters,
  SearchEventsResult
} from 'eventhub-application';
import { 
  ApiTags, 
  ApiOperation, 
  ApiQuery, 
  ApiResponse 
} from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly searchEventsUseCase: SearchEventsUseCase
  ) {}

  @Public()
  @Get('events')
  @ApiOperation({ summary: 'Buscar eventos con filtros avanzados' })
  @ApiQuery({ name: 'query', required: false, description: 'Términos de búsqueda (título o descripción)' })
  @ApiQuery({ name: 'location', required: false, description: 'Ubicación del evento' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Fecha de inicio mínima (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'Fecha de fin máxima (YYYY-MM-DD)' })
  @ApiQuery({ name: 'minPrice', required: false, description: 'Precio mínimo' })
  @ApiQuery({ name: 'maxPrice', required: false, description: 'Precio máximo' })
  @ApiQuery({ name: 'categories', required: false, description: 'IDs de categorías (separados por coma)' })
  @ApiQuery({ name: 'sort', required: false, description: 'Campo para ordenar (date, price, popularity, rating)' })
  @ApiQuery({ name: 'order', required: false, description: 'Dirección de ordenación (asc, desc)' })
  @ApiQuery({ name: 'page', required: false, description: 'Número de página', type: Number })
  @ApiQuery({ name: 'limit', required: false, description: 'Elementos por página', type: Number })
  @ApiResponse({ status: 200, description: 'Búsqueda realizada exitosamente' })
  @ApiResponse({ status: 400, description: 'Parámetros de búsqueda inválidos' })
  async searchEvents(
    @Query('query') query?: string,
    @Query('location') location?: string,
    @Query('startDate') startDateStr?: string,
    @Query('endDate') endDateStr?: string,
    @Query('minPrice', new DefaultValuePipe(0), ParseIntPipe) minPrice?: number,
    @Query('maxPrice') maxPrice?: string,
    @Query('categories') categoriesStr?: string,
    @Query('organizer') organizerId?: string,
    @Query('sort') sort?: 'date' | 'price' | 'popularity' | 'rating',
    @Query('order') order?: 'asc' | 'desc',
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<SearchEventsResult> {
    try {
      // Procesar y validar fechas
      let startDate: Date | undefined;
      let endDate: Date | undefined;
      
      if (startDateStr) {
        startDate = new Date(startDateStr);
        if (isNaN(startDate.getTime())) {
          throw new BadRequestException('La fecha de inicio no es válida. Use el formato YYYY-MM-DD');
        }
      }
      
      if (endDateStr) {
        endDate = new Date(endDateStr);
        if (isNaN(endDate.getTime())) {
          throw new BadRequestException('La fecha de fin no es válida. Use el formato YYYY-MM-DD');
        }
      }

      // Procesar categorías
      let categories: string[] | undefined;
      if (categoriesStr) {
        categories = categoriesStr.split(',').map(id => id.trim());
      }

      // Procesar precio máximo
      let maxPriceNum: number | undefined;
      if (maxPrice) {
        maxPriceNum = parseInt(maxPrice, 10);
        if (isNaN(maxPriceNum)) {
          throw new BadRequestException('El precio máximo debe ser un número');
        }
      }

      // Calcular offset para paginación
      const offset = (page - 1) * limit;

      // Construir filtros
      const filters: EventSearchFilters = {
        query,
        location,
        startDate,
        endDate,
        minPrice: minPrice || undefined,
        maxPrice: maxPriceNum,
        organizerId,
        categories,
        limit,
        offset,
        sort,
        order,
      };

      return await this.searchEventsUseCase.execute(filters);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error en los parámetros de búsqueda: ' + error.message);
    }
  }
} 