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
  selector: 'app-my-proj',
  templateUrl: './my-proj.component.html',
  styleUrls: ['./my-proj.component.scss']
})
export class MyProjComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
