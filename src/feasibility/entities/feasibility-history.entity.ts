import { AuditableEntity } from '../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index
} from 'typeorm';

export enum FeasibilityResultType {
  PRODUCTION_ORDER  = 'PRODUCTION_ORDER',
  PURCHASE_REQUEST  = 'PURCHASE_REQUEST'
}

export enum FeasibilityHistoryStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED   = 'COMPLETED',
  CANCELLED   = 'CANCELLED'
}

@Entity({ name: 'feasibility_history' })
@Index(['studyCode'])
@Index(['status'])
@Index(['approvedDate'])
export class FeasibilityHistory extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, name: 'study_code' })
  studyCode!: string;

  @Column({ type: 'varchar', length: 200, name: 'client_name' })
  clientName!: string;

  @Column({ type: 'varchar', length: 200, name: 'product_name' })
  productName!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  quantity!: number;

  @Column({ type: 'varchar', length: 50, default: 'unidades' })
  uom!: string;

  @Column({ type: 'date', name: 'approved_date' })
  approvedDate!: string;

  @Column({ type: 'varchar', length: 150, name: 'approved_by' })
  approvedBy!: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0, name: 'quote_price' })
  quotePrice!: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency!: string;

  @Column({
    type: 'varchar',
    length: 30,
    name: 'result_type'
  })
  resultType!: FeasibilityResultType;

  @Column({ type: 'varchar', length: 50, name: 'result_code' })
  resultCode!: string;

  @Column({ type: 'date', name: 'result_date' })
  resultDate!: string;

  @Column({ type: 'varchar', length: 20, default: 'IN_PROGRESS' })
  status!: FeasibilityHistoryStatus;
}
