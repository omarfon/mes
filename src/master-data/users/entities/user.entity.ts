import { AuditableEntity } from '../../../common/entities/auditable.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index
} from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  OPERATOR = 'OPERATOR',
  VIEWER = 'VIEWER'
}

@Entity({ name: 'users' })
@Index(['email'], { unique: true })
export class User extends AuditableEntity {
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
    default: UserRole.VIEWER
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
   * Token para recuperación de contraseña (se limpia tras usarse o expirar)
   */
  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  resetPasswordToken: string | null;

  /**
   * Fecha de expiración del token de recuperación (1 hora por defecto)
   */
  @Column({ type: 'timestamptz', nullable: true, default: null })
  resetPasswordExpires: Date | null;

  username: any;
}
