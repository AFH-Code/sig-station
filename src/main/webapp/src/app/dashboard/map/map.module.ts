import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { MapComponent } from './map/map.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { DepartementComponent } from './departement/departement.component';
import { StationModule } from './station/station.module';

@NgModule({
  declarations: [
    HomeComponent,
    MapComponent,
    DepartementComponent
  ],
  imports: [
    SharedModule,
    BrowserModule,
    StationModule
  ]
}) 
export class MapModule { }
