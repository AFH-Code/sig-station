import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { HomeComponent } from './home/home.component';
import { ListUsersComponent } from './list-users/list-users.component';

@NgModule({
  declarations: [
    HomeComponent,
    ListUsersComponent
  ],
  imports: [
    SharedModule,
    BrowserModule
  ]
})
export class UsersModule { }
