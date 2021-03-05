import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { UserPersonalDtls } from '../classes/user-personal-dtls';
import { AppComponent } from '../app.component';
import { ProfileDataService } from '../services/profile-data.service';
import { Subscription } from 'rxjs';
import { MentorService } from '../services/mentor.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-create-proj',
  templateUrl: './create-proj.component.html',
  styleUrls: ['./create-proj.component.scss']
})
export class CreateProjComponent implements OnInit {

  @ViewChild('fileUpload123') fileUploadchild: ElementRef<HTMLElement>;

  // @Output() newItemEvent = new EventEmitter<string>();
  userPersDtls : UserPersonalDtls;
  dob : Date;
  persDtlsDataSubscription : Subscription;

  //profNotCompleted: boolean = AppComponent.appUser.profNotCompleted;
  errorMsg : string = "";
  successMsg : string = "";

  fileName : string = "";
  fileObj : File = null;
  
  allIndiaStates : string[] = ['Andhra Pradesh', 'Assam', 'Arunachal Pradesh', 'Bihar', 'Goa', 'Gujarat', 'Jammu and Kashmir', 
    'Jharkhand', 'West Bengal', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
    'Nagaland', 'Orissa', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Tripura', 'Uttaranchal', 'Uttar Pradesh', 'Haryana', 
    'Himachal Pradesh', 'Chhattisgarh'];

  personalDtlsFrm = this.buildProfDtls();
  
  buildProfDtls ()
  {
    let fb:  FormGroup = new FormGroup({});
    fb.addControl("name", new FormControl("", Validators.required));
    // fb.addControl("age", new FormControl("", [Validators.required, Validators.min(18), Validators.max(100)]));
    fb.addControl("dob", new FormControl("", [Validators.required, checkDOB]));
    let fbIndStates: FormGroup = new FormGroup({});
    for(let index in this.allIndiaStates)
    {
      fbIndStates.addControl(this.allIndiaStates[index], new FormControl(""));
    }
    fb.addControl("email", new FormControl("", 
      [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]
    ));
    // fb.addControl("address", new FormControl("", Validators.required));
    fb.addControl("city", new FormControl("", Validators.required));
    fb.addControl("state", new FormControl("", Validators.required));
    fb.addControl("idianState", fbIndStates);
    fb.addControl("country", new FormControl("", Validators.required));
    fb.addControl("countryCode", new FormControl("", 
      [Validators.pattern("^[+][0-9]+$")]
    ));
    // fb.addControl("pinCode", new FormControl("", 
    //   [Validators.required, Validators.pattern("^[0-9]+$")]
    // ));
    fb.addControl("phoneNum", new FormControl("", 
      [Validators.pattern("^[0-9]+$")]
    ));
    fb.addControl("profImgFile", new FormControl(""));

    return fb;
  }
  
  
  constructor(private appRoute: Router, private profileDataSrv: ProfileDataService, private mentorSrv: MentorService) {

   }



  ngOnInit(): void {
    
  }

  ngOnDestroy() : void
  {
    
  }

  ngAfterViewInit()
  {
  }


  onClickPersDtlsSubmit(data)
  {
    this.errorMsg = "";
    if( this.personalDtlsFrm.get("name").hasError("required")
    || this.personalDtlsFrm.get("state").hasError("required")
    || this.personalDtlsFrm.get("email").hasError("required")
    || this.personalDtlsFrm.get("country").hasError("required")
    || this.personalDtlsFrm.get("city").hasError("required") 
    )
    {
      this.errorMsg = "Enter all mandatory fields";
    }
    else if (this.personalDtlsFrm.get("email").hasError("pattern"))
    {
      this.errorMsg = "Enter valid email address";
    }
    else if (this.personalDtlsFrm.get("countryCode").hasError("pattern"))
    {
      this.errorMsg = "Enter valid country code";
    }
    else if (this.personalDtlsFrm.get("phoneNum").hasError("pattern"))
    {
      this.errorMsg = "Enter valid phone number";
    }
    else if(this.personalDtlsFrm.get("dob").hasError("inValidDOB"))
    {
      this.errorMsg = "Enter valid Date of Birth (Minimumm age  18 years)."
    }

    if(this.errorMsg != "")
    {
      this.errorMsg = "** " + this.errorMsg;
      return;
    }
    else
    {
      this.userPersDtls.fullname = this.personalDtlsFrm.get("name").value;
      this.userPersDtls.email = this.personalDtlsFrm.get("email").value;
      if (typeof this.personalDtlsFrm.get("dob").value != 'undefined')
        this.userPersDtls.dateOfBirth = this.personalDtlsFrm.get("dob").value;
      this.userPersDtls.city = this.personalDtlsFrm.get("city").value;
      this.userPersDtls.state = this.personalDtlsFrm.get("state").value;
      this.userPersDtls.country = this.personalDtlsFrm.get("country").value;
      if (typeof this.personalDtlsFrm.get("countryCode").value != 'undefined')
        this.userPersDtls.countryCode = this.personalDtlsFrm.get("countryCode").value;
      if (typeof this.personalDtlsFrm.get("phoneNum").value != 'undefined')
        this.userPersDtls.phoneNum = this.personalDtlsFrm.get("phoneNum").value;


      if(this.fileObj != null)
      {
        console.log("it is there "+this.fileObj);
        if(this.userPersDtls.profileImgFileId == null || this.userPersDtls.profileImgFileId == "" ||
          this.userPersDtls.profileImgFileId == "default.png") 
        {
          //New file upload
          console.log("New file upload");
          this.mentorSrv.uploadNewFile(this.fileObj).subscribe(response =>
            {
              if (response.uploaded == true)
              //if(response.statusCode == 200)
              {
                this.userPersDtls.profileImgFileId = response.Object._id;
              }
              else
              {
                this.errorMsg = "Could not upload Profile Image."
                return;
              }
              this.updatePersDtls();
            });
            // this.userPersDtls.profileImgFileId = null;
        }
        else
        {

          //Profile pic file uploaded before, so, update the file
          //New updated file upload
          console.log("New updated file upload");
          this.mentorSrv.updateUserFile(this.userPersDtls.profileImgFileId, this.fileObj).subscribe(response =>
            {
              if (response.updated == true || response.updated == "true")
              //if(response.statusCode == 200)
              {
                // this.userPersDtls.profileImgFileId = response.Object._id;
                console.log(response);
                this.mentorSrv.getUserFile(this.userPersDtls.profileImgFileId).subscribe(
                  response => {
                    let data = response.blob.data;
                    if (response.blob.data != null)
                    {
                      AppComponent.appUser.profilePic = this.mentorSrv.convertProfilePic(response.blob.data);
                    }
                  
                  }, (err: HttpErrorResponse) => 
                  {
                    console.log("Its throwing error");
                    console.debug(err.message);
                  }
                )
              }
              else
              {
                this.errorMsg = "Could not upload Profile Image."
                return;
              }
              this.updatePersDtls();
            });
        }
      }
      else
      {
        console.log("fileObj is not there");
        this.updatePersDtls();
      }



      //Call service to post data

    }
  }

  updatePersDtls()
  {
    //Update profile data along with the profileImageid
    // this.mentorSrv.updateProfile(this.userPersDtls, null, "PersonalDetails").subscribe(response =>
    // {
    //     if (response.statusCode == 200)
    //     // if(true)
    //     {
    //       if(!this.profNotCompleted)
    //       {
    //         this.profileDataSrv.setPersDtlsData(this.userPersDtls);
    //         this.profileDataSrv.setMessage("Personal details saved successfully");
    //         this.profileDataSrv.setDataUpdatedFlag(true);
    //         this.appRoute.navigate(['/settings/profile']);
    //         console.log("Hello going to settings");
    //       }
    //       else
    //       {
    //         //This is firsttime login and the user completing his profile
    //         this.appRoute.navigate(['complete-profile/prof-dtl']);
    //         console.log("Hello going to complete professional details");
    //       }
          
    //     }
    //     else
    //     {
    //       this.errorMsg = "Error: Profile data could not be updated. Please contact admin for further details.";
    //     }
    //   });
  }

  onClickCancel()
  {
    this.appRoute.navigate(['/settings/profile']);
  }

  profImgFileUpload(fileInput: any) {
    if (fileInput.target.files && fileInput.target.files[0])
    {
      console.log(fileInput.target.files);
      let myFile = <File>fileInput.target.files[0];

      this.fileObj = myFile;
      console.log(this.fileObj);
      this.personalDtlsFrm.patchValue( {"fileInputLbl": myFile.name} );
      this.fileName = myFile.name;
    }
  }

  fileInputClick()
  {
    
    let el: HTMLElement = this.fileUploadchild.nativeElement;
    el.click();

  }

}


function checkDOB(control: AbstractControl) : {[key: string]: boolean} | null
{
    if(new Date().getFullYear() - (new Date(control.value)).getFullYear() < 18)
    {
      return {inValidDOB: true}
    }

  return null;
}