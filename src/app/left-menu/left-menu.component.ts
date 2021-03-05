import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Subscription } from 'rxjs';
import { ProfileDataService } from '../services/profile-data.service';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.scss']
})
export class LeftMenuComponent implements OnInit {
  
  profNotCompleted : boolean = AppComponent.appUser.profileCompletionStatus.isInterestedTopicsCompleted && 
  AppComponent.appUser.profileCompletionStatus.isPersonalDetailsCompleted &&
  AppComponent.appUser.profileCompletionStatus.isProfessionalDetailsCompleted;

  profCompletedSubscription : Subscription;


  constructor(private profileDataSrv : ProfileDataService) { }

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
  }

  ngOnDestroy() : void
  {
    if(this.profCompletedSubscription != null)
    {
      this.profCompletedSubscription.unsubscribe();
    }
  }

}
