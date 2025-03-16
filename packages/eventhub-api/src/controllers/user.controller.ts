import { 
  Body, 
  Controller, 
  Get, 
  HttpException, 
  HttpStatus, 
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
  UserDto 
} from 'eventhub-application';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

@ApiTags('usuarios')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario creado', type: UserDto })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiBody({ type: CreateUserDto })
  async createUser(
    @Body() createUserDto: CreateUserDto
  ): Promise<UserDto> {
    try {
      return await this.createUserUseCase.execute(createUserDto);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al crear el usuario',
        HttpStatus.BAD_REQUEST
      );
    }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener datos del usuario actual' })
  @ApiResponse({ status: 200, description: 'Datos del usuario' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async getCurrentUser(
    @User() user: JwtPayload
  ): Promise<UserDto> {
    try {
      return await this.getUserByIdUseCase.execute(user.id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al obtener el usuario',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiParam({ name: 'id', type: String })
  async getUserById(
    @Param('id') id: string
  ): Promise<UserDto> {
    try {
      return await this.getUserByIdUseCase.execute(id);
    } catch (error) {
      throw new HttpException(
        error.message || 'Usuario no encontrado',
        HttpStatus.NOT_FOUND
      );
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Actualizar usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado', type: UserDto })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateUserDto })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: JwtPayload
  ): Promise<UserDto> {
    try {
      // Verificar que el usuario esté actualizando su propio perfil o sea admin
      if (id !== user.id && user.role !== 'ADMIN') {
        throw new Error('No tienes permisos para actualizar este usuario');
      }

      return await this.updateUserUseCase.execute(id, updateUserDto);
    } catch (error) {
      if (error.message.includes('no encontrado')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      if (error.message.includes('permisos')) {
        throw new HttpException(error.message, HttpStatus.FORBIDDEN);
      }
      throw new HttpException(
        error.message || 'Error al actualizar el usuario',
        HttpStatus.BAD_REQUEST
      );
    }
  }
} 