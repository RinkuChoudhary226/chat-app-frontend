import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from '../app.component';


@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(
    private httpClient: HttpClient) {
  }
  prefix: string = AppComponent.serviceBaseURl;

  public getAllEvents(startDate, endDate): Observable<any> {
    let headers = {
      'Authorization': AppComponent.appUser.bearerToken
    };
    return this.httpClient.get<any>(`${this.prefix}/api/event/all?startDate="${startDate}"&endDate="${endDate}"`, {
      headers
    });
  }
  public registerEvent(eventid: any, userid: any): Observable<any> {
    let headers = {
      'Authorization': AppComponent.appUser.bearerToken
    };
    return this.httpClient.put<any>(`${this.prefix}/api/event/${eventid}/user/${userid}`, {
      headers
    });
  }
  public unregisterEvent(eventid: any, userid: any): Observable<any> {
    let headers = {
      'Authorization': AppComponent.appUser.bearerToken
    };
    return this.httpClient.delete<any>(`${this.prefix}/api/event/${eventid}/user/${userid}`, {
      headers
    });
  }
  public createEvent(payload: any): Observable<any> {
    let headers = {
      'Authorization': AppComponent.appUser.bearerToken
    };
    return this.httpClient.post<any>(`${this.prefix}/api/event`, payload, {
      headers
    });
  }
  public editEvent(payload: any, id: any): Observable<any> {
    let headers = {
      'Authorization': AppComponent.appUser.bearerToken
    };
    return this.httpClient.put<any>(`${this.prefix}/api/event/${id}`, payload, {
      headers
    });
  }
  public deleteEvent(id: any): Observable<any> {
    let headers = {
      'Authorization': AppComponent.appUser.bearerToken
    };
    return this.httpClient.delete<any>(`${this.prefix}/api/event/${id}`, {
      headers
    });
  }
}
