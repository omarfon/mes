// src/app/models/empresa.model.ts

export interface Empresa {
  id: string;
  ruc: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Respuesta ligera para poblar selectores */
export interface EmpresaSelectItem {
  id: string;
  ruc: string;
  name: string;
}

export interface CreateEmpresaDto {
  ruc: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  active?: boolean;
}

export interface UpdateEmpresaDto extends Partial<CreateEmpresaDto> {}

export interface EmpresaFilters {
  search?: string;
  active?: boolean;
  page?: number;
  limit?: number;
}
