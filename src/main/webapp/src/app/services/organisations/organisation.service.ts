import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType, HttpParams } from '@angular/common/http';
import { appSettings } from '../../helpers/appSettings';
import { Subject, Observable, of,  delay, BehaviorSubject  } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class OrganisationService {

  private data = new BehaviorSubject<any>({});
  dataRefresh$ = this.data.asObservable();

  private update = new BehaviorSubject<any>({});
  updateRefresh$ = this.update.asObservable();

  setData(value: any): void {
    this.data.next(value);
  }

  setDataUpdate(value: any): void {
    this.update.next(value);
  }

  constructor(private httpClient: HttpClient) { }

  setDataOrganisation(value: any): void {
    this.data.next(value);
  }

  public getOrganisations(page=1,itemsPerPage=20, searchKey: string = ''): Observable<any>
  {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', page);
    httpParams = httpParams.append('size', itemsPerPage);
    httpParams = httpParams.append('search', searchKey);

    var httpOptions1 = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: httpParams
    };

    return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'operator', httpOptions1);
  }

  public getOrganisationsStats(page=1,itemsPerPage=20, searchKey: string = ''): Observable<any>
  {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', page);
    httpParams = httpParams.append('size', itemsPerPage);
    httpParams = httpParams.append('search', searchKey);

    var httpOptions1 = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: httpParams
    };

    return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'operator/stationCount', httpOptions1);
  }

  saveOrganisation(organisation: any): Observable<any>{
    return this.httpClient.post(appSettings.API_ENDPOINT_PLATFORM + 'operator', {
      "ownerName": organisation.ownerName,
      "ownerAdress": organisation.ownerAdress,
      "telephone": organisation.telephone,
      "fax": organisation.fax,
      "email": organisation.email
    }, httpOptions);
  }

  updateOrganisation(organisation: any): Observable<any>{
    return this.httpClient.put(appSettings.API_ENDPOINT_PLATFORM + 'operator/'+organisation.id, {
      "ownerName": organisation.ownerName,
      "ownerAdress": organisation.ownerAdress,
      "telephone": organisation.telephone,
      "fax": organisation.fax,
      "email": organisation.email
    }, httpOptions);
  }

  deleteOrganisation(idOrganisation: number): Observable<any>{
    return this.httpClient.delete(appSettings.API_ENDPOINT_PLATFORM + 'operator/'+idOrganisation, httpOptions);
  }
}
