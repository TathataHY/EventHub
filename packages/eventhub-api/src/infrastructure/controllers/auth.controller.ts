import { 
  Body, 
  Controller, 
  HttpException, 
  HttpStatus, 
  Post,
  UseGuards,
  Get,
  HttpCode
} from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiTags, 
  ApiBody,
  ApiBearerAuth
} from '@nestjs/swagger';
import { LoginUseCase, LoginDto, UserDto } from 'eventhub-application';
import { JwtService } from '../services/jwt.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';

/**
 * Controlador para operaciones de autenticación
 */
@ApiTags('Autenticación')
@Controller('auth')
@UseGuards(JwtAuthGuard) // Aplicar autenticación a todas las rutas por defecto
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Endpoint para iniciar sesión
   * @param loginDto Datos de inicio de sesión
   * @returns Token JWT y datos del usuario
   */
  @Post('login')
  @Public() // No requiere autenticación
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión en el sistema' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inicio de sesión exitoso',
    schema: {
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: '123e4567-e89b-12d3-a456-426614174000' },
            name: { type: 'string', example: 'Juan Pérez' },
            email: { type: 'string', example: 'juan@ejemplo.com' },
            role: { type: 'string', example: 'USER' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas'
  })
  async login(@Body() loginDto: LoginDto) {
    return this.loginUseCase.execute(loginDto);
  }

  /**
   * Endpoint para verificar el perfil del usuario autenticado
   * @param user Usuario actual obtenido del token JWT
   * @returns Datos del usuario autenticado
   */
  @Post('profile')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener el perfil del usuario autenticado' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Perfil del usuario',
    type: UserDto
  })
  getProfile(@CurrentUser() user: any) {
    return user;
  }
} 