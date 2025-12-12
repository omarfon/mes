import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { RouteOperation } from './route-operation.entity';

@Entity({ name: 'routes' })
@Index(['code'], { unique: true })
export class Route {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Código único de la ruta
   * Ej: R-HILO30-V1, R-TELA180-V2
   */
  @Column({ type: 'varchar', length: 50 })
  code: string;

  /**
   * Nombre descriptivo de la ruta
   * Ej: "Ruta estándar hilo 30/1"
   */
  @Column({ type: 'varchar', length: 150 })
  name: string;

  /**
   * Versión de la ruta (por si cambias el proceso en el tiempo)
   */
  @Column({ type: 'int', default: 1 })
  version: number;

  /**
   * Descripción opcional
   */
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  /**
   * Producto al que aplica esta ruta
   */
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  /**
   * Vigencia de la ruta
   */
  @Column({ type: 'date', name: 'effective_from', nullable: true })
  effectiveFrom?: Date | null;

  @Column({ type: 'date', name: 'effective_to', nullable: true })
  effectiveTo?: Date | null;

  /**
   * Activa / inactiva
   */
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  /**
   * Operaciones / pasos de la ruta
   */
  @OneToMany(() => RouteOperation, (op) => op.route, {
    cascade: true, // crea/actualiza junto con la ruta
    eager: true,   // opcional: carga operaciones cuando traes la ruta
  })
  operations: RouteOperation[];

  /**
   * Auditoría
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
}
