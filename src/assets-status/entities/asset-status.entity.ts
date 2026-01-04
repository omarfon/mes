import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AssetStatusEnum {
  RUNNING = 'RUNNING',
  STOPPED = 'STOPPED',
  FAULT = 'FAULT',
  IDLE = 'IDLE',
  MAINTENANCE = 'MAINTENANCE',
}

@Entity('asset_status')
export class AssetStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'asset_id' })
  assetId: string;

  @Column({ name: 'asset_code', length: 50 })
  assetCode: string;

  @Column({ name: 'asset_name', length: 200 })
  assetName: string;

  @Column({
    type: 'enum',
    enum: AssetStatusEnum,
    default: AssetStatusEnum.IDLE,
  })
  status: AssetStatusEnum;

  @Column({ name: 'previous_status', type: 'varchar', nullable: true })
  previousStatus: string;

  @Column({ name: 'status_changed_at', type: 'timestamp' })
  statusChangedAt: Date;

  @Column({ name: 'time_in_current_status', type: 'int', default: 0 })
  timeInCurrentStatus: number; // in seconds

  @Column({ name: 'last_seen', type: 'timestamp', nullable: true })
  lastSeen: Date;

  @Column({ name: 'is_connected', type: 'boolean', default: true })
  isConnected: boolean;

  @Column({ name: 'active_alarms', type: 'int', default: 0 })
  activeAlarms: number;

  @Column({ name: 'alarm_details', type: 'jsonb', nullable: true })
  alarmDetails: any;

  @Column({ name: 'current_work_order_id', type: 'uuid', nullable: true })
  currentWorkOrderId: string;

  @Column({ name: 'current_work_order_code', type: 'varchar', nullable: true })
  currentWorkOrderCode: string;

  @Column({ name: 'operator_id', type: 'uuid', nullable: true })
  operatorId: string;

  @Column({ name: 'operator_name', type: 'varchar', nullable: true })
  operatorName: string;

  @Column({ name: 'shift_id', type: 'uuid', nullable: true })
  shiftId: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
