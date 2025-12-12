import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export enum ProductType {
  FINISHED = 'FINISHED',         // Producto terminado
  SEMI_FINISHED = 'SEMI_FINISHED', // Semielaborado / intermedio
  RAW_MATERIAL = 'RAW_MATERIAL', // Materia prima
  PACKAGING = 'PACKAGING',       // Envases / embalajes
  SERVICE = 'SERVICE',           // Servicio (si aplica)
}

@Entity({ name: 'products' })
@Index(['code'], { unique: true })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Código único de producto
   * Ej: HILO-30-CRUDO, TELA-JERSEY-180G
   */
  @Column({ type: 'varchar', length: 50 })
  code: string;

  /**
   * Nombre descriptivo del producto
   */
  @Column({ type: 'varchar', length: 150 })
  name: string;

  /**
   * Descripción detallada (opcional)
   */
  @Column({ type: 'text', nullable: true })
  description?: string | null;

  /**
   * Tipo de producto (terminado, materia prima, etc.)
   */
  @Column({
    type: 'enum',
    enum: ProductType,
    default: ProductType.FINISHED,
  })
  type: ProductType;

  /**
   * Unidad de medida
   * Ej: KG, M, UNID, CONO, BOBINA
   */
  @Column({ type: 'varchar', length: 20, default: 'UNID' })
  unitOfMeasure: string;

  /**
   * Familia de producto
   * Ej: HILOS, TELAS, INSUMOS
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  family?: string | null;

  /**
   * Subfamilia de producto
   * Ej: "HILO PEINADO 30/1", "TELA JERSEY"
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  subfamily?: string | null;

  /**
   * Código de producto en ERP (si difiere)
   */
  @Column({ type: 'varchar', length: 50, nullable: true })
  erpCode?: string | null;

  /**
   * Flag de producto activo
   */
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

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
