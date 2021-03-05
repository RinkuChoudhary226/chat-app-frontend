import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef, ElementRef } from '@angular/core';
import {FormControl, ReactiveFormsModule, ValidatorFn, FormGroup, Validators, AbstractControl} from '@angular/forms';
import { Router } from '@angular/router';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {AppComponent} from '../app.component';
import { UserInfo } from '../classes/user-info';
import { Mentor } from '../classes/mentor';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { newArray } from '@angular/compiler/src/util';
import { MentorService } from '../services/mentor.service';
import { ProfileCompletionStatus } from '../classes/user-info';

@Component({
  selector: 'app-site-home',
  templateUrl: './site-home.component.html',
  styleUrls: ['./site-home.component.scss']
})
export class SiteHomeComponent implements OnInit {
  @ViewChild('lnkHome') lnkHome : ElementRef<HTMLElement>;
  @ViewChild('lnkFeatures') lnkFeatures : ElementRef<HTMLElement>;
  @ViewChild('lnkTestimonials') lnkTestimonials : ElementRef<HTMLElement>;

  @ViewChild('loginModalTmpl') loginModalTmpl : TemplateRef<any>;
  @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
  backdrop: any;

  @ViewChild('signupModalTmpl') signupModalTmpl : TemplateRef<any>;
  @ViewChild('vc', {read: ViewContainerRef}) vcsignup: ViewContainerRef;

  @ViewChild('messageModalTmpl') messageModalTmpl : TemplateRef<any>;
  @ViewChild('vcMessage', {read: ViewContainerRef}) vcMessage: ViewContainerRef;

  errorMsg: string = "  ";
  successMsg: string = ""; //"Registration successful. Login to continue..";
  registrationSuccess : boolean = false;

  // Mentors corousel
  allMentors : Mentor[];
  mentorImg : any;
  //oneMentor : Mentor = null;

  loginformdata = new FormGroup(
    {
      emailid : new FormControl(""),
      password: new FormControl("123456"),
      rememberMe: new FormControl("")
    }
  );

  signupformdata = new FormGroup(
    {
      name2 :  new FormControl("", Validators.required),
      emailid2 : new FormControl("", 
        [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
      accountType2 : new FormControl(null, Validators.required),
      password: new FormGroup (
        {
          pwd2 : new FormControl("", Validators.required),
          confirmpwd2 : new FormControl("", Validators.required)
        },
        {
          validators : checkPasswords
        }
      ),
      agreement2 : new FormControl("", Validators.required)
    }
  );

  messageformdata = new FormGroup(
    {
      userMessage : new FormControl()
    }
  );


  constructor(private appRoute: Router, private http: HttpClient, private sanitizer: DomSanitizer, private longinSrv : MentorService) { 
    this.loadMentorsCarousel();
  }

  ngOnInit(): void {
  }

  /* Functions for Message dialog START */
  showMessageDialog()
  {
    this.clearForms();
    let myView = this.messageModalTmpl.createEmbeddedView(null);
    this.vcMessage.insert(myView);

    this.messageModalTmpl.elementRef.nativeElement.previousElementSibling.classList.remove('fade');
    this.messageModalTmpl.elementRef.nativeElement.previousElementSibling.classList.add('modal-open'); 
    this.messageModalTmpl.elementRef.nativeElement.previousElementSibling.style.display = 'block';
    this.backdrop = document.createElement('DIV')
    this.backdrop.className = 'modal-backdrop';
    document.body.appendChild(this.backdrop);
  }

  closeMessageDialog() {
    this.vcMessage.clear();
    document.body.removeChild(this.backdrop);
    this.showLoginDialog();
  }

  OnClickMessageSubmit(data)
  {
    this.closeMessageDialog();
  }




  /* Functions for Login dialog START */
  showLoginDialog()
  {
    this.clearForms();
    let myView = this.loginModalTmpl.createEmbeddedView(null);
    this.vc.insert(myView);

    this.loginModalTmpl.elementRef.nativeElement.previousElementSibling.classList.remove('fade');
    this.loginModalTmpl.elementRef.nativeElement.previousElementSibling.classList.add('modal-open'); 
    this.loginModalTmpl.elementRef.nativeElement.previousElementSibling.style.display = 'block';
    this.backdrop = document.createElement('DIV')
    this.backdrop.className = 'modal-backdrop';
    document.body.appendChild(this.backdrop);
  }

  closeLoginDialog() {
    this.vc.clear();
    document.body.removeChild(this.backdrop);
  }

  OnClickLoginSubmit(data)
  {
    try
    {
      // Service call will come here
      this.longinSrv.loginUser(this.loginformdata.controls['emailid'].value, this.loginformdata.controls['password'].value).subscribe((response) => 
      {
        if (response.statusCode == 200)
        {
          /*
          "isMentor": true,
            "profileImage": "default.png",
            "username": "phani kumar",
          "profileCompletionStatus": {
            "isPersonalDetailsCompleted": false,
            "isProfessionalDetailsCompleted": false,
            "isInterestedTopicsCompleted": false
        }}
          */
          let userData = response.content.user;
          let bearerToken = response.content.token;
          let accountType = response.content.user.isMentor ? "Mentor": "Mentee";
          let profileCompletionStatus = new ProfileCompletionStatus(response.content.profileCompletionStatus.isPersonalDetailsCompleted,
            response.content.profileCompletionStatus.isProfessionalDetailsCompleted,
            response.content.profileCompletionStatus.isInterestedTopicsCompleted)


          AppComponent.appUser = new UserInfo(userData.username, userData._id,this.loginformdata.controls['password'].value,accountType,profileCompletionStatus,"Bearer " + bearerToken)
          AppComponent.appUser.email = userData.email;
          // AppComponent.appUser = new UserInfo(userData.username, userData._id, this.loginformdata.controls['password'].value, 
          //   "Bearer " + bearerToken, userData.isMentor);
          
          if(profileCompletionStatus.isPersonalDetailsCompleted){
            AppComponent.appUser.profileImageId = userData.profileImage;
          }
          
          
          //set local storage
          localStorage.setItem('user',JSON.stringify(AppComponent.appUser));


          console.log(JSON.parse(localStorage.getItem('user')));

          
          // if (this.loginformdata.controls['emailid'].value == "upbabu@gmail.com" && this.loginformdata.controls['password'].value == "123456")
          // {
            this.errorMsg = "Success";
            this.closeLoginDialog();
            if(!profileCompletionStatus.isPersonalDetailsCompleted)
            {
              console.log(AppComponent.appUser.profileImageId);
              
              this.appRoute.navigate(['complete-profile/personal-dtl'])
            }else if(!profileCompletionStatus.isProfessionalDetailsCompleted){
              this.appRoute.navigate(['complete-profile/prof-dtl'])
            }else if(!profileCompletionStatus.isInterestedTopicsCompleted){
              this.appRoute.navigate(['complete-profile/interest-topics'])
            }else{
              this.appRoute.navigate(['user-home']);
            }
            AppComponent.sessionState = true;
            return true;
        }
        else // statuscode = 404 means login not valid
        {
          this.errorMsg = "Login or Password Invalid"
        }
        return false;
      });
    }
    catch (ex)
    {
      console.log(ex);
      throw ex;
    }
  }

  OnclickSignup()
  {
      this.closeLoginDialog();
      this.showSignupDialog();

  }
  /* Functions for Login dialog END */


  /* Function for Signup Dialog Start */
  passwordFocusIn()
  {
    document.getElementById("pwdCriteria").innerHTML = "A minimum 8 characters containing a combination of <strong>uppercase and lowercase letter</strong>, <strong>special character</strong> and <strong>number</strong>";
  }

  passwordFocusOut()
  {
    document.getElementById("pwdCriteria").innerHTML = "";
  }

  showSignupDialog()
  {
    this.clearForms();
    let myView = this.signupModalTmpl.createEmbeddedView(null);
    this.vcsignup.insert(myView);

    this.signupModalTmpl.elementRef.nativeElement.previousElementSibling.classList.remove('fade');
    this.signupModalTmpl.elementRef.nativeElement.previousElementSibling.classList.add('modal-open'); 
    this.signupModalTmpl.elementRef.nativeElement.previousElementSibling.style.display = 'block';
    this.backdrop = document.createElement('DIV')
    this.backdrop.className = 'modal-backdrop';
    document.body.appendChild(this.backdrop);

  }

  OnClickSignupSubmit(data)
  {
    let value = this.signupformdata.status;
    this.errorMsg = "";
    if (this.signupformdata.get('name2').hasError('required')
    || this.signupformdata.get('emailid2').hasError('required')
    || this.signupformdata.get('password.pwd2').hasError('required')
    || this.signupformdata.get('password.confirmpwd2').hasError('required')
    || this.signupformdata.get('accountType2').hasError('required')
    || this.signupformdata.get('agreement2').hasError('required')
    )
    {
       this.errorMsg = "Please enter all mandatory fields";
    }
    if (this.signupformdata.get('emailid2').errors?.pattern)
    {
      this.errorMsg = "Please enter valid email address";
    }
    if (this.signupformdata.get('password').hasError('notSame'))
    {
      this.errorMsg = "Password and Confirm Password should be same.";
    }
    
    if (this.errorMsg == "")
    {
      // signup service call
      this.longinSrv.signUpUser(this.signupformdata.get('name2').value, this.signupformdata.get('emailid2').value,
        this.signupformdata.get('accountType2').value, this.signupformdata.get('password.pwd2').value).subscribe((response) => 
      {
        if (response.statusCode == 200)
        {
          //this.errorMsg = this.successMsg;
          this.registrationSuccess = true;
          this.closeSignupDialog();
          // this.showLoginDialog();
          this.showMessageDialog();
        }
        else
        {
          this.errorMsg = response.errors;
          this.registrationSuccess = false;
        }
      });
    }
}
    

  closeSignupDialog ()
  {
    this.vcsignup.clear();
    document.body.removeChild(this.backdrop);
  }
  OnclickSignin()
  {
    this.closeSignupDialog();
    this.showLoginDialog();
  }

  /* Function for Signup Dialog End */

  clearForms()
  {
    // this.loginformdata.reset();
    this.signupformdata.reset();
    if(this.errorMsg != this.successMsg)
    {
    this.errorMsg = "";
    }
    
  }

  navLinkClick(src: any)
  {
    this.lnkHome.nativeElement.classList.remove('active');
    this.lnkFeatures.nativeElement.classList.remove('active');
    this.lnkTestimonials.nativeElement.classList.remove('active');
    if (src.currentTarget.id == "lnkHome")
    {
      this.lnkHome.nativeElement.classList.add('active');
    }
    else if (src.currentTarget.id == "lnkFeatures")
    {
      this.lnkFeatures.nativeElement.classList.add('active');
    }
    else if(src.currentTarget.id == "lnkTestimonials")
    {
      this.lnkTestimonials.nativeElement.classList.add('active');
    }
    
  }

  loadMentorsCarousel()
  {
    this.allMentors = new Array();
    //var mentorImg : SafeUrl = null;
    var jobDesc: string = "10+ years of experience in field of data analytics. Have experience in working for more than 20 projects for many clients.";

    try 
    {
      this.longinSrv.getAllMentor().subscribe(response =>
        {
          if(response.statusCode == 200)
          {
              let mentorsArr = response.content;
              if (mentorsArr.length > 0)
              {
                let itemsNeeded = mentorsArr.length;
                if( (mentorsArr.length > 0) && (itemsNeeded % 2 != 0) )
                {
                  itemsNeeded =  itemsNeeded - 1;
                }
                
                for(let i = 0; ((i < itemsNeeded) && (i < 10)) ; i++)
                {
                  let oneMentor = mentorsArr[i];
                  let mentorObj : Mentor = new Mentor(oneMentor._id, "", oneMentor.fullName, oneMentor.jobTitle, 4, oneMentor.jobDescription, 
                  oneMentor.languages, oneMentor.interestedTopics);

                  if(oneMentor.profileImage !== undefined && oneMentor.profileImage !== "default.png") {
                    this.longinSrv.getUserFile(oneMentor.profileImage).subscribe(response => {

                      let data = response.blob.data;
                      if (response.blob.data != null)
                      {
                          mentorObj.avatarImg = this.longinSrv.convertProfilePic(response.blob.data);
                      }
                    }, (err: HttpErrorResponse) => 
                    {
                      console.log(err.message);
                    }
                    );
                  }
                  this.allMentors.push(mentorObj);
                }
              }
          }
          else
          {
            console.debug("getAllMentor returned " + response.statusCode + " status code");
          }
    
        });


    }
    catch
    {
      console.debug("ERror in loadMentorsCarousel");
    }

  }

  readProfileImage(fileName : string, mentor : Mentor)
  {
    var data: Blob;
    var base64Str : string;

    this.http.get(fileName, {responseType: 'blob'}).subscribe(blobData => {
      data = blobData;
      if (data != null)
      {
        var reader = new FileReader();
        reader.readAsDataURL(data); 
        
  
        reader.onloadend = (e) => {
          base64Str = reader.result.toString();
          console.debug(base64Str);
          mentor.avatarImg = this.sanitizer.bypassSecurityTrustUrl(base64Str);
          }
    }
    }, (err: HttpErrorResponse) => 
    {
      this.errorMsg = err.error;
      console.debug(err.message);
    }
    );
  }

}


function checkAccontType(control: AbstractControl) : {[key: string]: boolean} | null
{
  if (control.value < 1 && control.value > 2)
  {
    return {required: true}
  }

  return null;
}


const checkPasswords: ValidatorFn = (group: FormGroup) => 
{ // here we have the 'passwords' group
  const pass = group.get('pwd2').value;
  const confirmPass = group.get('confirmpwd2').value;

  if (pass != null && confirmPass != null)
  {
    return pass === confirmPass ? null : { notSame: true }     
  }
  return null;
}

