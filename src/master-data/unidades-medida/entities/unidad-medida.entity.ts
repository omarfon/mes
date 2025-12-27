import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

export enum TipoUnidadMedida {
  LONGITUD = 'LONGITUD',
  MASA = 'MASA',
  VOLUMEN = 'VOLUMEN',
  TIEMPO = 'TIEMPO',
  TEMPERATURA = 'TEMPERATURA',
  CANTIDAD = 'CANTIDAD',
  AREA = 'AREA',
  VELOCIDAD = 'VELOCIDAD',
  PRESION = 'PRESION',
  ENERGIA = 'ENERGIA',
  OTRO = 'OTRO',
}

@Entity({ name: 'unidades_medida' })
@Index(['codigo'], { unique: true })
@Index(['simbolo'], { unique: true })
export class UnidadMedida {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Código único de la unidad (ej: "KG", "M", "L")
   */
  @Column({ type: 'varchar', length: 20 })
  codigo: string;

  /**
   * Nombre descriptivo de la unidad
   */
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  /**
   * Símbolo de la unidad (ej: "kg", "m", "l")
   */
  @Column({ type: 'varchar', length: 10 })
  simbolo: string;

  /**
   * Tipo de unidad de medida
   */
  @Column({
    type: 'enum',
    enum: TipoUnidadMedida,
    default: TipoUnidadMedida.CANTIDAD,
  })
  tipo: TipoUnidadMedida;

  /**
   * Descripción adicional de la unidad
   */
  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  /**
   * Factor de conversión a la unidad base del sistema
   * (ej: 1 kg = 1000 g, entonces factor sería 1000 si g es la base)
   */
  @Column({ type: 'decimal', precision: 20, scale: 10, nullable: true })
  factorConversion?: number;

  /**
   * Unidad base del sistema a la que se convierte
   * (referencia al ID de otra unidad)
   */
  @Column({ type: 'uuid', nullable: true })
  unidadBaseId?: string;

  /**
   * Si es unidad del Sistema Internacional
   */
  @Column({ type: 'boolean', default: false })
  esSI: boolean;

  /**
   * Estado activo/inactivo de la unidad
   */
  @Column({ type: 'boolean', default: true })
  activo: boolean;

  /**
   * Número de decimales a usar por defecto
   */
  @Column({ type: 'int', default: 2 })
  decimales: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;
}
