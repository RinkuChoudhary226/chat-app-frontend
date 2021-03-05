import { Component, OnInit } from '@angular/core';
import { UserInfo } from './classes/user-info';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'findAch';

  public static sessionState : boolean = false;
  public static serviceBaseURl: string = "http://206.189.135.43:3001";
  public static fileUploadBaseURL: string = "http://206.189.135.43:3001"
  public static appUser: UserInfo;

  constructor(private appRoute : Router){

  }

  get getSessionState() 
  {
    return AppComponent.sessionState;
  }

  public static logError(error : any, component : string, method : string)
  {
    try
    {
      console.log("Error occurred in '" + component + "' Component, '" + method + "' Method.") ;
      console.log(error);

    }
    catch(ex)
    {
      throwError;
    }

  }

  ngOnInit(){
    if(localStorage.getItem('user')!==null)
    {
      console.log(JSON.parse(localStorage.getItem('user')));
      AppComponent.appUser = JSON.parse(localStorage.getItem('user'));
    }
    else{
      console.log("User not there yet, should login first")
    }
    if(AppComponent.appUser){
      AppComponent.sessionState = true;
      this.appRoute.navigate(['/user-home']); 
    }
    else{
      AppComponent.sessionState = false;
    }
  }
}
