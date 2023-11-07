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
export class UserService {

  private data = new BehaviorSubject<any>({});
  dataRefresh$ = this.data.asObservable();

  private update = new BehaviorSubject<any>({});
  updateRefresh$ = this.update.asObservable();

  setDataUser(value: any): void {
    this.data.next(value);
  }

  setDataUpdate(value: any): void {
    this.update.next(value);
  }

  constructor(private httpClient: HttpClient) { }

  saveUser(user: any): Observable<any>{
    console.log(user.role);

    var operator = '';
    if(user.organisationUser != null && (user.role == 'ADMIN_ORG' || user.role == 'SUPER_ADMIN_ORG'))
      operator = '?idOperator='+user.organisationUser.id;
    
    return this.httpClient.post(appSettings.API_ENDPOINT_PLATFORM + 'auth/register/operator'+''+operator, {
      "firstname": user.firstName,
      "lastname": user.lastName,
      "email": user.email,
      "password": user.password,
      "role": user.role
    }, httpOptions);
  }

  updateUser(user: any): Observable<any>{
    console.log(user.role);
    var operator = '';
    if(user.organisationUser != null && (user.role == 'ADMIN_ORG' || user.role == 'SUPER_ADMIN_ORG'))
      operator = '?idOperator='+user.organisationUser.id;

    return this.httpClient.put(appSettings.API_ENDPOINT_PLATFORM + 'auth/user/'+user.id+''+operator, {
      "firstname": user.firstName,
      "lastname": user.lastName,
      "email": user.email,
      "password": user.password,
      "role": user.role
    }, httpOptions);
  }

  login(credentials: any): Observable<any> {
    return this.httpClient.post(appSettings.API_ENDPOINT_PLATFORM + 'auth/authenticate', {
      email: credentials.username,
      password: credentials.password
    }, httpOptions);
  }
  
  checkUserInfo(token: any): Observable<any> {
    return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM + 'auth/token?token='+token, httpOptions);
  }

  public getAllUsers(page=1,itemsPerPage=20, searchKey: string = ''): Observable<any>
  {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('page', page);
    httpParams = httpParams.append('size', itemsPerPage);
    httpParams = httpParams.append('search', searchKey);

    var httpOptions1 = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      params: httpParams
    };

    return this.httpClient.get(appSettings.API_ENDPOINT_PLATFORM +'auth/user', httpOptions1);
  }
}
