import { AsyncLocalStorage } from 'async_hooks';

/**
 * Contexto de usuario activo por request (AsyncLocalStorage).
 * No es un Injectable; es un singleton de módulo que pueden usar
 * tanto interceptores como subscribers de TypeORM.
 */
export interface AuditUser {
  id?: string;
  email?: string;
  name?: string;
}

export const userContextStorage = new AsyncLocalStorage<AuditUser>();
