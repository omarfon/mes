// src/app/models/audit.model.ts

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'VIEW'
  | 'EXPORT'
  | 'IMPORT'
  | 'APPROVE'
  | 'REJECT'
  | 'BLOCK'
  | 'UNBLOCK';

export interface AuditUser {
  id: string;
  name?: string;
  email?: string;
}

export interface AuditRecord {
  id: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  userId?: string;
  user?: AuditUser;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  module?: string;
  metadata?: Record<string, any>;
  fechaCreacion: string; // ISO date string
}

export interface AuditFilters {
  entityType?: string;
  entityId?: string;
  userId?: string;
  action?: AuditAction;
  module?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAuditResponse {
  data: AuditRecord[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Etiquetas de acciones ────────────────────────────────────────────────────
export const AUDIT_ACTION_LABELS: Record<AuditAction, string> = {
  CREATE: 'Creación',
  UPDATE: 'Actualización',
  DELETE: 'Eliminación',
  VIEW: 'Consulta',
  EXPORT: 'Exportación',
  IMPORT: 'Importación',
  APPROVE: 'Aprobación',
  REJECT: 'Rechazo',
  BLOCK: 'Bloqueo',
  UNBLOCK: 'Desbloqueo',
};

// ─── Colores Tailwind / clases CSS por acción ─────────────────────────────────
export const AUDIT_ACTION_CLASSES: Record<AuditAction, string> = {
  CREATE: 'bg-green-100 text-green-800',
  UPDATE: 'bg-blue-100 text-blue-800',
  DELETE: 'bg-red-100 text-red-800',
  VIEW: 'bg-gray-100 text-gray-700',
  EXPORT: 'bg-yellow-100 text-yellow-800',
  IMPORT: 'bg-orange-100 text-orange-800',
  APPROVE: 'bg-teal-100 text-teal-800',
  REJECT: 'bg-rose-100 text-rose-800',
  BLOCK: 'bg-purple-100 text-purple-800',
  UNBLOCK: 'bg-indigo-100 text-indigo-800',
};

// ─── Mapeo de nombres de entidad backend → etiquetas legibles ────────────────
export const ENTITY_TYPE_LABELS: Record<string, string> = {
  Empresa: 'Empresa',
  Machine: 'Máquina',
  Material: 'Material',
  Product: 'Producto',
  ProductVariant: 'Variante de Producto',
  Operator: 'Operador',
  Workstation: 'Puesto de Trabajo',
  WorkCenter: 'Centro de Trabajo',
  Plant: 'Planta',
  Area: 'Área',
  Process: 'Proceso',
  Supplier: 'Proveedor',
  Turn: 'Turno',
  MotivoParada: 'Motivo de Parada',
  ScrapReason: 'Motivo de Scrap',
  MovementType: 'Tipo de Movimiento',
  OrderType: 'Tipo de Orden',
  UnidadMedida: 'Unidad de Medida',
  Recipe: 'Receta',
  Route: 'Ruta',
  Routing: 'Enrutamiento',
  StandardTime: 'Tiempo Estándar',
  Location: 'Ubicación',
  ShiftGroup: 'Grupo de Turno',
  MaterialLot: 'Lote de Material',
  BillOfMaterials: 'Lista de Materiales',
  PlantCalendar: 'Calendario de Planta',
};
