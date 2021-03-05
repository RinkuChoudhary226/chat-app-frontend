import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import {Router} from '@angular/router';
import { Subscription } from 'rxjs';
import { ProfileDataService } from '../services/profile-data.service';
import { SafeUrl } from '@angular/platform-browser';
import { MentorService } from '../services/mentor.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userName: string = AppComponent.appUser.userName;
  profilePic : SafeUrl = AppComponent.appUser.profilePic;
  profilePicExists : boolean = false;
  profNotCompleted : boolean = AppComponent.appUser.profileCompletionStatus.isInterestedTopicsCompleted && 
  AppComponent.appUser.profileCompletionStatus.isPersonalDetailsCompleted &&
  AppComponent.appUser.profileCompletionStatus.isProfessionalDetailsCompleted;
  profCompletedSubscription : Subscription;

  
  constructor(private appRoute: Router, private profileDataSrv : ProfileDataService, private longinSrv : MentorService) { }

  ngOnInit(): void {
    if(AppComponent.appUser.profileCompletionStatus.isInterestedTopicsCompleted && 
      AppComponent.appUser.profileCompletionStatus.isPersonalDetailsCompleted &&
      AppComponent.appUser.profileCompletionStatus.isProfessionalDetailsCompleted)
    {
      this.profCompletedSubscription = this.profileDataSrv.profNotCompleted$.subscribe(completedFlag =>
        {
          this.profNotCompleted = completedFlag;
        });
    }

    //Get Profile Pic
    if(AppComponent.appUser.profileImageId != "" && AppComponent.appUser.profileImageId != null)
    {
      this.longinSrv.getUserFile(AppComponent.appUser.profileImageId).subscribe(response => {
        let data = response.blob.data;
        if (response.blob.data != null)
        {
          this.profilePic = this.longinSrv.convertProfilePic(response.blob.data);
          AppComponent.appUser.profilePic = this.profilePic;
          this.profilePicExists = true;
        }
      
      }, (err: HttpErrorResponse) => 
      {
        console.debug(err.message);
      }
    );
    }
    
  }

  ngOnDestroy() : void
  {
    if(this.profCompletedSubscription != null)
    {
      this.profCompletedSubscription.unsubscribe();
    }
  }

  signout()
  {
    // AppComponent.sessionState = false;
    //this.appRoute.navigate(['site-home']);
    localStorage.clear();
    this.appRoute.navigate(['/settings/profile']); 
  }

}
