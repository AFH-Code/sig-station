import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './map/home/home.component';
import { MapComponent } from './map/map/map.component';
import { ListeStationComponent } from './map/station/liste-station/liste-station.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: HomeComponent, // this is the component with the <router-outlet> in the template

    children: [
      {
        path: '',
        redirectTo: 'map/stations',
        pathMatch: 'full'
      },
      {
        path: 'map/:type', // child route path
        component: MapComponent, // child route component that the router renders
        children: [
          {
            path: '',
            redirectTo: 'country/0',
            pathMatch: 'full'
          },
          {
            path: ':typeLocalite/:localiteId', // child route path
            component: ListeStationComponent, // child route component that the router renders
            data: { title: 'Liste des comptes connectés' }
          }
        ],
        data: { title: 'Liste des comptes connectés' }
      },
    ],
  },
  { path: '',   redirectTo: '/dashboard/map/stations', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
