import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUsersDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import * as bcrypt from 'bcrypt'; // cuando instales bcrypt

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.usersRepo.findOne({
      where: { email: dto.email.toLowerCase() },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException('Email already in use');
    }

    // const passwordHash = await bcrypt.hash(dto.password, 10);
    const passwordHash = dto.password; // TODO: reemplazar por hash real

    const user = this.usersRepo.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email.toLowerCase(),
      passwordHash,
      role: dto.role ?? UserRole.VIEWER,
      operatorId: dto.operatorId,
    });

    return this.usersRepo.save(user);
  }

  async findAll(filter: FilterUsersDto) {
    const { page = 1, limit = 20, search, role } = filter;

    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (search) {
      where.email = ILike(`%${search}%`);
      // si quieres buscar también por nombre, armamos un OR más adelante
    }

    const [data, total] = await this.usersRepo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (dto.email && dto.email.toLowerCase() !== user.email) {
      const exists = await this.usersRepo.findOne({
        where: { email: dto.email.toLowerCase() },
      });
      if (exists) {
        throw new ConflictException('Email already in use');
      }
    }

    let passwordHash = user.passwordHash;
    if (dto.password) {
      // passwordHash = await bcrypt.hash(dto.password, 10);
      passwordHash = dto.password; // TODO: reemplazar por hash real
    }

    Object.assign(user, {
      firstName: dto.firstName ?? user.firstName,
      lastName: dto.lastName ?? user.lastName,
      email: dto.email ? dto.email.toLowerCase() : user.email,
      role: dto.role ?? user.role,
      operatorId: dto.operatorId ?? user.operatorId,
      passwordHash,
    });

    return this.usersRepo.save(user);
  }

  async toggleActive(id: string, isActive: boolean): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = isActive;
    return this.usersRepo.save(user);
  }

  async softDelete(id: string): Promise<void> {
    await this.usersRepo.softDelete(id);
  }
}
