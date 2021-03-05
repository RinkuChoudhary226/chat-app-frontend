import { Component, OnInit, Input } from '@angular/core';
import { UserPersonalDtls } from '../classes/user-personal-dtls';
import { UserProfDtls } from '../classes/user-prof-dtls';
import { MentorService } from '../services/mentor.service';
import { AppComponent } from '../app.component';
import { ProfileDataService } from '../services/profile-data.service';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-view-profile',
  templateUrl: './view-profile.component.html',
  styleUrls: ['./view-profile.component.scss']
})
export class ViewProfileComponent implements OnInit {

  @Input('mentorId') mentorId: string = "";

  persDtls : UserPersonalDtls; // = new UserPersonalDtls("", new Date(), "", "", "", "", "", "", "", "");
  profDtls : UserProfDtls = new UserProfDtls("", "", 0, "", [], [], [], false);
  intTopics : string[] = [];
  errorMessage : string = "";
  dataUpdated : boolean = false;

  //subscription declarations
  persDtlsSubscription : Subscription;
  profDtlsSubscription : Subscription;
  childErrMsgSubscription : Subscription;
  childUpdFlagSubscription : Subscription;

  constructor(private mentorSrv : MentorService, private profileDataSrv : ProfileDataService,
    private route :Router) { }


  ngOnInit(): void {
    let currentUrl = this.route.url;
    
    //Current users profile
    if(currentUrl == "/settings/profile" && this.mentorId == "")
    {
      //Subscribe for data changes
      this.persDtlsSubscription = this.profileDataSrv.persDtlsData$.subscribe(responsePersDtls =>
        {
          this.persDtls = responsePersDtls;
        });
        this.profDtlsSubscription = this.profileDataSrv.profDtlsData$.subscribe(responseProfDtls =>
          {
            this.profDtls = responseProfDtls;
          });
        this.childErrMsgSubscription = this.profileDataSrv.errorMessage$.subscribe(responseMessage =>
          {
            this.errorMessage = responseMessage;
          });
      this.childUpdFlagSubscription = this.profileDataSrv.dataUpdated$.subscribe(responseUpdFlag => 
        {
          this.dataUpdated = responseUpdFlag;
        });

      if (this.dataUpdated == false)
      {
        this.fetchUserProfileData(AppComponent.appUser.userId);

          //Push data to profile data service
        this.profileDataSrv.setPersDtlsData(this.persDtls);
        this.profileDataSrv.setProfDtlsData(this.profDtls);
      }
    }
    //Coming from mentor screen
    else 
    {
      this.persDtls = new UserPersonalDtls("", new Date(), "", "", "", "", "", "", "", "");
      this.profDtls = new UserProfDtls("", "", 0, "", [], [], [], false);
      this.intTopics = [];

      this.fetchUserProfileData(this.mentorId);
    }

  }

  ngOnDestroy() : void
  {
    if(this.persDtlsSubscription != null)
    {
      this.persDtlsSubscription.unsubscribe();
    }
    if(this.profDtlsSubscription != null)
    {
      this.profDtlsSubscription.unsubscribe();
    }
    if(this.childErrMsgSubscription != null)
    {
      this.childErrMsgSubscription.unsubscribe();
      this.profileDataSrv.setMessage("");
    }
    if(this.childUpdFlagSubscription != null)
    {
      this.profileDataSrv.setDataUpdatedFlag(false);
      this.childUpdFlagSubscription.unsubscribe();
    }
  }

  fetchUserProfileData(userId : string)
  {
    if (userId != "") 
    {
      // Viewing a selected mentor's profile
      //Service call with the mentorId
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
              if(response.statusCode == 200)
              {
                let mentorData = response.content.users[0];
                this.processUserData(mentorData);
              }
    
            });
    
        }
      }
      catch
      {
        console.debug("Error");
      }
    }
  }

  processUserData(data: any)
  {
    this.persDtls.fullname = data.fullName;
    this.persDtls.email = data.email;
    // this.persDtls.address = mentorData.address;
    this.persDtls.dateOfBirth = data.birthDate;
    this.persDtls.city = data.personal_city
    this.persDtls.state = data.personal_state;
    this.persDtls.country = data.personal_country;
    this.persDtls.phoneNum = data.mobile;
    this.persDtls.countryCode = data.countryCode;
    this.persDtls.profileImgFileId = data.profileImage;
    //this.persDtls.profileImgFileName = data.

    this.profDtls.jobTitle = data.jobTitle;
    this.profDtls.jobDescription = data.jobDescription;
    this.profDtls.totalExperience = data.experience;
    // if ()
    this.profDtls.skillsArr = data.skills;
    this.profDtls.languagesArr= data.languages;
    this.profDtls.industryWork = data.industriesWorkingIn;
    this.profDtls.jobRefNeeded = data.referral;
    this.profDtls.organization = data.currentOrganization;
    // this.profDtls.starRating = mentorData.starRating;

    this.profDtls.interestTopics = data.interestedTopics;
  }

}
