import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MachineEvent } from './entities/machine-event.entity';
import { LogEventDto } from './dto/log-event.dto';
import { MachinesService } from '../master-data/machines/services/machines.service';

@Injectable()
export class MonitoringService {
  constructor(
    @InjectRepository(MachineEvent)
    private readonly eventRepository: Repository<MachineEvent>,
    private readonly machinesService: MachinesService,
  ) { }

  /**
   * Registra un nuevo evento de máquina (cambio de estado)
   * @param dto Datos del evento (machineId, status, etc.)
   * @returns El evento guardado
   */
  async logEvent(dto: LogEventDto) {
    // Verificar que la máquina existe
    await this.machinesService.findOne(dto.machineId);

    const event = this.eventRepository.create({
      machineId: dto.machineId,
      status: dto.status,
      reasonCode: dto.reasonCode,
      metadata: dto.metadata,
    });

    // Guardar evento
    const savedEvent = await this.eventRepository.save(event);

    // Actualizar estado actual de la máquina en master-data para consistencia rápida
    await this.machinesService.updateStatus(dto.machineId, dto.status);

    return savedEvent;
  }

  /**
   * Obtiene el estado actual de todas las máquinas (Dashboard)
   * Estrategia: Obtener todas las máquinas y su último evento
   * @returns Lista de eventos más recientes por máquina
   */
  async getPlantStatus() {
    // Opción A: Query complejo con DISTINCT ON (machine_id) ORDER BY timestamp DESC
    // Opción B: Traer máquinas y hacer join con el último evento.
    // Usaremos QueryBuilder para eficiencia.

    const query = this.eventRepository
      .createQueryBuilder('event')
      .distinctOn(['event.machine_id'])
      .orderBy('event.machine_id')
      .addOrderBy('event.timestamp', 'DESC')
      .leftJoinAndSelect('event.machine', 'machine');

    return await query.getMany();
  }

  /**
   * Historial de eventos de una máquina
   * @param machineId ID de la máquina
   * @param limit Límite de resultados (default 50)
   * @returns Lista de eventos históricos
   */
  async getMachineHistory(machineId: string, limit = 50) {
    return await this.eventRepository.find({
      where: { machineId },
      order: { timestamp: 'DESC' },
      take: limit,
    });
  }
}
