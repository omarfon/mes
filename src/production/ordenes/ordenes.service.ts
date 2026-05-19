import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { OrdenProduccion, EstadoOrden } from './entities/orden.entity';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { FilterOrdenDto } from './dto/filter-orden.dto';
import { Product } from '../../master-data/products/entities/product.entity';

@Injectable()
export class OrdenesService {
  constructor(
    @InjectRepository(OrdenProduccion)
    private readonly ordenesRepo: Repository<OrdenProduccion>,
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  async create(dto: CreateOrdenDto): Promise<OrdenProduccion> {
    const existing = await this.ordenesRepo.findOne({
      where: { numeroOrden: dto.numeroOrden },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException(`Ya existe una orden con el número ${dto.numeroOrden}`);
    }

    // Si no se proporciona productoId, buscarlo por código
    let productoId = dto.productoId;
    let productoCodigo = dto.productoCodigo;
    let productoNombre = dto.productoNombre;

    if (!productoId && !productoCodigo) {
      throw new BadRequestException('Debe proporcionar productoId o productoCodigo');
    }

    if (!productoId && productoCodigo) {
      const producto = await this.productsRepo.findOne({
        where: { code: productoCodigo.toUpperCase() },
      });

      if (!producto) {
        throw new NotFoundException(`Producto con código ${productoCodigo} no encontrado`);
      }

      productoId = producto.id;
      productoCodigo = producto.code;
      productoNombre = productoNombre || producto.name;
    }

    const orden = this.ordenesRepo.create({
      ...dto,
      productoId,
      productoCodigo,
      productoNombre,
    });

    return this.ordenesRepo.save(orden);
  }

  async findAll(filter: FilterOrdenDto) {
    const {
      page = 1,
      limit = 20,
      search,
      estado,
      prioridad,
      productoId,
      workCenterId,
      turnoId,
      fechaDesde,
      fechaHasta,
    } = filter;

    const queryBuilder = this.ordenesRepo.createQueryBuilder('orden');

    if (search) {
      queryBuilder.andWhere(
        '(orden.numeroOrden ILIKE :search OR orden.productoCodigo ILIKE :search OR orden.productoNombre ILIKE :search OR orden.cliente ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (estado) {
      queryBuilder.andWhere('orden.estado = :estado', { estado });
    }

    if (prioridad) {
      queryBuilder.andWhere('orden.prioridad = :prioridad', { prioridad });
    }

    if (productoId) {
      queryBuilder.andWhere('orden.productoId = :productoId', { productoId });
    }

    if (workCenterId) {
      queryBuilder.andWhere('orden.workCenterId = :workCenterId', { workCenterId });
    }

    if (turnoId) {
      queryBuilder.andWhere('orden.turnoId = :turnoId', { turnoId });
    }

    if (fechaDesde && fechaHasta) {
      queryBuilder.andWhere('orden.fechaInicioPlanificada BETWEEN :fechaDesde AND :fechaHasta', {
        fechaDesde,
        fechaHasta,
      });
    }

    const [data, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('orden.fechaInicioPlanificada', 'DESC')
      .addOrderBy('orden.prioridad', 'DESC')
      .getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<OrdenProduccion> {
    const orden = await this.ordenesRepo.findOne({ where: { id } });

    if (!orden) {
      throw new NotFoundException(`Orden de producción con id ${id} no encontrada`);
    }

    return orden;
  }

  async findByNumero(numeroOrden: string): Promise<OrdenProduccion> {
    const orden = await this.ordenesRepo.findOne({ where: { numeroOrden } });

    if (!orden) {
      throw new NotFoundException(`Orden ${numeroOrden} no encontrada`);
    }

    return orden;
  }

  async update(id: string, dto: UpdateOrdenDto): Promise<OrdenProduccion> {
    const orden = await this.findOne(id);

    if (dto.numeroOrden && dto.numeroOrden !== orden.numeroOrden) {
      const existing = await this.ordenesRepo.findOne({
        where: { numeroOrden: dto.numeroOrden },
        withDeleted: true,
      });

      if (existing) {
        throw new ConflictException(`Ya existe una orden con el número ${dto.numeroOrden}`);
      }
    }

    Object.assign(orden, dto);
    
    // Recalcular progreso si se actualiza cantidad producida
    if (dto.cantidadProducida !== undefined) {
      orden.progreso = (orden.cantidadProducida / orden.cantidadPlanificada) * 100;
    }

    return this.ordenesRepo.save(orden);
  }

  async cambiarEstado(id: string, nuevoEstado: EstadoOrden): Promise<OrdenProduccion> {
    const orden = await this.findOne(id);
    
    orden.estado = nuevoEstado;

    // Actualizar fechas según estado
    if (nuevoEstado === EstadoOrden.EN_PROCESO && !orden.fechaInicioReal) {
      orden.fechaInicioReal = new Date();
    }

    if (nuevoEstado === EstadoOrden.COMPLETADA && !orden.fechaFinReal) {
      orden.fechaFinReal = new Date();
      orden.progreso = 100;
    }

    return this.ordenesRepo.save(orden);
  }

  async registrarProduccion(id: string, cantidad: number): Promise<OrdenProduccion> {
    const orden = await this.findOne(id);
    
    orden.cantidadProducida += cantidad;
    orden.progreso = (orden.cantidadProducida / orden.cantidadPlanificada) * 100;

    if (orden.progreso >= 100) {
      orden.estado = EstadoOrden.COMPLETADA;
      orden.fechaFinReal = new Date();
    }

    return this.ordenesRepo.save(orden);
  }

  async remove(id: string) {
    const orden = await this.findOne(id);
    
    const result = await this.ordenesRepo.softDelete(orden.id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`La orden con id ${id} no pudo ser eliminada`);
    }
    
    return {
      success: true,
      message: `Orden "${orden.numeroOrden}" eliminada exitosamente`,
      deletedOrden: {
        id: orden.id,
        numeroOrden: orden.numeroOrden,
        producto: orden.productoNombre,
      },
    };
  }

  async restore(id: string): Promise<OrdenProduccion> {
    const orden = await this.ordenesRepo.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!orden) {
      throw new NotFoundException(`Orden con id ${id} no encontrada`);
    }

    if (!orden.fechaEliminacion) {
      throw new ConflictException(`La orden ${orden.numeroOrden} no está eliminada`);
    }

    await this.ordenesRepo.restore(id);
    
    return this.findOne(id);
  }

  async getEstadisticas() {
    const stats = await this.ordenesRepo
      .createQueryBuilder('orden')
      .select('orden.estado', 'estado')
      .addSelect('COUNT(*)', 'total')
      .addSelect('SUM(orden.cantidadPlanificada)', 'cantidadTotal')
      .addSelect('SUM(orden.cantidadProducida)', 'cantidadProducida')
      .groupBy('orden.estado')
      .getRawMany();

    return stats;
  }
}