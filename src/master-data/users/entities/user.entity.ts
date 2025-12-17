import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  OPERATOR = 'OPERATOR',
  VIEWER = 'VIEWER',
}

@Entity({ name: 'users' })
@Index(['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Nombre(s) del usuario
   */
  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  /**
   * Apellido(s) del usuario
   */
  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  /**
   * Correo electrónico (único)
   */
  @Column({ type: 'varchar', length: 150 })
  email: string;

  /**
   * Hash de la contraseña
   * (nunca guardar en texto plano)
   */
  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  /**
   * Rol principal del usuario
   */
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.VIEWER,
  })
  role: UserRole;

  /**
   * Usuario activo/inactivo
   */
  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  /**
   * Campo opcional para vincular con un operario en planta
   * (si quieres conectar usuario del sistema con "operator" del MES)
   */
  @Column({ type: 'uuid', nullable: true })
  operatorId?: string | null;

  /**
   * Campos de auditoría
   */
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt?: Date | null;
  username: any;
}
