import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  LoginDto,
  LoginUseCase,
  RegisterDto,
  RegisterUseCase,
  ValidateTokenUseCase,
  ChangePasswordUseCase,
  ForgotPasswordUseCase,
  ResetPasswordUseCase,
} from 'eventhub-application';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { ExceptionHandlerService } from '../common/services/exception-handler.service';
import { JwtPayload } from '../common/interfaces/jwt-payload.interface';

// Definir el tipo ExtendedJwtPayload para corregir errores
interface ExtendedJwtPayload extends JwtPayload {
  userId: string;
  role: string;
}

// DTOs para Swagger
class SwaggerLoginDto {
  email: string;
  password: string;
}

class SwaggerRegisterDto {
  name: string;
  email: string;
  password: string;
}

class SwaggerChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

class SwaggerForgotPasswordDto {
  email: string;
}

class SwaggerResetPasswordDto {
  token: string;
  newPassword: string;
}

class SwaggerValidateTokenDto {
  token: string;
}

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly validateTokenUseCase: ValidateTokenUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly exceptionHandler: ExceptionHandlerService
  ) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: SwaggerLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso',
    schema: {
      properties: {
        token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.loginUseCase.execute(loginDto);
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al iniciar sesión');
    }
  }

  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: SwaggerRegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Usuario registrado exitosamente',
    schema: {
      properties: {
        token: { type: 'string' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async register(@Body() registerDto: RegisterDto) {
    try {
      return await this.registerUseCase.execute(registerDto);
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al registrar usuario');
    }
  }

  @Post('validate-token')
  @Public()
  @ApiOperation({ summary: 'Validar un token JWT' })
  @ApiBody({ type: SwaggerValidateTokenDto })
  @ApiResponse({
    status: 200,
    description: 'Token validado exitosamente',
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
        isValid: { type: 'boolean' },
      },
    },
  })
  async validateToken(@Body() validateTokenDto: SwaggerValidateTokenDto) {
    try {
      return await this.validateTokenUseCase.execute(validateTokenDto);
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al validar token');
    }
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar contraseña de usuario autenticado' })
  @ApiBody({ type: SwaggerChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Contraseña cambiada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async changePassword(
    @Req() req,
    @Body() changePasswordDto: SwaggerChangePasswordDto
  ) {
    try {
      const result = await this.changePasswordUseCase.execute({
        userId: req.user.userId,
        currentPassword: changePasswordDto.currentPassword,
        newPassword: changePasswordDto.newPassword,
      });
      
      return { success: result };
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al cambiar contraseña');
    }
  }

  @Post('forgot-password')
  @Public()
  @ApiOperation({ summary: 'Solicitar recuperación de contraseña' })
  @ApiBody({ type: SwaggerForgotPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Solicitud de recuperación enviada',
  })
  async forgotPassword(@Body() forgotPasswordDto: SwaggerForgotPasswordDto) {
    try {
      await this.forgotPasswordUseCase.execute(forgotPasswordDto);
      return { success: true };
    } catch (error) {
      // Siempre devolver éxito por seguridad
      return { success: true };
    }
  }

  @Post('reset-password')
  @Public()
  @ApiOperation({ summary: 'Restablecer contraseña con token' })
  @ApiBody({ type: SwaggerResetPasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Contraseña restablecida exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Token inválido o expirado' })
  async resetPassword(@Body() resetPasswordDto: SwaggerResetPasswordDto) {
    try {
      const result = await this.resetPasswordUseCase.execute(resetPasswordDto);
      return { success: result };
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al restablecer contraseña');
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil obtenido exitosamente',
    schema: {
      properties: {
        id: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
        role: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getProfile(@Req() req) {
    try {
      const { userId, name, email, role } = req.user;
      return { id: userId, name, email, role };
    } catch (error) {
      return this.exceptionHandler.handleException(error, 'Error al obtener el perfil');
    }
  }
}