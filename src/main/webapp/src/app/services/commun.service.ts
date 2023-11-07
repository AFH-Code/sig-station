import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  take,
} from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class CommunService {
  private confirmModal = new ReplaySubject<boolean>(1);

  confirm$ = this.confirmModal.asObservable();

  private resfreshImageProfil = new BehaviorSubject<boolean>(false);
  freshImageProfil$ = this.resfreshImageProfil.asObservable();


  private sendAny = new BehaviorSubject<any>(null);
  resfreshAny$ = this.sendAny.asObservable();

  private resfreshShareArticle = new BehaviorSubject<any>(null);
  resfreshShareArticle$ = this.resfreshShareArticle.asObservable();
  constructor(private http: HttpClient) {}

  setresfreshShareArticle(value: any): void {
    this.resfreshShareArticle.next(value);
  }

  setAny(value: any): void {
    this.sendAny.next(value);
  }

  setConfirm(value: boolean): void {
    this.confirmModal.next(value);
  }
  setImage(value: boolean): void {
    this.confirmModal.next(value);
  }
}
