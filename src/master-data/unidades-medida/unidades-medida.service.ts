import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Or } from 'typeorm';
import { UnidadMedida } from './entities/unidad-medida.entity';
import { CreateUnidadMedidaDto } from './dto/create-unidad-medida.dto';
import { UpdateUnidadMedidaDto } from './dto/update-unidad-medida.dto';
import { FilterUnidadMedidaDto } from './dto/filter-unidad-medida.dto';

@Injectable()
export class UnidadesMedidaService {
  constructor(
    @InjectRepository(UnidadMedida)
    private readonly unidadesRepo: Repository<UnidadMedida>,
  ) {}

  /**
   * Crear una nueva unidad de medida
   */
  async create(dto: CreateUnidadMedidaDto): Promise<UnidadMedida> {
    // Verificar que no exista una unidad con el mismo código
    const existingCodigo = await this.unidadesRepo.findOne({
      where: { codigo: dto.codigo },
      withDeleted: true,
    });

    if (existingCodigo) {
      throw new ConflictException(`Ya existe una unidad de medida con el código ${dto.codigo}`);
    }

    // Verificar que no exista una unidad con el mismo símbolo
    const existingSimbolo = await this.unidadesRepo.findOne({
      where: { simbolo: dto.simbolo },
      withDeleted: true,
    });

    if (existingSimbolo) {
      throw new ConflictException(`Ya existe una unidad de medida con el símbolo ${dto.simbolo}`);
    }

    // Si se especifica unidadBaseId, verificar que exista
    if (dto.unidadBaseId) {
      const unidadBase = await this.unidadesRepo.findOne({
        where: { id: dto.unidadBaseId },
      });

      if (!unidadBase) {
        throw new BadRequestException(`La unidad base con id ${dto.unidadBaseId} no existe`);
      }
    }

    const unidad = this.unidadesRepo.create(dto);
    return this.unidadesRepo.save(unidad);
  }

  /**
   * Listar unidades de medida con filtros y paginación
   */
  async findAll(filter: FilterUnidadMedidaDto) {
    const { page = 1, limit = 20, search, tipo, activo, esSI } = filter;

    const queryBuilder = this.unidadesRepo.createQueryBuilder('um');

    if (search) {
      queryBuilder.andWhere(
        '(um.codigo ILIKE :search OR um.nombre ILIKE :search OR um.simbolo ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (tipo !== undefined) {
      queryBuilder.andWhere('um.tipo = :tipo', { tipo });
    }

    if (activo !== undefined) {
      queryBuilder.andWhere('um.activo = :activo', { activo });
    }

    if (esSI !== undefined) {
      queryBuilder.andWhere('um.esSI = :esSI', { esSI });
    }

    const [data, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('um.tipo', 'ASC')
      .addOrderBy('um.codigo', 'ASC')
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

  /**
   * Obtener una unidad de medida por ID
   */
  async findOne(id: string): Promise<UnidadMedida> {
    const unidad = await this.unidadesRepo.findOne({
      where: { id },
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad de medida con id ${id} no encontrada`);
    }

    return unidad;
  }

  /**
   * Obtener una unidad de medida por código
   */
  async findByCodigo(codigo: string): Promise<UnidadMedida> {
    const unidad = await this.unidadesRepo.findOne({
      where: { codigo },
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad de medida con código ${codigo} no encontrada`);
    }

    return unidad;
  }

  /**
   * Obtener una unidad de medida por símbolo
   */
  async findBySimbolo(simbolo: string): Promise<UnidadMedida> {
    const unidad = await this.unidadesRepo.findOne({
      where: { simbolo },
    });

    if (!unidad) {
      throw new NotFoundException(`Unidad de medida con símbolo ${simbolo} no encontrada`);
    }

    return unidad;
  }

  /**
   * Actualizar una unidad de medida
   */
  async update(id: string, dto: UpdateUnidadMedidaDto): Promise<UnidadMedida> {
    const unidad = await this.findOne(id);

    // Si se está cambiando el código, verificar que no exista otro con ese código
    if (dto.codigo && dto.codigo !== unidad.codigo) {
      const existing = await this.unidadesRepo.findOne({
        where: { codigo: dto.codigo },
        withDeleted: true,
      });

      if (existing) {
        throw new ConflictException(`Ya existe una unidad de medida con el código ${dto.codigo}`);
      }
    }

    // Si se está cambiando el símbolo, verificar que no exista otro con ese símbolo
    if (dto.simbolo && dto.simbolo !== unidad.simbolo) {
      const existing = await this.unidadesRepo.findOne({
        where: { simbolo: dto.simbolo },
        withDeleted: true,
      });

      if (existing) {
        throw new ConflictException(`Ya existe una unidad de medida con el símbolo ${dto.simbolo}`);
      }
    }

    // Si se especifica unidadBaseId, verificar que exista
    if (dto.unidadBaseId && dto.unidadBaseId !== unidad.unidadBaseId) {
      const unidadBase = await this.unidadesRepo.findOne({
        where: { id: dto.unidadBaseId },
      });

      if (!unidadBase) {
        throw new BadRequestException(`La unidad base con id ${dto.unidadBaseId} no existe`);
      }
    }

    Object.assign(unidad, dto);
    return this.unidadesRepo.save(unidad);
  }

  /**
   * Soft delete de una unidad de medida
   */
  async remove(id: string): Promise<void> {
    const unidad = await this.findOne(id);
    await this.unidadesRepo.softDelete(unidad.id);
  }

  /**
   * Restaurar una unidad de medida eliminada
   */
  async restore(id: string): Promise<UnidadMedida> {
    await this.unidadesRepo.restore(id);
    return this.findOne(id);
  }

  /**
   * Activar/desactivar una unidad de medida
   */
  async toggleActive(id: string): Promise<UnidadMedida> {
    const unidad = await this.findOne(id);
    unidad.activo = !unidad.activo;
    return this.unidadesRepo.save(unidad);
  }

  /**
   * Convertir valor de una unidad a otra (si tienen factor de conversión)
   */
  async convertir(valor: number, unidadOrigenId: string, unidadDestinoId: string): Promise<number> {
    const unidadOrigen = await this.findOne(unidadOrigenId);
    const unidadDestino = await this.findOne(unidadDestinoId);

    // Verificar que sean del mismo tipo
    if (unidadOrigen.tipo !== unidadDestino.tipo) {
      throw new BadRequestException(
        `No se pueden convertir unidades de diferentes tipos: ${unidadOrigen.tipo} vs ${unidadDestino.tipo}`
      );
    }

    // Si no tienen factor de conversión, no se puede convertir
    if (!unidadOrigen.factorConversion || !unidadDestino.factorConversion) {
      throw new BadRequestException('Las unidades no tienen factor de conversión definido');
    }

    // Conversión: valor * factorOrigen / factorDestino
    const valorConvertido = (valor * unidadOrigen.factorConversion) / unidadDestino.factorConversion;

    return Number(valorConvertido.toFixed(unidadDestino.decimales));
  }
}
