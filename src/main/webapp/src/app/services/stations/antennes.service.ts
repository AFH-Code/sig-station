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
export class AntennesService {

  private data = new BehaviorSubject<any>({});
  dataRefresh$ = this.data.asObservable();

  private update = new BehaviorSubject<any>({});
  updateRefresh$ = this.update.asObservable();

  setData(value: any): void {
    this.data.next(value);
  }

  setDataAntenne(value: any): void {
    this.data.next(value);
  }

  setDataUpdate(value: any): void {
    this.update.next(value);
  }

  constructor(private httpClient: HttpClient) { }

  public getAntenneStation(page=1,itemsPerPage=20, searchKey: string = ''): Observable<any>
  {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', page);
    httpParams = httpParams.append('size', itemsPerPage);
    httpParams = httpParams.append('search', searchKey);

    var httpOptions1 = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: httpParams
    };

    return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'antenna', httpOptions1);
  }

  saveAntenne(antenne: any): Observable<any>{
    return this.httpClient.post(appSettings.API_ENDPOINT_PLATFORM + 'antenna/principalStation/'+antenne.stationAntenne.id, {
      "antennaName": antenne.antennaName,
      "azimutRadiation": antenne.azimutRadiation,
      "elevation": antenne.elevation,
      "antennaHeigth": antenne.antennaHeigth,
      "polarization": antenne.polarization,
      "stationAntenne": antenne.stationAntenne,
      "antennaGain": antenne.antennaGain,
      "antennaType": antenne.antennaType.name,
    }, httpOptions);
  }

  updateAntenne(antenne: any): Observable<any>{
    return this.httpClient.put(appSettings.API_ENDPOINT_PLATFORM + 'antenna/'+antenne.id, {
      "antennaName": antenne.antennaName,
      "azimutRadiation": antenne.azimutRadiation,
      "elevation": antenne.elevation,
      "antennaHeigth": antenne.antennaHeigth,
      "polarization": antenne.polarization,
      "stationAntenne": antenne.stationAntenne,
      "antennaGain": antenne.antennaGain,
      "antennaType": antenne.antennaType.name,
      "principal_station": {
        "id": antenne.stationAntenne.id
      }
    }, httpOptions);
  }

  public getAntenneCurrentStation(idStation: number): Observable<any>
  {
    return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'antenna/principalStation/'+idStation, httpOptions);
  }
}
