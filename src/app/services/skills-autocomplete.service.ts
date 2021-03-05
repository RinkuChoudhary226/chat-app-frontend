import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppComponent } from '../app.component';

@Injectable({
  providedIn: 'root'
})
export class SkillsAutocompleteService {

  constructor(private myHTTP: HttpClient) { }
  getSkills(skilname:string) : Observable<any> {
    let loginService : string = AppComponent.serviceBaseURl + '/api/search?q=' + skilname;

    let headers = {
      'Content-Type' : 'application/json'
    };

    // debugger
    return this.myHTTP.get<any>(loginService, {headers} );
  }
}
