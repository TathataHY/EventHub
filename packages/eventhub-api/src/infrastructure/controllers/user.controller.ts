import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Request
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';
import {
  CreateUserUseCase,
  GetUserByIdUseCase,
  UpdateUserUseCase,
  CreateUserDto,
  UpdateUserDto,
  UserDto
} from 'eventhub-application';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';

@ApiTags('Usuarios')
@Controller('api/users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase
  ) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Usuario creado exitosamente',
    type: UserDto
  })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.createUserUseCase.execute(createUserDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener información del usuario actual' })
  @ApiResponse({ 
    status: 200, 
    description: 'Información del usuario',
    type: UserDto
  })
  async getCurrentUser(@Request() req) {
    return await this.getUserByIdUseCase.execute(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener información de un usuario por ID' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario encontrado',
    type: UserDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Usuario no encontrado' 
  })
  async getUserById(@Param('id') id: string) {
    return await this.getUserByIdUseCase.execute(id);
  }

  @Put('me')
  @ApiOperation({ summary: 'Actualizar información del usuario actual' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Usuario actualizado',
    type: UserDto
  })
  async updateCurrentUser(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return await this.updateUserUseCase.execute(req.user.id, updateUserDto);
  }
} 