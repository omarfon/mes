import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateAuthDto } from './dto/create-auth.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Login de usuario' })
  async login(@Body() { email, password }: LoginDto) {
    return this.authService.login({ username: email, password });
  }

  @Post('register')
@ApiOperation({ summary: 'Registrar un nuevo usuario' })
async register(@Body() dto: CreateAuthDto) {
  return this.authService.register(dto);
}
}
