import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MapModule } from './map/map.module';


@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    DashboardRoutingModule,
    MapModule
  ]
})
export class DashboardModule { }
