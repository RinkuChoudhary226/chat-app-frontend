import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';
import { UserProfDtls } from '../classes/user-prof-dtls';
import { Subscription } from 'rxjs';
import { ProfileDataService } from '../services/profile-data.service';
import { Mentor } from '../classes/mentor';
import { MentorService } from '../services/mentor.service';

@Component({
  selector: 'app-interest-topics',
  templateUrl: './interest-topics.component.html',
  styleUrls: ['./interest-topics.component.scss']
})
export class InterestTopicsComponent implements OnInit {
  isMentor : boolean = AppComponent.appUser.isMentor;

  profNotCompleted : boolean = AppComponent.appUser.profileCompletionStatus.isInterestedTopicsCompleted;
  profileCompleted : boolean = false;
  errorMsg: string = "";
  successMsg: string = "";
  minTopicsRequired : number = 1;
  allTopics: string[] = ["E-commerce", "B2B", "SAAS", "Fintech", "Art and Media", "B2C", "E-learning", "Gameing", "IT"]

  userProfDtls : UserProfDtls //= new UserProfDtls("", "", 0, "", [], [], [], false);
  userProfDtlsSubscription : Subscription;
  
  IntTopicsFrm = this.buildIntTopics();


  buildIntTopics()
  {
    let fb: FormGroup = new FormGroup({});

    let fbIndus: FormGroup = new FormGroup({}, minCheckBoxSelectionValidator(this.minTopicsRequired));
    for(let index in this.allTopics)
    {
      fbIndus.addControl(this.allTopics[index], new FormControl(""));
    }
    fb.addControl("intTopics", fbIndus);
    

    return fb;
  }


  constructor(private appRoute: Router, private profileDataSrv : ProfileDataService, private mentorSrv : MentorService) { }

  ngOnInit(): void {
    if(!this.profNotCompleted)
    {
    this.userProfDtlsSubscription = this.profileDataSrv.profDtlsData$.subscribe(respProfDtls => 
      {
        this.userProfDtls = respProfDtls;
      });
    this.profileDataSrv.setMessage("");
    }
    else
    {
      this.userProfDtls = new UserProfDtls("", "", 0 , "", [], [], [], false);
      this.userProfDtls.interestTopics = [];

    }

  }

  ngOnDestroy() : void {
    if(this.userProfDtlsSubscription != null)
    {
      this.userProfDtlsSubscription.unsubscribe();
    }
  }

  onClickIntTopicsSubmit(data)
  {
    this.errorMsg = "";

    if(this.isMentor == false &&  this.IntTopicsFrm.get("intTopics").hasError("required"))
    {
      this.errorMsg = "Select any one topic";
    }


    if(this.errorMsg != "")
    {
      this.errorMsg = "** " + this.errorMsg;
      return false;
    }
    else
    {

      if (this.IntTopicsFrm.get("intTopics").value != null)
      {
        this.userProfDtls.interestTopics = [];
        for(let index in this.allTopics)
        {
          let ind = this.allTopics[index];
          if(this.IntTopicsFrm.get("intTopics." + ind).value == true)
          {
            this.userProfDtls.interestTopics.push(ind);
          }
        }
      }
      else
        this.userProfDtls.interestTopics = [];

      //Call service to post data
      this.mentorSrv.updateProfile(null, this.userProfDtls, "InterestedTopics").subscribe(response =>
        {
          if (response.statusCode == 200)
          // if(true)
          {
            if(!this.profNotCompleted)
            {
              this.profileDataSrv.setProfDtlsData(this.userProfDtls);
              this.profileDataSrv.setMessage("Interested Topics saved successfully");
              this.profileDataSrv.setDataUpdatedFlag(true);
              this.appRoute.navigate(['/settings/profile']);
            }
            else
            {
              //This is firsttime login and the user completing his profile
              AppComponent.appUser.profileCompletionStatus.isInterestedTopicsCompleted = false;
              this.profileDataSrv.setProfNotCompletedFlag(false);
              this.profileCompleted = true;
              this.appRoute.navigate(['user-home']);
            }
            
          }
          else
          {
            this.errorMsg = "Error: Profile data could not be updated. Please contact admin for further details.";
          }
        });


    }
  }

  onClickCancel()
  {
    this.appRoute.navigate(['/settings/profile']);
  }

  onClickProfileCompleteOK()
  {
    this.appRoute.navigate(['user-home']);

  }

}

export function minCheckBoxSelectionValidator(minRequired = 1): ValidatorFn {
  return function validate (fb: FormGroup) 
  {
    let checked = 0;

    Object.keys(fb.controls).forEach(key => {
      const control = fb.controls[key];

      if (control.value === true) {
        checked ++;
      }
    });

    if(checked < minRequired)
    {
      return {required: true};
    }

    return null;
  }
}