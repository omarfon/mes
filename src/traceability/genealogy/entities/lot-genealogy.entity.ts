import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index
} from 'typeorm';
import { Lot } from '../../lots/entities/lot.entity';

export enum RelationType {
  PARENT = 'PARENT',           // Lot padre
  CHILD = 'CHILD',             // Lot hijo
  COMPONENT = 'COMPONENT',     // Componente consumido
  CONSUMED = 'CONSUMED',       // Material consumido
  PRODUCED = 'PRODUCED',       // Producido desde este lot
  SIBLING = 'SIBLING',         // Hermano (mismo padre)
}

@Entity('lot_genealogy')
@Index(['parentLotId', 'childLotId'], { unique: true })
export class LotGenealogy extends AuditableEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'parent_lot_id' })
  parentLotId: string;

  @Column({ name: 'child_lot_id' })
  childLotId: string;

  @Column({
    type: 'enum',
    enum: RelationType
  })
  relationType: RelationType;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  quantity: number;

  @Column({ nullable: true })
  unitOfMeasure: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'work_order_id', nullable: true })
  workOrderId: string;

  // Relaciones
  @ManyToOne(() => Lot)
  @JoinColumn({ name: 'parent_lot_id' })
  parentLot: Lot;

  @ManyToOne(() => Lot)
  @JoinColumn({ name: 'child_lot_id' })
  childLot: Lot;
}
