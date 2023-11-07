

import { HTTP_INTERCEPTORS, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { TokenStorageService } from '../services/token-storage.service';
import { Observable } from 'rxjs';
import { finalize } from "rxjs/operators";

const TOKEN_HEADER_KEY = 'X-Bearer-Token';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = req;
    const token = this.token.getToken();
    if (token != null) {
      //alert(token);
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, token) });
    }else{
      authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, '0') });
    }
    return next.handle(authReq);
  }
}

export const authInterceptorProviders = [ 
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
