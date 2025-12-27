import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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

  /* private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  } */

   async login({ username, password }: { username: string; password: string }) {
    // Aquí debería ir tu validación real contra BD:
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, username: user.username, role: user.role };
    const access_token = await this.jwtService.signAsync(payload);

    return {
      access_token,
      user,
    };
  }

  private async validateUser(username: string, password: string) {
    if (username === 'admin' && password === 'admin123') {
      return { id: 1, username: 'admin', role: 'ADMIN' };
    }
    return null;
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

 logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
  }

  get token(): string | null {
    return localStorage.getItem('access_token');
  }

  get currentUser() {
    const raw = localStorage.getItem('current_user');
    return raw ? JSON.parse(raw) : null;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

}
