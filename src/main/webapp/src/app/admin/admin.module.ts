import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { UsersModule } from './users/users.module';
import { StationsModule } from './stations/stations.module';
import { OrganisationsModule } from './organisations/organisations.module';

@NgModule({
  declarations: [
  ],
  imports: [
    AdminRoutingModule,
    UsersModule,
    StationsModule,
    OrganisationsModule
  ]
})
export class AdminModule { }
