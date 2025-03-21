import { 
  Body, 
  Controller, 
  Get, 
  Param, 
  Patch, 
  Post, 
  UseGuards 
} from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiTags, 
  ApiParam, 
  ApiBody 
} from '@nestjs/swagger';
import { 
  CreateUserDto, 
  CreateUserUseCase, 
  GetUserByIdUseCase,
  UpdateUserDto,
  UpdateUserUseCase,
  UserDto,
  UserMapper,
  DomainException,
  NotFoundException,
  ForbiddenException
} from 'eventhub-application';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';
import { Roles } from '../common/decorators/roles.decorator';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { Public } from '../common/decorators/public.decorator';
import { ExceptionHandlerService } from '../common/services/exception-handler.service';

// Definir el tipo ExtendedJwtPayload para corregir errores
interface ExtendedJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}

@ApiTags('usuarios')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly exceptionHandler: ExceptionHandlerService
  ) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado correctamente' })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiBody({ type: CreateUserDto })
  async createUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserDto> {
    try {
      const user = await this.createUserUseCase.execute(createUserDto);
      return user;
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al crear el usuario');
    }
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener perfil del usuario actual' })
  @ApiResponse({ status: 200, description: 'Perfil obtenido correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @UseGuards(JwtAuthGuard)
  async getCurrentUser(
    @User() user: ExtendedJwtPayload
  ): Promise<UserDto> {
    try {
      const userDto = await this.getUserByIdUseCase.execute(user.userId);
      
      if (!userDto) {
        throw new NotFoundException('Usuario', user.userId);
      }
      
      return userDto;
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al obtener el perfil');
    }
  }

  @Get(':id')
  @Roles('ADMIN')
  @RequirePermissions('users:view')
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario obtenido correctamente' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @UseGuards(JwtAuthGuard)
  async getUserById(
    @Param('id') id: string
  ): Promise<UserDto> {
    try {
      const user = await this.getUserByIdUseCase.execute(id);
      
      if (!user) {
        throw new NotFoundException('Usuario', id);
      }
      
      return user;
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al obtener el usuario');
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado', type: UserDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'No autorizado para actualizar este usuario' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: ExtendedJwtPayload
  ): Promise<UserDto> {
    try {
      // Verificar que el usuario esté actualizando su propio perfil o sea admin
      if (id !== user.userId && user.role !== 'ADMIN') {
        throw new ForbiddenException('No tienes permisos para actualizar este usuario');
      }

      return await this.updateUserUseCase.execute(id, updateUserDto);
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al actualizar el usuario');
    }
  }
} 