import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpEvent, HttpErrorResponse, HttpEventType, HttpParams } from '@angular/common/http';
import { appSettings } from '../../helpers/appSettings';
import { Subject, Observable, of,  delay, BehaviorSubject  } from 'rxjs';
import { TokenStorageService } from '../token-storage.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ 
  providedIn: 'root'
})

export class StationService{

  private data = new BehaviorSubject<any>({});
  dataRefresh$ = this.data.asObservable();

  private update = new BehaviorSubject<any>({});
  updateRefresh$ = this.update.asObservable();

  currentUser: any;

  setDataUpdate(value: any): void {
    this.update.next(value);
  }

  setData(value: any): void {
    this.data.next(value);
  }

  setDataStation(value: any): void {
    this.data.next(value);
  }

  constructor(private httpClient: HttpClient, private tokenStorage: TokenStorageService) { 
    this.currentUser = this.tokenStorage.getCurrentUser();
  }


  saveStation(station: any): Observable<any>{
    return this.httpClient.post(appSettings.API_ENDPOINT_PLATFORM + 'principalStation/arrondissement/'+station.arrondissementStation.id+'/operator/'+station.organisationStation.id, {
      "stationName": station.stationName,
      "latitude": station.latitudeStation,
      "longitude": station.longitudeStation,
      "type": station.typeStation.name,
      "typeStation": station.stationType,
      "heightASL": station.heightService,
      "radiusOfService": station.serviceRadius
    }, httpOptions);
  }

  private totalItems=100;

  getStations(page=1,itemsPerPage=20):Observable<string[]>{
    const startIndex=(page-1)*itemsPerPage;
    const endIndex=startIndex+itemsPerPage;
    const items=[];
    for(let i=startIndex;i<endIndex;i++){
      if(i<this.totalItems){
        items.push(`Item ${i+1}`);
      }
    }
    return of(items).pipe(delay(500));
  }

  public getStationCountry(page=1,itemsPerPage=20, typeCouche:any, searchKey: string = '', loadOperator: any = null): Observable<any>
  {
      let httpParams = new HttpParams();
      typeCouche.forEach((type: any) => {
        httpParams = httpParams.append('type', type);
      });
      httpParams = httpParams.append('page', page);
      httpParams = httpParams.append('size', itemsPerPage);
      httpParams = httpParams.append('search', searchKey);

      var httpOptions1 = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: httpParams
      };
      
      //alert(this.currentUser.role)

      if(this.currentUser.operator != null)
      {
        //alert(this.currentUser.operator.id)
        httpParams = httpParams.append('idOperator', this.currentUser.operator.id);
        httpOptions1.params = httpParams;
        return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'principalStation/type', httpOptions1);
      }else{
        if(loadOperator != null)
        {
          httpParams = httpParams.append('idOperator', loadOperator.id);
          httpOptions1.params = httpParams;
        }
        return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'principalStation/type', httpOptions1);
      }
  }

  public getStationRegion(page=1,itemsPerPage=20, typeCouche:any, idRegion: number, searchKey: string = ''): Observable<any>
  {
      let httpParams = new HttpParams();
      typeCouche.forEach((type: any) => {
        httpParams = httpParams.append('type', type);
      });
      httpParams = httpParams.append('page', page);
      httpParams = httpParams.append('size', itemsPerPage);
      httpParams = httpParams.append('search', searchKey);

      var httpOptions1 = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: httpParams
      };

      if(this.currentUser.operator != null)
      {
        httpParams = httpParams.append('idOperator', this.currentUser.operator.id);
        httpOptions1.params = httpParams;
        return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'principalStation/region/'+idRegion, httpOptions1);
      }else{
        return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'principalStation/region/'+idRegion, httpOptions1);
      }
  }

  public getStationDepartement(page=1,itemsPerPage=20, typeCouche:any, idDepartement: number, searchKey: string = ''): Observable<any>
  {
      let httpParams = new HttpParams();
      typeCouche.forEach((type: any) => {
        httpParams = httpParams.append('type', type);
      });
      httpParams = httpParams.append('page', page);
      httpParams = httpParams.append('size', itemsPerPage);
      httpParams = httpParams.append('search', searchKey);

      var httpOptions1 = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
        params: httpParams
      };

      if(this.currentUser.operator != null)
      {
        httpParams = httpParams.append('idOperator', this.currentUser.operator.id);
        httpOptions1.params = httpParams;
        return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'principalStation/departement/'+idDepartement, httpOptions1);
      }else{
        return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'principalStation/departement/'+idDepartement, httpOptions1);
      }
  }

  public getStationArrondissement(page=1,itemsPerPage=20, typeCouche:any, idArrondissement: number, searchKey: string = ''): Observable<any>
  {
    let httpParams = new HttpParams();
    typeCouche.forEach((type: any) => {
      httpParams = httpParams.append('type', type);
    });
    httpParams = httpParams.append('page', page);
    httpParams = httpParams.append('size', itemsPerPage);
    httpParams = httpParams.append('search', searchKey);

    var httpOptions1 = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: httpParams
    };

    if(this.currentUser.operator != null)
    {
      httpParams = httpParams.append('idOperator', this.currentUser.operator.id);
      httpOptions1.params = httpParams;
      return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'principalStation/arrondissement/'+idArrondissement, httpOptions1);
    }else{
      return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'principalStation/arrondissement/'+idArrondissement, httpOptions1);
    }
  }

  public getDetailRegion(idRegion: number): Observable<any>
  {
    return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'region/'+idRegion, httpOptions);
  }
  public getDetailDepartement(idDepartement: number): Observable<any>
  {
    return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'departement/'+idDepartement, httpOptions);
  }
  public getDetailArrondissement(idArrondissement: number): Observable<any>
  {
    return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'arrondissement/id/'+idArrondissement, httpOptions);
  }

  public getStationInfo(idStation: number): Observable<any>
  {
    return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'principalStation/'+idStation, httpOptions);
  }

  findStationId(data: any): Observable<any>{
    return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM + 'principalStation/'+ data.station_id , appSettings.httpOptions);
  }

  updateStation(station: any): Observable<any>{
    return this.httpClient.put(appSettings.API_ENDPOINT_PLATFORM + 'principalStation/id/'+station.id, {
      "stationName": station.stationName,
      "latitude": station.latitudeStation,
      "longitude": station.longitudeStation,
      "type": station.typeStation.name,
      "typeStation": station.stationType,
      "heightASL": station.heightService,
      "radiusOfService": station.serviceRadius,
      "arrondissement": {"id": station.arrondissementStation.id },
      "operator": {"id": station.organisationStation.id }
    }, httpOptions);
  }
  public changeStatusItem(idStation: number): Observable<any>
  {
    return this.httpClient.put(appSettings.API_ENDPOINT_PLATFORM +'principalStation/validate/id/'+idStation, httpOptions);
  }
}
