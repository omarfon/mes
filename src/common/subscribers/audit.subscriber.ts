import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  SoftRemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { AuditableEntity } from '../entities/auditable.entity';
import { userContextStorage } from '../user-context';

/**
 * AuditSubscriber
 * ─────────────────────────────────────────────────────────────────
 * TypeORM subscriber global que intercepta INSERT / UPDATE /
 * SOFT-REMOVE sobre cualquier entidad que extienda AuditableEntity
 * y rellena automáticamente los campos:
 *   usuCreacion / usuEdicion / usuEliminacion
 *
 * El usuario se obtiene del AsyncLocalStorage que AuditContextInterceptor
 * ha rellenado al inicio del request HTTP.
 * ─────────────────────────────────────────────────────────────────
 */
@Injectable()
@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  // Aplica a cualquier entidad (undefined = todas)
  listenTo() {
    return undefined as any;
  }

  private currentUser(): string | null {
    const ctx = userContextStorage.getStore();
    if (!ctx) return null;
    return ctx.name ?? ctx.email ?? ctx.id ?? null;
  }

  beforeInsert(event: InsertEvent<any>) {
    const entity = event.entity;
    if (!(entity instanceof AuditableEntity)) return;
    const user = this.currentUser();
    if (user) {
      entity.usuCreacion = user;
      entity.usuEdicion = user; // en creación el editor inicial es el mismo
    }
  }

  beforeUpdate(event: UpdateEvent<any>) {
    const entity = event.entity;
    if (!entity || !(entity instanceof AuditableEntity)) return;
    const user = this.currentUser();
    if (user) {
      entity.usuEdicion = user;
    }
  }

  beforeSoftRemove(event: SoftRemoveEvent<any>) {
    const entity = event.entity;
    if (!entity || !(entity instanceof AuditableEntity)) return;
    const user = this.currentUser();
    if (user) {
      entity.usuEliminacion = user;
    }
  }
}
