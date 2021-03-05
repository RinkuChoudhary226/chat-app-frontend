import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {FormControl, ReactiveFormsModule, ValidatorFn, FormGroup, Validators, AbstractControl, FormArray} from '@angular/forms';
import { Router } from '@angular/router';
import { UserProfDtls } from '../classes/user-prof-dtls';
import { AppComponent } from '../app.component';
import { ProfileDataService } from '../services/profile-data.service';
import { Subscription } from 'rxjs';
import { MentorService } from '../services/mentor.service';
import { SkillsAutocompleteService } from '../services/skills-autocomplete.service';

@Component({
  selector: 'app-prof-details',
  templateUrl: './prof-details.component.html',
  styleUrls: ['./prof-details.component.scss']
})
export class ProfDetailsComponent implements OnInit {
  @ViewChild('fileUpload123') fileUploadchild: ElementRef<HTMLElement>;

  isMentor : boolean = AppComponent.appUser.isMentor;
  languages : string[] = ["English", "Hindi", "Arabic", "Telugu", "French", "Spanish"];
  skills: string[] = [];
  allIndustries: string[] = ["E-commerce", "B2B", "SAAS", "Fintech", "Art and Media", "B2C", "E-learning", "Gameing", "IT"]
  fileName: string = "Choose file..";
  errorMsg : string = "";
  successMsg : string = "";
  profNotCompleted : boolean = AppComponent.appUser.profileCompletionStatus.isProfessionalDetailsCompleted;
  userProfDtls : UserProfDtls ; //= new UserProfDtls("", "", 0 , "", [], [], [], false);
  userProfDtlsSubscription : Subscription;
  /*
  Autocomplete is here
  */
  // skill?:string;
  searchedskills: object[] = [];

  getSkils(event) {
      if (event.length > 0) {
        this.skillService.getSkills(event).subscribe(suggestions=>{
          this.searchedskills = suggestions.content.data[0].options.map((source) => {
            return {
            title: source._source.skill
            }
            });
          console.log(this.searchedskills);
        })
        //this.searchedskills = this.skils.filter(el => el.title.indexOf(event) !== -1);
      } else {
        this.searchedskills = [];
      }
    }

    clearSearch() {
      this.searchedskills = [];
    }

    select(event) {
      this.skills.push(event.title)
    }
  
  
  profDtlsFrm = this.buildProfDtls();

  buildProfDtls()
  {
    let fb: FormGroup = new FormGroup({});
    fb.addControl("jobTitle", new FormControl("", [Validators.required]));
    fb.addControl("organization", new FormControl("", [Validators.required]));
    fb.addControl("jobDesc", new FormControl("", [Validators.required]));
    fb.addControl("resumeFile", new FormControl(""));
    fb.addControl("totalExp", new FormControl("", [Validators.pattern("^[0-9][0-9]")]));
    fb.addControl("jobReferral", new FormControl(""));
    fb.addControl("languages", new FormControl("", [Validators.required]));
    // fb.addControl("lang2", new FormControl(""));
    if (AppComponent.appUser.isMentor == true)
    {
      fb.addControl("skills", new FormControl("", [Validators.required]));
    }
    else
    {
      fb.addControl("skills", new FormControl(""));
    }
    // fb.addControl("skill2", new FormControl(""));

    let fbIndus: FormGroup = new FormGroup({});
    for(let index in this.allIndustries)
    {
      fbIndus.addControl(this.allIndustries[index], new FormControl(""));
    }
    fb.addControl("industries", fbIndus);
    

    return fb;
  }

  constructor(private appRoute: Router, private profileDataSrv : ProfileDataService, private mentorSrv : MentorService, private skillService:SkillsAutocompleteService) { }

  ngOnInit(): void {
    // this.skill = "sample skill";
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

    }
  }

  ngOnDestroy() : void
  {
    if(this.userProfDtlsSubscription != null)
    {
      this.userProfDtlsSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {
    console.log("Hello ", this.fileUploadchild.nativeElement);
}

  resumeFileUpload(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0])
    {
      let myFile = <File>fileInput.target.files[0];
      this.profDtlsFrm.patchValue( {"fileInputLbl": myFile.name} );
      this.fileName = myFile.name;
    }
  }

  fileInputClick()
  {
    let el: HTMLElement = this.fileUploadchild.nativeElement;
    el.click();

  }

  
  
  onClickProfDtlsSubmit(data)
  {
    this.errorMsg = "";

    if (this.profDtlsFrm.get("jobTitle").hasError("required"))
    {
      this.errorMsg = "Enter Job Title"
    }    
    else if (this.profDtlsFrm.get("jobDesc").hasError("required"))
    {
      this.errorMsg = "Enter Job Description"
    }    
    else if (this.profDtlsFrm.get("organization").hasError("required"))
    {
      this.errorMsg = "Enter organization"
    } 
    else if (this.isMentor && this.profDtlsFrm.get("skills").hasError("required"))
    {
      this.errorMsg = "Enter skills known"
    }
   
   
    if(this.errorMsg != "")
    {
      this.errorMsg = "** " + this.errorMsg;
      return false;
    }
    else
    {
      this.userProfDtls.jobTitle = this.profDtlsFrm.get("jobTitle").value;
      this.userProfDtls.jobDescription = this.profDtlsFrm.get("jobDesc").value;
      this.userProfDtls.organization = this.profDtlsFrm.get("organization").value;
      if(typeof this.profDtlsFrm.get("totalExp").value != 'undefined')
        this.userProfDtls.totalExperience = this.profDtlsFrm.get("totalExp").value;
      if (this.profDtlsFrm.get("jobReferral").value == "true")
        this.userProfDtls.jobRefNeeded = this.profDtlsFrm.get("jobReferral").value;
      else
        this.userProfDtls.jobRefNeeded = false;
      this.userProfDtls.languagesArr = this.profDtlsFrm.get("languages").value;
      this.userProfDtls.skillsArr = this.profDtlsFrm.get("skills").value;
      if (this.profDtlsFrm.get("industries").value != null)
      {
        this.userProfDtls.industryWork = [];
        for(let index in this.allIndustries)
        {
          let ind = this.allIndustries[index];
          if(this.profDtlsFrm.get("industries." + ind).value == true)
          {
            this.userProfDtls.industryWork.push(ind);
          }
        }
      }
      else
        this.userProfDtls.industryWork = [];

      //Call service to post data
      this.mentorSrv.updateProfile(null, this.userProfDtls, "ProfessionalDetails").subscribe(response =>
        {
          if (response.statusCode == 200)
          //if(true)
          {
            if(!this.profNotCompleted)
            {
              this.profileDataSrv.setProfDtlsData(this.userProfDtls);
              this.profileDataSrv.setMessage("Professional details saved successfully");
              this.profileDataSrv.setDataUpdatedFlag(true);
              this.appRoute.navigate(['/settings/profile']);
            }
            else
            {
              //This is firsttime login and the user completing his profile
              this.appRoute.navigate(['complete-profile/interest-topics']);
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

}
