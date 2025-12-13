import { IsNotEmpty, IsString, IsOptional, IsUUID, IsObject } from 'class-validator';

export class LogEventDto {
    /**
     * ID único de la máquina que reporta el evento
     */
    @IsNotEmpty()
    @IsUUID()
    machineId: string;

    /**
     * Nuevo estado de la máquina (ej. ACTIVE, STOPPED, MAINTENANCE, ERROR)
     */
    @IsNotEmpty()
    @IsString()
    status: string;

    /**
     * Código opcional de motivo (ej. ERR-001, STOP-USER)
     */
    @IsOptional()
    @IsString()
    reasonCode?: string;

    /**
     * Metadatos adicionales del evento (temperatura, velocidad, operario, etc.)
     */
    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}
