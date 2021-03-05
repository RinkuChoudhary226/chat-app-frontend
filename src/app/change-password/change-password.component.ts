import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { AppComponent } from '../app.component';
import {Router} from '@angular/router';
import { MentorService } from '../services/mentor.service';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(private appRoute: Router, private mentorSrv: MentorService) { }

  errorMsg : string = "";
  successMsg : string = "";
  
  changePwdFrm = new FormGroup(
    {
      currentPwd : new FormControl("", Validators.required),
      password: new FormGroup (
        {
          newPwd : new FormControl("", [ Validators.required,
            Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]),
          cnfrmPwd : new FormControl("", Validators.required)
        },
        {
          validators : checkPasswords
        }
      )
    }
  );

  ngOnInit(): void {
    // this.changePwdFrm.patchValue({currentPwd: AppComponent.appUser.password});
  }

  OnClickUpdateSubmit(data)
  {
    this.errorMsg = "";
    if(this.changePwdFrm.get("currentPwd").hasError('required')
      )
    {
      this.errorMsg += "Enter all mandatory fields."
      return false;
    }
    if(this.changePwdFrm.get("currentPwd").value != AppComponent.appUser.password)
    {
      this.errorMsg += "Current password doesn't match the user password"
      return false;
    }
    if(this.changePwdFrm.get("password.newPwd").hasError('required')
      || this.changePwdFrm.get("password.cnfrmPwd").hasError('required')
      )
    {
      this.errorMsg += "Enter all mandatory fields."
      return false;
    }
    if(this.changePwdFrm.get("password.newPwd").hasError('pattern'))
    {
      this.errorMsg += "New password should match the password criteria."
      return false;
    }
    if(this.changePwdFrm.get("password").hasError('notSame'))
    {
      this.errorMsg += "New password and Confirm password should be the same."
      return false;
    }
    let newPwd = this.changePwdFrm.get("password.newPwd").value;
    this.mentorSrv.changePassword(newPwd).subscribe(response =>
      {
         if (response.statusCode == 200)
         {
          this.successMsg = "Password Changed Successfully";
         }
      });



  }


  onClickCancel()
  {
    this.appRoute.navigate(['/settings/profile']);
  }

}


const checkPasswords: ValidatorFn = (group: FormGroup) => 
{ // here we have the 'passwords' group
  const pass = group.get('newPwd').value;
  const confirmPass = group.get('cnfrmPwd').value;

  if (pass != null && confirmPass != null)
  {
    return pass === confirmPass ? null : { notSame: true }     
  }
  return null;
}

