import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule, RuleExecution } from './entities';
import { RulesService, RulesEventService } from './services';
import { RulesController } from './controllers';
import { ConditionEvaluator, ActionExecutor } from './evaluators';

@Module({
  imports: [TypeOrmModule.forFeature([Rule, RuleExecution])],
  controllers: [RulesController],
  providers: [RulesService, RulesEventService, ConditionEvaluator, ActionExecutor],
  exports: [RulesService, RulesEventService], // Exportar ambos servicios
})
export class RulesEngineModule {}
