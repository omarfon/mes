import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MotivoParada } from './entities/motivo-parada.entity';
import { CreateMotivoParadaDto } from './dto/create-motivo-parada.dto';
import { UpdateMotivoParadaDto } from './dto/update-motivo-parada.dto';
import { FilterMotivoParadaDto } from './dto/filter-motivo-parada.dto';

@Injectable()
export class MotivosParadaService {
  constructor(
    @InjectRepository(MotivoParada)
    private readonly motivosRepo: Repository<MotivoParada>,
  ) {}

  /**
   * Crear un nuevo motivo de parada
   */
  async create(dto: CreateMotivoParadaDto): Promise<MotivoParada> {
    // Verificar que no exista un motivo con el mismo código
    const existing = await this.motivosRepo.findOne({
      where: { codigo: dto.codigo },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException(`Ya existe un motivo de parada con el código ${dto.codigo}`);
    }

    const motivo = this.motivosRepo.create(dto);
    return this.motivosRepo.save(motivo);
  }

  /**
   * Listar motivos de parada con filtros y paginación
   */
  async findAll(filter: FilterMotivoParadaDto) {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      categoria,
      tipo,
      activo,
      impactaOEE,
      departamentoResponsable 
    } = filter;

    const queryBuilder = this.motivosRepo.createQueryBuilder('mp');

    if (search) {
      queryBuilder.andWhere(
        '(mp.codigo ILIKE :search OR mp.nombre ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (categoria !== undefined) {
      queryBuilder.andWhere('mp.categoria = :categoria', { categoria });
    }

    if (tipo !== undefined) {
      queryBuilder.andWhere('mp.tipo = :tipo', { tipo });
    }

    if (activo !== undefined) {
      queryBuilder.andWhere('mp.activo = :activo', { activo });
    }

    if (impactaOEE !== undefined) {
      queryBuilder.andWhere('mp.impactaOEE = :impactaOEE', { impactaOEE });
    }

    if (departamentoResponsable !== undefined) {
      queryBuilder.andWhere('mp.departamentoResponsable = :departamentoResponsable', { departamentoResponsable });
    }

    const [data, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('mp.categoria', 'ASC')
      .addOrderBy('mp.prioridad', 'ASC')
      .addOrderBy('mp.codigo', 'ASC')
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
   * Obtener un motivo de parada por ID
   */
  async findOne(id: string): Promise<MotivoParada> {
    const motivo = await this.motivosRepo.findOne({
      where: { id },
    });

    if (!motivo) {
      throw new NotFoundException(`Motivo de parada con id ${id} no encontrado`);
    }

    return motivo;
  }

  /**
   * Obtener un motivo de parada por código
   */
  async findByCodigo(codigo: string): Promise<MotivoParada> {
    const motivo = await this.motivosRepo.findOne({
      where: { codigo },
    });

    if (!motivo) {
      throw new NotFoundException(`Motivo de parada con código ${codigo} no encontrado`);
    }

    return motivo;
  }

  /**
   * Obtener motivos por categoría
   */
  async findByCategoria(categoria: string): Promise<MotivoParada[]> {
    return this.motivosRepo.find({
      where: { categoria: categoria as any, activo: true },
      order: { prioridad: 'ASC', codigo: 'ASC' },
    });
  }

  /**
   * Obtener motivos jerárquicos (hijos de un motivo padre)
   */
  async findHijos(motivoPadreId: string): Promise<MotivoParada[]> {
    return this.motivosRepo.find({
      where: { motivoPadreId },
      order: { codigo: 'ASC' },
    });
  }

  /**
   * Actualizar un motivo de parada
   */
  async update(id: string, dto: UpdateMotivoParadaDto): Promise<MotivoParada> {
    const motivo = await this.findOne(id);

    // Si se está cambiando el código, verificar que no exista otro con ese código
    if (dto.codigo && dto.codigo !== motivo.codigo) {
      const existing = await this.motivosRepo.findOne({
        where: { codigo: dto.codigo },
        withDeleted: true,
      });

      if (existing) {
        throw new ConflictException(`Ya existe un motivo de parada con el código ${dto.codigo}`);
      }
    }

    Object.assign(motivo, dto);
    return this.motivosRepo.save(motivo);
  }

  /**
   * Soft delete de un motivo de parada
   */
  async remove(id: string) {
    const motivo = await this.findOne(id);
    
    const result = await this.motivosRepo.softDelete(motivo.id);
    
    if (result.affected === 0) {
      throw new NotFoundException(`El motivo de parada con id ${id} no pudo ser eliminado`);
    }
    
    return {
      success: true,
      message: `Motivo de parada "${motivo.nombre}" (${motivo.codigo}) eliminado exitosamente`,
      deletedMotivo: {
        id: motivo.id,
        codigo: motivo.codigo,
        nombre: motivo.nombre,
      },
    };
  }

  /**
   * Restaurar un motivo de parada eliminado
   */
  async restore(id: string): Promise<MotivoParada> {
    // Verificar que existe (incluso si está eliminado)
    const motivo = await this.motivosRepo.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!motivo) {
      throw new NotFoundException(`Motivo de parada con id ${id} no encontrado`);
    }

    if (!motivo.fechaEliminacion) {
      throw new ConflictException(`El motivo de parada ${motivo.codigo} no está eliminado`);
    }

    await this.motivosRepo.restore(id);
    
    // Activar automáticamente al restaurar
    motivo.activo = true;
    motivo.fechaEliminacion = null;
    await this.motivosRepo.save(motivo);
    
    return motivo;
  }

  /**
   * Activar/desactivar un motivo de parada
   */
  async toggleActive(id: string): Promise<MotivoParada> {
    const motivo = await this.findOne(id);
    motivo.activo = !motivo.activo;
    return this.motivosRepo.save(motivo);
  }

  /**
   * Obtener estadísticas de motivos por categoría
   */
  async getEstadisticasPorCategoria(): Promise<any[]> {
    return this.motivosRepo
      .createQueryBuilder('mp')
      .select('mp.categoria', 'categoria')
      .addSelect('COUNT(*)', 'total')
      .addSelect('COUNT(CASE WHEN mp.activo = true THEN 1 END)', 'activos')
      .groupBy('mp.categoria')
      .orderBy('total', 'DESC')
      .getRawMany();
  }
}
