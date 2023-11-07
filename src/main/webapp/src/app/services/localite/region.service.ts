import { Injectable } from '@angular/core';

import { Subject, Observable   } from 'rxjs';
import { HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { appSettings } from '../../helpers/appSettings';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const httpOptions2 = {
  headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data', 'Accept': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class RegionService {

  constructor(private httpClient: HttpClient) { }

  public getAll(): Observable<any> {
    return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'region', httpOptions);
  }
  

  public getGeoJsonLocalite(idLocalite: number, type: string): Observable<any>
  {
    if(type == 'region')
    {
      return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'region/geometry/'+idLocalite, httpOptions);
    }else if(type == 'departement'){
      return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'departement/geometry/'+idLocalite, httpOptions);
    }else if(type == 'arrondissement'){
      return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'arrondissement/geometry/'+idLocalite, httpOptions);
    }else{
      return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'region/geometry/'+idLocalite, httpOptions);
    }
  }
}
