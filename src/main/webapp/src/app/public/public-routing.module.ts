import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { LoginComponent } from './home/login/login.component';

const routes: Routes = [
  {
    path: 'public',
    component: HomeComponent, // this is the component with the <router-outlet> in the template
    children: [
      {
        path: '',
        redirectTo: 'h',
        pathMatch: 'full'
      },
      {
        path: 'h', // child route path
        component: LoginComponent, // child route component that the router renders
        data: { title: 'Liste des comptes connectés ' }
      }
    ],
  },
  { path: '',   redirectTo: '/public/h', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
