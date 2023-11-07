import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './users/home/home.component';
import { ListUsersComponent } from './users/list-users/list-users.component';
import { ListStationComponent } from './stations/list-station/list-station.component';
import { DetailStationComponent } from './stations/detail-station/detail-station.component';
import { ListAntenneComponent } from './stations/list-antenne/list-antenne.component';
import { ListOrganisationsComponent } from './organisations/list-organisations/list-organisations.component';

const routes: Routes = [
  {
    path: 'admin',
    component: HomeComponent, // this is the component with the <router-outlet> in the template
    children: [
      {
        path: '',
        redirectTo: 'u',
        pathMatch: 'full'
      },
      {
        path: 'u', // child route path
        component: ListUsersComponent, // child route component that the router renders
        data: { title: 'Liste des comptes connectés ' }
      },
      {
        path: 's', // child route path
        component: ListStationComponent, // child route component that the router renders
        data: { title: 'Liste des stations' }
      },
      {
        path: 's/:id', // child route path
        component: DetailStationComponent, // child route component that the router renders
        data: { title: 'Détail Station' }
      },
      {
        path: 'a', // child route path
        component: ListAntenneComponent, // child route component that the router renders
        data: { title: 'Liste des antennes' }
      },
      {
        path: 'o', // child route path
        component: ListOrganisationsComponent, // child route component that the router renders
        data: { title: 'Liste des organisations' }
      }
    ],
  },
  { path: '',   redirectTo: '/admin/u', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
