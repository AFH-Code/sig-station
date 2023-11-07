import { NgModule } from '@angular/core';
import { ListeStationComponent } from './liste-station/liste-station.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ListeStationComponent
  ],
  imports: [
    SharedModule
  ]
})
export class StationModule { }
