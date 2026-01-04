import { Module } from '@nestjs/common';
import { OrdenesModule } from './ordenes/ordenes.module';
import { DespachoModule } from './despacho/despacho.module';
import { EjecucionModule } from './ejecucion/ejecucion.module';
import { WipModule } from './wip/wip.module';
import { ControlVisualModule } from './control-visual/control-visual.module';
import { ControlTiemposModule } from './control-tiempos/control-tiempos.module';

@Module({
  imports: [
    OrdenesModule,
    DespachoModule,
    EjecucionModule,
    WipModule,
    ControlVisualModule,
    ControlTiemposModule,
  ],
  exports: [
    OrdenesModule,
    DespachoModule,
    EjecucionModule,
    WipModule,
    ControlVisualModule,
    ControlTiemposModule,
  ],
})
export class ProductionModule {}
