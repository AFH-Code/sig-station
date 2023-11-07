import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';


@NgModule({
  declarations: [
    LoginComponent,
    HomeComponent
  ],
  imports: [
    SharedModule,
    BrowserModule
  ]
})
export class HomeModule { }
