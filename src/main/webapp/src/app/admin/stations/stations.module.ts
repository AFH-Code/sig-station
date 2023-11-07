import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListStationComponent } from './list-station/list-station.component';
import { BrowserModule } from '@angular/platform-browser';
import { DetailStationComponent } from './detail-station/detail-station.component';
import { ListAntenneComponent } from './list-antenne/list-antenne.component';

@NgModule({
  declarations: [
    ListStationComponent,
    DetailStationComponent,
    ListAntenneComponent
  ],
  imports: [
    SharedModule,
    BrowserModule
  ]
})
export class StationsModule { }
