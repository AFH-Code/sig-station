import { Injectable } from '@angular/core';

import { Subject, Observable   } from 'rxjs';
import { HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { appSettings } from '../../helpers/appSettings';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ArrondissementService {

  constructor(private httpClient: HttpClient) { }

  public searchArrondissement(keyword: string): Observable<any> {
    return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'arrondissement?keyword='+keyword, httpOptions);
  }

  public getArrondissementDepart(idDepart: any): Observable<any>
  {
    return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'arrondissement/idDepart/'+idDepart, httpOptions);
  }
}
