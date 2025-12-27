import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proceso } from './entities/proceso.entity';
import { CreateProcesoDto } from './dto/create-proceso.dto';
import { UpdateProcesoDto } from './dto/update-proceso.dto';
import { FilterProcesoDto } from './dto/filter-proceso.dto';

@Injectable()
export class ProcesosService {
  constructor(
    @InjectRepository(Proceso)
    private readonly procesosRepo: Repository<Proceso>,
  ) {}

  /**
   * Crear un nuevo proceso
   */
  async create(dto: CreateProcesoDto): Promise<Proceso> {
    // Verificar que no exista un proceso con el mismo código
    const existing = await this.procesosRepo.findOne({
      where: { codigo: dto.codigo },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException(`Ya existe un proceso con el código ${dto.codigo}`);
    }

    const proceso = this.procesosRepo.create(dto);
    return this.procesosRepo.save(proceso);
  }

  /**
   * Listar procesos con filtros y paginación
   */
  async findAll(filter: FilterProcesoDto) {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      tipo,
      estado,
      workCenterId,
      productoId,
      rutaId 
    } = filter;

    const queryBuilder = this.procesosRepo.createQueryBuilder('p');

    if (search) {
      queryBuilder.andWhere(
        '(p.codigo ILIKE :search OR p.nombre ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (tipo !== undefined) {
      queryBuilder.andWhere('p.tipo = :tipo', { tipo });
    }

    if (estado !== undefined) {
      queryBuilder.andWhere('p.estado = :estado', { estado });
    }

    if (workCenterId !== undefined) {
      queryBuilder.andWhere('p.workCenterId = :workCenterId', { workCenterId });
    }

    if (productoId !== undefined) {
      queryBuilder.andWhere('p.productoId = :productoId', { productoId });
    }

    if (rutaId !== undefined) {
      queryBuilder.andWhere('p.rutaId = :rutaId', { rutaId });
    }

    const [data, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('p.tipo', 'ASC')
      .addOrderBy('p.secuencia', 'ASC')
      .addOrderBy('p.codigo', 'ASC')
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
   * Obtener un proceso por ID
   */
  async findOne(id: string): Promise<Proceso> {
    const proceso = await this.procesosRepo.findOne({
      where: { id },
    });

    if (!proceso) {
      throw new NotFoundException(`Proceso con id ${id} no encontrado`);
    }

    return proceso;
  }

  /**
   * Obtener un proceso por código
   */
  async findByCodigo(codigo: string): Promise<Proceso> {
    const proceso = await this.procesosRepo.findOne({
      where: { codigo },
    });

    if (!proceso) {
      throw new NotFoundException(`Proceso con código ${codigo} no encontrado`);
    }

    return proceso;
  }

  /**
   * Obtener procesos por ruta
   */
  async findByRuta(rutaId: string): Promise<Proceso[]> {
    return this.procesosRepo.find({
      where: { rutaId },
      order: { secuencia: 'ASC', codigo: 'ASC' },
    });
  }

  /**
   * Obtener procesos por producto
   */
  async findByProducto(productoId: string): Promise<Proceso[]> {
    return this.procesosRepo.find({
      where: { productoId },
      order: { secuencia: 'ASC', codigo: 'ASC' },
    });
  }

  /**
   * Obtener procesos por centro de trabajo
   */
  async findByWorkCenter(workCenterId: string): Promise<Proceso[]> {
    return this.procesosRepo.find({
      where: { workCenterId },
      order: { codigo: 'ASC' },
    });
  }

  /**
   * Obtener procesos hijos de un proceso padre
   */
  async findHijos(procesoPadreId: string): Promise<Proceso[]> {
    return this.procesosRepo.find({
      where: { procesoPadreId },
      order: { secuencia: 'ASC', codigo: 'ASC' },
    });
  }

  /**
   * Actualizar un proceso
   */
  async update(id: string, dto: UpdateProcesoDto): Promise<Proceso> {
    const proceso = await this.findOne(id);

    // Si se está cambiando el código, verificar que no exista otro con ese código
    if (dto.codigo && dto.codigo !== proceso.codigo) {
      const existing = await this.procesosRepo.findOne({
        where: { codigo: dto.codigo },
        withDeleted: true,
      });

      if (existing) {
        throw new ConflictException(`Ya existe un proceso con el código ${dto.codigo}`);
      }
    }

    Object.assign(proceso, dto);
    return this.procesosRepo.save(proceso);
  }

  /**
   * Soft delete de un proceso
   */
  async remove(id: string): Promise<void> {
    const proceso = await this.findOne(id);
    await this.procesosRepo.softDelete(proceso.id);
  }

  /**
   * Restaurar un proceso eliminado
   */
  async restore(id: string): Promise<Proceso> {
    await this.procesosRepo.restore(id);
    return this.findOne(id);
  }

  /**
   * Cambiar estado de un proceso
   */
  async cambiarEstado(id: string, nuevoEstado: string): Promise<Proceso> {
    const proceso = await this.findOne(id);
    proceso.estado = nuevoEstado as any;
    return this.procesosRepo.save(proceso);
  }

  /**
   * Duplicar un proceso (crear copia)
   */
  async duplicar(id: string, nuevoCodigo: string): Promise<Proceso> {
    const procesoOriginal = await this.findOne(id);

    // Verificar que el nuevo código no exista
    const existing = await this.procesosRepo.findOne({
      where: { codigo: nuevoCodigo },
      withDeleted: true,
    });

    if (existing) {
      throw new ConflictException(`Ya existe un proceso con el código ${nuevoCodigo}`);
    }

    // Crear copia del proceso
    const nuevoProceso = this.procesosRepo.create({
      codigo: nuevoCodigo,
      nombre: `${procesoOriginal.nombre} (Copia)`,
      descripcion: procesoOriginal.descripcion,
      tipo: procesoOriginal.tipo,
      estado: procesoOriginal.estado,
      version: procesoOriginal.version,
      tiempoEstandarMinutos: procesoOriginal.tiempoEstandarMinutos,
      tiempoSetupMinutos: procesoOriginal.tiempoSetupMinutos,
      instrucciones: procesoOriginal.instrucciones,
      requisitosCalidad: procesoOriginal.requisitosCalidad,
      parametros: procesoOriginal.parametros,
      recursos: procesoOriginal.recursos,
      habilidadesRequeridas: procesoOriginal.habilidadesRequeridas,
      workCenterId: procesoOriginal.workCenterId,
      productoId: procesoOriginal.productoId,
      rutaId: procesoOriginal.rutaId,
      secuencia: procesoOriginal.secuencia,
      documentos: procesoOriginal.documentos,
      puntosCriticos: procesoOriginal.puntosCriticos,
      riesgos: procesoOriginal.riesgos,
      eficienciaEsperada: procesoOriginal.eficienciaEsperada,
      costoEstandar: procesoOriginal.costoEstandar,
      notas: procesoOriginal.notas,
      procesoPadreId: procesoOriginal.procesoPadreId,
    });

    return this.procesosRepo.save(nuevoProceso);
  }

  /**
   * Obtener estadísticas de procesos por tipo
   */
  async getEstadisticasPorTipo(): Promise<any[]> {
    return this.procesosRepo
      .createQueryBuilder('p')
      .select('p.tipo', 'tipo')
      .addSelect('COUNT(*)', 'total')
      .addSelect('COUNT(CASE WHEN p.estado = \'ACTIVO\' THEN 1 END)', 'activos')
      .addSelect('AVG(p.tiempoEstandarMinutos)', 'tiempoPromedioMinutos')
      .groupBy('p.tipo')
      .orderBy('total', 'DESC')
      .getRawMany();
  }
}
