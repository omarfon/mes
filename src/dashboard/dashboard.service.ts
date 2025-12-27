import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ProductionOrder, ProductionOrderStatus } from '../production-orders/entities/production-order.entity';
import { Machine, MachineStatus } from '../master-data/machines/entities/machines.entity';

export interface DashboardKPIs {
  production: {
    activeOrders: number;
    completedToday: number;
    plannedOrders: number;
    delayedOrders: number;
    totalQuantityProduced: number;
  };
  machines: {
    total: number;
    active: number;
    inactive: number;
    maintenance: number;
    utilizationRate: number;
  };
  efficiency: {
    oee: number; // Overall Equipment Effectiveness
    performance: number;
    quality: number;
    availability: number;
  };
}

export interface ProductionTrend {
  date: string;
  planned: number;
  produced: number;
  efficiency: number;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(ProductionOrder)
    private readonly poRepo: Repository<ProductionOrder>,
    @InjectRepository(Machine)
    private readonly machineRepo: Repository<Machine>,
  ) {}

  /**
   * Obtiene los KPIs principales del dashboard
   */
  async getKPIs(): Promise<DashboardKPIs> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // KPIs de Producción
    const [activeOrders, completedToday, plannedOrders, allOrders] = await Promise.all([
      this.poRepo.count({ where: { status: ProductionOrderStatus.IN_PROGRESS } }),
      this.poRepo.count({
        where: {
          status: ProductionOrderStatus.COMPLETED,
          actualEndDate: Between(today, tomorrow),
        },
      }),
      this.poRepo.count({ where: { status: ProductionOrderStatus.PLANNED } }),
      this.poRepo.find({ select: ['quantityProduced'] }),
    ]);

    // Órdenes retrasadas (dueDate pasado y no completadas)
    const now = new Date();
    const delayedOrders = await this.poRepo
      .createQueryBuilder('po')
      .where('po.dueDate < :now', { now })
      .andWhere('po.status != :completed', { completed: ProductionOrderStatus.COMPLETED })
      .getCount();

    const totalQuantityProduced = allOrders.reduce(
      (sum, po) => sum + (po.quantityProduced || 0),
      0,
    );

    // KPIs de Máquinas
    const [totalMachines, activeMachines, inactiveMachines, maintenanceMachines] =
      await Promise.all([
        this.machineRepo.count(),
        this.machineRepo.count({ where: { status: MachineStatus.ACTIVE } }),
        this.machineRepo.count({ where: { status: MachineStatus.INACTIVE } }),
        this.machineRepo.count({ where: { status: MachineStatus.MAINTENANCE } }),
      ]);

    const utilizationRate =
      totalMachines > 0 ? (activeMachines / totalMachines) * 100 : 0;

    return {
      production: {
        activeOrders,
        completedToday,
        plannedOrders,
        delayedOrders,
        totalQuantityProduced,
      },
      machines: {
        total: totalMachines,
        active: activeMachines,
        inactive: inactiveMachines,
        maintenance: maintenanceMachines,
        utilizationRate: Math.round(utilizationRate * 100) / 100,
      },
      efficiency: {
        oee: 0, // Calcular con datos reales de producción
        performance: 0,
        quality: 0,
        availability: utilizationRate,
      },
    };
  }

  /**
   * Obtiene tendencia de producción de los últimos N días
   */
  async getProductionTrend(days: number = 7): Promise<ProductionTrend[]> {
    const trends: ProductionTrend[] = [];
    const today = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const orders = await this.poRepo.find({
        where: {
          actualStartDate: Between(date, nextDay),
        },
        select: ['quantityPlanned', 'quantityProduced'],
      });

      const planned = orders.reduce((sum, po) => sum + po.quantityPlanned, 0);
      const produced = orders.reduce((sum, po) => sum + (po.quantityProduced || 0), 0);
      const efficiency = planned > 0 ? (produced / planned) * 100 : 0;

      trends.push({
        date: date.toISOString().split('T')[0],
        planned,
        produced,
        efficiency: Math.round(efficiency * 100) / 100,
      });
    }

    return trends;
  }

  /**
   * Obtiene resumen de órdenes por estado
   */
  async getOrdersByStatus() {
    const orders = await this.poRepo
      .createQueryBuilder('po')
      .select('po.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('po.status')
      .getRawMany();

    return orders.map((item) => ({
      status: item.status,
      count: parseInt(item.count, 10),
    }));
  }
}
