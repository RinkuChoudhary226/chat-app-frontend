import { Component, OnInit } from '@angular/core';
import { UserPersonalDtls } from '../classes/user-personal-dtls';
import { UserProfDtls } from '../classes/user-prof-dtls';
import { MentorService } from '../services/mentor.service';
import { AppComponent } from '../app.component';
import { Subscription } from 'rxjs';
import { ProfileDataService } from '../services/profile-data.service';

@Component({
  selector: 'app-complete-profile',
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss']
})
export class CompleteProfileComponent implements OnInit {
  persDtls : UserPersonalDtls = new UserPersonalDtls("", null, "", "", "", "", "", "", "", "");
  profDtls : UserProfDtls = new UserProfDtls("", "", 0, "", [], [], [], false);

  perDtlsSubscription : Subscription;
  profDtlsSubscription : Subscription;

  constructor(private mentorSrv : MentorService, private profileDataSrv : ProfileDataService) { }

  ngOnInit(): void {

    let userId = AppComponent.appUser.userId;
    try
    {
      if (AppComponent.appUser.isMentor == true)
      {
        this.mentorSrv.getMentorData(userId).subscribe(response =>
          {
            if(response.statusCode == 200)
            {
              let userData = response.content[0];
              this.processUserData(userData);
            }
          });
      }
      else
      {
        this.mentorSrv.getUserData(userId).subscribe(response =>
          {
            // if (response.length > 0 )
            // {
            //   let mentorData = response[0];
            //   this.processUserData(mentorData);
            // }
            if(response.statusCode == 200)
            {
              let mentorData = response.content.users[0];
              this.processUserData(mentorData);
            }
  
          });
  
      }
    }
    catch(ex)
    {
      AppComponent.logError(ex, "CompleteProfile", "ngOnInit");
    }

  }

  processUserData(data : any)
  {
    this.persDtls.fullname = data.username;
    this.persDtls.email = data.email;


    // this.perDtlsSubscription = this.profileDataSrv.persDtlsData$.subscribe(respPersDtls => 
    //   {
    //     this.persDtls = respPersDtls;
    //   });
    this.profileDataSrv.setDataUpdatedFlag(false);
    this.profileDataSrv.setMessage("");
    this.profileDataSrv.setPersDtlsData(this.persDtls);

  }

}
