import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {  HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class SlotService {
  constructor(
    private httpClient: HttpClient) {
  }
  prefix: string = AppComponent.serviceBaseURl;

  public createSlot(payload: any): Observable<any> {
    let headers = {
      'Authorization': AppComponent.appUser.bearerToken
    };
    return this.httpClient.post<any>(`${this.prefix}/api/room`, payload, {
      headers
    });
  }
  public getAllSlots(startDate, endDate): Observable<any> {
    let headers = {
      'Authorization': AppComponent.appUser.bearerToken
    };
    return this.httpClient.get<any>(`${this.prefix}/api/room/all?startDate="${startDate}"&endDate="${endDate}"`, {
      headers
    });
  }
  public getAllSlotsByMentor(startDate, endDate, mentorId): Observable<any> {
    let headers = {
      'Authorization': AppComponent.appUser.bearerToken
    };
    return this.httpClient.get<any>(`${this.prefix}/api/room/all?startDate="${startDate}"&endDate="${endDate}"&mentorId=${mentorId}`, {
      headers
    });
  }
  public getAllSlotsByMentee(startDate, endDate, menteeId): Observable<any> {
    let headers = {
      'Authorization': AppComponent.appUser.bearerToken
    };
    return this.httpClient.get<any>(`${this.prefix}/api/room/all?startDate="${startDate}"&endDate="${endDate}"&menteeId=${menteeId}`, {
      headers
    });
  }
  public deleteSlot(id: any): Observable<any> {
    let headers = {
      'Authorization': AppComponent.appUser.bearerToken
    };
    return this.httpClient.delete<any>(`${this.prefix}/api/room/${id}`, {
      headers
    });
  }
  public updateSlot(payload: any, id: any): Observable<any> {
    let headers = {
      'Authorization': AppComponent.appUser.bearerToken
    };
    return this.httpClient.put<any>(`${this.prefix}/api/room/${id}`, payload, {
      headers
    });
  }
  public registerSlot(payload: any, id: any): Observable<any> {
    let headers = {
      'Authorization': AppComponent.appUser.bearerToken
    };
    return this.httpClient.put<any>(`${this.prefix}/api/room/${id}`, payload, {
      headers
    });
  }
  public unRegisterSlot(id: any): Observable<any> {
    let headers = {
      'Authorization': AppComponent.appUser.bearerToken
    };
    return this.httpClient.put<any>(`${this.prefix}/api/room/${id}?status=unbook`, {
      headers
    });
  }
}
