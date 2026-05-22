import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/master-data/users/users.service';
import { User } from 'src/master-data/users/entities/user.entity';
import { CreateAuthDto } from './dto/create-auth.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const normalizedEmail = loginDto.email?.trim().toLowerCase();
    const user = await this.validateUser(normalizedEmail, loginDto.password);
    
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!password || !user.passwordHash) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    let passwordMatch = false;

    try {
      // Compatibilidad: si el hash no es bcrypt, compara texto plano para no romper cuentas heredadas.
      if (user.passwordHash.startsWith('$2a$') || user.passwordHash.startsWith('$2b$') || user.passwordHash.startsWith('$2y$')) {
        passwordMatch = await bcrypt.compare(password, user.passwordHash);
      } else {
        passwordMatch = password === user.passwordHash;
      }
    } catch {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  }

  async register(dto: CreateAuthDto) {
    const exists = await this.usersService.findByEmail(dto.email);
    if (exists) {
      throw new ConflictException('El correo ya está registrado');
    }

    const user = await this.usersService.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
      role: dto.role,
    });

    return {
      message: 'Usuario creado correctamente',
      user,
    };
  }

  async forgotPassword(email: string): Promise<{ message: string; resetToken?: string; expiresIn?: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.usersService.findByEmail(normalizedEmail);

    // Por seguridad siempre respondemos igual, incluso si el usuario no existe
    if (!user || !user.isActive) {
      return { message: 'Si el correo existe, recibirás las instrucciones de recuperación.' };
    }

    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    await this.usersService.setResetToken(user.id, token, expires);

    // MODO DESARROLLO: el token se devuelve en la respuesta en lugar de enviarse por email
    return {
      message: '[DEV] Token generado. En producción se enviará por correo.',
      resetToken: token,
      expiresIn: '1h',
    };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.usersService.findByResetToken(token);

    if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
      throw new BadRequestException('Token inválido o expirado');
    }

    await this.usersService.updatePassword(user.id, newPassword);

    return { message: 'Contraseña actualizada correctamente' };
  }
}
