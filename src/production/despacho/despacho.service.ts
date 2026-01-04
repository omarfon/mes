import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Despacho, EstadoDespacho } from './entities/despacho.entity';
import { CreateDespachoDto } from './dto/create-despacho.dto';
import { UpdateDespachoDto } from './dto/update-despacho.dto';
import { FilterDespachoDto } from './dto/filter-despacho.dto';

@Injectable()
export class DespachoService {
  constructor(
    @InjectRepository(Despacho)
    private readonly despachoRepo: Repository<Despacho>,
  ) {}

  async create(dto: CreateDespachoDto): Promise<Despacho> {
    const existing = await this.despachoRepo.findOne({
      where: { numeroDespacho: dto.numeroDespacho },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException(`Ya existe un despacho con el número ${dto.numeroDespacho}`);
    }

    const despacho = this.despachoRepo.create({
      ...dto,
      cantidadItems: dto.items?.length || 0,
    });

    return this.despachoRepo.save(despacho);
  }

  async findAll(filter: FilterDespachoDto) {
    const { page = 1, limit = 20, search, estado, tipo, ordenId } = filter;

    const queryBuilder = this.despachoRepo.createQueryBuilder('despacho');

    if (search) {
      queryBuilder.andWhere(
        '(despacho.numeroDespacho ILIKE :search OR despacho.destino ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (estado) {
      queryBuilder.andWhere('despacho.estado = :estado', { estado });
    }

    if (tipo) {
      queryBuilder.andWhere('despacho.tipo = :tipo', { tipo });
    }

    if (ordenId) {
      queryBuilder.andWhere('despacho.ordenId = :ordenId', { ordenId });
    }

    const [data, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('despacho.fechaProgramada', 'DESC')
      .getManyAndCount();

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<Despacho> {
    const despacho = await this.despachoRepo.findOne({ where: { id } });
    if (!despacho) {
      throw new NotFoundException(`Despacho con id ${id} no encontrado`);
    }
    return despacho;
  }

  async update(id: string, dto: UpdateDespachoDto): Promise<Despacho> {
    const despacho = await this.findOne(id);
    Object.assign(despacho, dto);
    
    if (dto.items) {
      despacho.cantidadItems = dto.items.length;
    }

    return this.despachoRepo.save(despacho);
  }

  async cambiarEstado(id: string, nuevoEstado: EstadoDespacho): Promise<Despacho> {
    const despacho = await this.findOne(id);
    despacho.estado = nuevoEstado;

    if (nuevoEstado === EstadoDespacho.LISTO) {
      despacho.fechaDespacho = new Date();
    }

    if (nuevoEstado === EstadoDespacho.ENTREGADO) {
      despacho.fechaEntrega = new Date();
    }

    return this.despachoRepo.save(despacho);
  }

  async remove(id: string) {
    const despacho = await this.findOne(id);
    await this.despachoRepo.softDelete(despacho.id);
    
    return {
      success: true,
      message: `Despacho "${despacho.numeroDespacho}" eliminado exitosamente`,
      deletedDespacho: { id: despacho.id, numeroDespacho: despacho.numeroDespacho },
    };
  }
}
