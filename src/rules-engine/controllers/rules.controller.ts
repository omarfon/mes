import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { RulesService } from '../services/rules.service';
import {
  CreateRuleDto,
  UpdateRuleDto,
  TriggerRuleDto,
  ExecuteRuleDto,
} from '../dto';
import { RuleEventType, RuleStatus, ExecutionResult } from '../types/rule-enums';

@Controller('rules-engine')
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  /**
   * POST /rules-engine
   * Crea una nueva regla
   */
  @Post()
  async create(@Body() dto: CreateRuleDto) {
    return this.rulesService.create(dto);
  }

  /**
   * GET /rules-engine
   * Lista todas las reglas con filtros opcionales
   */
  @Get()
  async findAll(
    @Query('eventType') eventType?: RuleEventType,
    @Query('status') status?: RuleStatus,
    @Query('scope') scope?: string,
    @Query('enabled') enabled?: string,
  ) {
    const filters: any = {};
    
    if (eventType) filters.eventType = eventType;
    if (status) filters.status = status;
    if (scope) filters.scope = scope;
    if (enabled !== undefined) filters.enabled = enabled === 'true';

    const rules = await this.rulesService.findAll(filters);
    
    return {
      data: rules,
      total: rules.length,
    };
  }

  /**
   * GET /rules-engine/:id
   * Obtiene una regla por ID
   */
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rulesService.findOne(id);
  }

  /**
   * GET /rules-engine/code/:code
   * Obtiene una regla por código
   */
  @Get('code/:code')
  async findByCode(@Param('code') code: string) {
    return this.rulesService.findByCode(code);
  }

  /**
   * PUT /rules-engine/:id
   * Actualiza una regla
   */
  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRuleDto,
  ) {
    return this.rulesService.update(id, dto);
  }

  /**
   * DELETE /rules-engine/:id
   * Elimina una regla (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.rulesService.remove(id);
  }

  /**
   * PUT /rules-engine/:id/toggle
   * Habilita o deshabilita una regla
   */
  @Put(':id/toggle')
  async toggleEnabled(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('enabled', ParseBoolPipe) enabled: boolean,
  ) {
    return this.rulesService.toggleEnabled(id, enabled);
  }

  /**
   * POST /rules-engine/trigger
   * Dispara reglas para un evento específico
   */
  @Post('trigger')
  async triggerEvent(@Body() dto: TriggerRuleDto) {
    const context = {
      eventType: dto.eventType,
      entityType: dto.entityType,
      entityId: dto.entityId,
      entityData: dto.entityData,
      timestamp: new Date(),
      plantCode: dto.plantCode,
      areaCode: dto.areaCode,
      workCenterCode: dto.workCenterCode,
      machineCode: dto.machineCode,
      productCode: dto.productCode,
      orderTypeCode: dto.orderTypeCode,
      userId: dto.userId,
      metadata: dto.metadata,
    };

    const results = await this.rulesService.triggerEvent(dto.eventType, context);
    
    return {
      triggered: results.length,
      results,
    };
  }

  /**
   * POST /rules-engine/:id/execute
   * Ejecuta una regla específica manualmente
   */
  @Post(':id/execute')
  async executeRule(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: ExecuteRuleDto,
  ) {
    const rule = await this.rulesService.findOne(id);
    const context = {
      ...dto.context,
      timestamp: new Date(),
    };

    return this.rulesService.executeRule(rule, context);
  }

  /**
   * GET /rules-engine/:id/stats
   * Obtiene estadísticas de una regla
   */
  @Get(':id/stats')
  async getRuleStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.rulesService.getRuleStats(id);
  }

  /**
   * GET /rules-engine/executions/history
   * Obtiene el historial de ejecuciones
   */
  @Get('executions/history')
  async getExecutionHistory(
    @Query('ruleId') ruleId?: string,
    @Query('ruleCode') ruleCode?: string,
    @Query('eventType') eventType?: string,
    @Query('result') result?: ExecutionResult,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('limit') limit?: string,
  ) {
    const filters: any = {};
    
    if (ruleId) filters.ruleId = ruleId;
    if (ruleCode) filters.ruleCode = ruleCode;
    if (eventType) filters.eventType = eventType;
    if (result) filters.result = result;
    if (from) filters.from = new Date(from);
    if (to) filters.to = new Date(to);
    if (limit) filters.limit = parseInt(limit, 10);

    const executions = await this.rulesService.getExecutionHistory(filters);
    
    return {
      data: executions,
      total: executions.length,
    };
  }
}
