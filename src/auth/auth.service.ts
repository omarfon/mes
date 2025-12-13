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

  private async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return user;
  }

  async login(dto: LoginDto) {
    const user = await this.validateUser(dto.email, dto.password);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
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

}
