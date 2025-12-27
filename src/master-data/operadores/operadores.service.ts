import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operador } from './entities/operador.entity';
import { CreateOperadorDto } from './dto/create-operador.dto';
import { UpdateOperadorDto } from './dto/update-operador.dto';
import { FilterOperadorDto } from './dto/filter-operador.dto';

@Injectable()
export class OperadoresService {
  constructor(
    @InjectRepository(Operador)
    private readonly operadoresRepo: Repository<Operador>,
  ) {}

  /**
   * Crear un nuevo operador
   */
  async create(dto: CreateOperadorDto): Promise<Operador> {
    // Verificar que no exista un operador con el mismo código
    const existingCodigo = await this.operadoresRepo.findOne({
      where: { codigo: dto.codigo },
      withDeleted: true,
    });

    if (existingCodigo) {
      throw new ConflictException(`Ya existe un operador con el código ${dto.codigo}`);
    }

    // Verificar que no exista un operador con el mismo número de empleado
    if (dto.numeroEmpleado) {
      const existingNumero = await this.operadoresRepo.findOne({
        where: { numeroEmpleado: dto.numeroEmpleado },
        withDeleted: true,
      });

      if (existingNumero) {
        throw new ConflictException(`Ya existe un operador con el número de empleado ${dto.numeroEmpleado}`);
      }
    }

    const operador = this.operadoresRepo.create(dto);
    return this.operadoresRepo.save(operador);
  }

  /**
   * Listar operadores con filtros y paginación
   */
  async findAll(filter: FilterOperadorDto) {
    const { 
      page = 1, 
      limit = 20, 
      search, 
      estado, 
      nivelHabilidad,
      departamento,
      turnoId,
      workCenterId,
      supervisorId 
    } = filter;

    const queryBuilder = this.operadoresRepo.createQueryBuilder('op');

    if (search) {
      queryBuilder.andWhere(
        '(op.codigo ILIKE :search OR op.nombre ILIKE :search OR op.apellidos ILIKE :search OR op.numeroEmpleado ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    if (estado !== undefined) {
      queryBuilder.andWhere('op.estado = :estado', { estado });
    }

    if (nivelHabilidad !== undefined) {
      queryBuilder.andWhere('op.nivelHabilidad = :nivelHabilidad', { nivelHabilidad });
    }

    if (departamento !== undefined) {
      queryBuilder.andWhere('op.departamento = :departamento', { departamento });
    }

    if (turnoId !== undefined) {
      queryBuilder.andWhere('op.turnoId = :turnoId', { turnoId });
    }

    if (workCenterId !== undefined) {
      queryBuilder.andWhere('op.workCenterId = :workCenterId', { workCenterId });
    }

    if (supervisorId !== undefined) {
      queryBuilder.andWhere('op.supervisorId = :supervisorId', { supervisorId });
    }

    const [data, total] = await queryBuilder
      .take(limit)
      .skip((page - 1) * limit)
      .orderBy('op.apellidos', 'ASC')
      .addOrderBy('op.nombre', 'ASC')
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
   * Obtener un operador por ID
   */
  async findOne(id: string): Promise<Operador> {
    const operador = await this.operadoresRepo.findOne({
      where: { id },
    });

    if (!operador) {
      throw new NotFoundException(`Operador con id ${id} no encontrado`);
    }

    return operador;
  }

  /**
   * Obtener un operador por código
   */
  async findByCodigo(codigo: string): Promise<Operador> {
    const operador = await this.operadoresRepo.findOne({
      where: { codigo },
    });

    if (!operador) {
      throw new NotFoundException(`Operador con código ${codigo} no encontrado`);
    }

    return operador;
  }

  /**
   * Obtener un operador por número de empleado
   */
  async findByNumeroEmpleado(numeroEmpleado: string): Promise<Operador> {
    const operador = await this.operadoresRepo.findOne({
      where: { numeroEmpleado },
    });

    if (!operador) {
      throw new NotFoundException(`Operador con número de empleado ${numeroEmpleado} no encontrado`);
    }

    return operador;
  }

  /**
   * Actualizar un operador
   */
  async update(id: string, dto: UpdateOperadorDto): Promise<Operador> {
    const operador = await this.findOne(id);

    // Si se está cambiando el código, verificar que no exista otro con ese código
    if (dto.codigo && dto.codigo !== operador.codigo) {
      const existing = await this.operadoresRepo.findOne({
        where: { codigo: dto.codigo },
        withDeleted: true,
      });

      if (existing) {
        throw new ConflictException(`Ya existe un operador con el código ${dto.codigo}`);
      }
    }

    // Si se está cambiando el número de empleado, verificar que no exista otro con ese número
    if (dto.numeroEmpleado && dto.numeroEmpleado !== operador.numeroEmpleado) {
      const existing = await this.operadoresRepo.findOne({
        where: { numeroEmpleado: dto.numeroEmpleado },
        withDeleted: true,
      });

      if (existing) {
        throw new ConflictException(`Ya existe un operador con el número de empleado ${dto.numeroEmpleado}`);
      }
    }

    Object.assign(operador, dto);
    return this.operadoresRepo.save(operador);
  }

  /**
   * Soft delete de un operador
   */
  async remove(id: string): Promise<void> {
    const operador = await this.findOne(id);
    await this.operadoresRepo.softDelete(operador.id);
  }

  /**
   * Restaurar un operador eliminado
   */
  async restore(id: string): Promise<Operador> {
    await this.operadoresRepo.restore(id);
    return this.findOne(id);
  }

  /**
   * Cambiar estado de un operador
   */
  async cambiarEstado(id: string, nuevoEstado: string): Promise<Operador> {
    const operador = await this.findOne(id);
    operador.estado = nuevoEstado as any;
    return this.operadoresRepo.save(operador);
  }

  /**
   * Obtener operadores por turno
   */
  async findByTurno(turnoId: string): Promise<Operador[]> {
    return this.operadoresRepo.find({
      where: { turnoId },
      order: { apellidos: 'ASC', nombre: 'ASC' },
    });
  }

  /**
   * Obtener operadores por supervisor
   */
  async findBySupervisor(supervisorId: string): Promise<Operador[]> {
    return this.operadoresRepo.find({
      where: { supervisorId },
      order: { apellidos: 'ASC', nombre: 'ASC' },
    });
  }

  /**
   * Asignar máquina autorizada a operador
   */
  async asignarMaquina(id: string, maquinaId: string): Promise<Operador> {
    const operador = await this.findOne(id);
    
    if (!operador.maquinasAutorizadas) {
      operador.maquinasAutorizadas = [];
    }

    if (!operador.maquinasAutorizadas.includes(maquinaId)) {
      operador.maquinasAutorizadas.push(maquinaId);
    }

    return this.operadoresRepo.save(operador);
  }

  /**
   * Remover máquina autorizada de operador
   */
  async removerMaquina(id: string, maquinaId: string): Promise<Operador> {
    const operador = await this.findOne(id);
    
    if (operador.maquinasAutorizadas) {
      operador.maquinasAutorizadas = operador.maquinasAutorizadas.filter(
        m => m !== maquinaId
      );
    }

    return this.operadoresRepo.save(operador);
  }
}
