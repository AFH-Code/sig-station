import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './home/home.component';
import { ListOrganisationsComponent } from './list-organisations/list-organisations.component';

@NgModule({
  declarations: [
    HomeComponent,
    ListOrganisationsComponent
  ],
  imports: [
    SharedModule,
    BrowserModule
  ]
})
export class OrganisationsModule { }
