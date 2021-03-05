import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { UserPersonalDtls } from '../classes/user-personal-dtls';
import { UserProfDtls } from '../classes/user-prof-dtls';

@Injectable({
  providedIn: 'root'
})
export class ProfileDataService {

  private persDtlsDataSource = new BehaviorSubject(new UserPersonalDtls("", new Date(), "", "", "", "", "", "", "", ""));
  private profDtlsDataSource = new BehaviorSubject(new UserProfDtls("", "", 0 , "", [], [], [], false));
  private messageDataSource = new BehaviorSubject("");
  private dataUpdatedFlagDataSource = new BehaviorSubject(false);
  private profNotCompletedFlagDataSource = new BehaviorSubject(true);

  persDtlsData$ = this.persDtlsDataSource.asObservable();
  profDtlsData$ = this.profDtlsDataSource.asObservable();
  errorMessage$ = this.messageDataSource.asObservable();
  dataUpdated$ = this.dataUpdatedFlagDataSource.asObservable();
  profNotCompleted$ = this.profNotCompletedFlagDataSource.asObservable();

  setPersDtlsData(persDtlsData : UserPersonalDtls)
  {
      this.persDtlsDataSource.next(persDtlsData);
  }

  setProfDtlsData(profDtlsData : UserProfDtls)
  {
    this.profDtlsDataSource.next(profDtlsData);
  }

  setMessage(msg: string)
  {
    this.messageDataSource.next(msg);
  }

  setDataUpdatedFlag(flag : boolean)
  {
    this.dataUpdatedFlagDataSource.next(flag);
  }

  setProfNotCompletedFlag(flag: boolean)
  {
    this.profNotCompletedFlagDataSource.next(flag);
  }

  constructor() { }
}
