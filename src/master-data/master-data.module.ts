import { Module } from '@nestjs/common';
import { MachinesController } from './machines/controllers/machines.controller';
import { ProductsController } from './products/products.controller';
import { WorkCentersController } from './work-centers/work-centers.controller';
import { ProductsModule } from './products/products.module';
import { MachinesModule } from './machines/machines.module';
import { RoutesModule } from './routes/routes.module';
import { ShiftsModule } from './schift/schift.module';
import { WorkCentersModule } from './work-centers/work-centers.module';
import { UsersModule } from './users/users.module';
import { TurnosModule } from './turnos/turnos.module';
import { UnidadesMedidaModule } from './unidades-medida/unidades-medida.module';
import { OperadoresModule } from './operadores/operadores.module';
import { MotivosParadaModule } from './motivos-parada/motivos-parada.module';
import { ProcesosModule } from './procesos/procesos.module';

// New Master Data Modules
import { PlantsModule } from './plants/plants.module';
import { AreasModule } from './areas/areas.module';
import { WorkstationsModule } from './workstations/workstations.module';
import { LocationsModule } from './locations/locations.module';
import { PlantCalendarModule } from './plant-calendar/plant-calendar.module';
import { ShiftGroupsModule } from './shift-groups/shift-groups.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';
import { StandardTimesModule } from './standard-times/standard-times.module';
import { OrderTypesModule } from './order-types/order-types.module';
import { MaterialsModule } from './materials/materials.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { MovementTypesModule } from './movement-types/movement-types.module';
import { ScrapReasonsModule } from './scrap-reasons/scrap-reasons.module';
import { MaterialLotsModule } from './material-lots/material-lots.module';
import { RoutingsModule } from './routings/routings.module';
import { RecipesModule } from './recipes/recipes.module';
import { BillOfMaterialsModule } from './bill-of-materials/bill-of-materials.module';

@Module({
  imports:[
    MachinesModule,
    UsersModule,
    ProductsModule,
    RoutesModule,
    ShiftsModule,
    WorkCentersModule,
    TurnosModule,
    UnidadesMedidaModule,
    OperadoresModule,
    MotivosParadaModule,
    ProcesosModule,
    // New Master Data Modules
    PlantsModule,
    AreasModule,
    WorkstationsModule,
    LocationsModule,
    PlantCalendarModule,
    ShiftGroupsModule,
    ProductVariantsModule,
    StandardTimesModule,
    OrderTypesModule,
    MaterialsModule,
    SuppliersModule,
    MovementTypesModule,
    ScrapReasonsModule,
    MaterialLotsModule,
    RoutingsModule,
    RecipesModule,
    BillOfMaterialsModule,
  ],
  controllers: [
    MachinesController, 
    ProductsController, 
    WorkCentersController, 
  ],
  providers: [],
})
export class MasterDataModule {}
