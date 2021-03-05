import { Component, OnInit, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { Mentor } from '../classes/mentor';
import { stringify } from 'querystring';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MentorService } from '../services/mentor.service';

@Component({
  selector: 'app-mentors',
  templateUrl: './mentors.component.html',
  styleUrls: ['./mentors.component.scss']
})
export class MentorsComponent implements OnInit {
  @ViewChild('filtersModalTmpl') filtersModalTmpl : TemplateRef<any>;
  @ViewChild('vc', {read: ViewContainerRef}) vc: ViewContainerRef;
  backdrop: any;


  isListView : boolean = true;
  public mentorList : Mentor[] = [];
  alllanguages : string[] = ["English", "Hindi", "Arabic", "Telugu", "French", "Spanish"];
  allJobTitle : string[] = ["DB Design", "Data Analyst", "Angular", "SAP", "HTML", "Functional Analyst", "Web Designer"];
  allTopics: string[] = ["Gameing", "Fintech", "Data Patterns", "B2B", "SAAS", "Art & Media", "IT"];
  // public isListView : boolean = true;

  filtersformdata = this.buildForm();

  buildForm()
  {
    let fb: FormGroup = new FormGroup({});
    fb.addControl("cntrlLang", new FormControl(""));
    fb.addControl("cntrlRating", new FormControl(""));
    fb.addControl("ctrlJobTitle", new FormControl(""));
    fb.addControl("ctrlTopics", new FormControl(""));

    return fb;
  }

  constructor(private mentorSrv : MentorService) { }

  ngOnInit(): void {

    /* to be changed to api call later */
    try
    {
    this.pushMentorRecords();
    }
    catch(error)
    {
      console.log(error.name);
    }
  }


  pushMentorRecords()
  {

    try{

    
    this.mentorSrv.getAllMentor().subscribe((response) =>
    {
      if(response.statusCode == 200)
      {
          let mentorsArr = response.content;
          if (mentorsArr.length > 0)
          {
            for(let i = 0; i < mentorsArr.length; i++)
            {
              let oneMentor = mentorsArr[i];
              let mentorObj = new Mentor(oneMentor._id, "", oneMentor.fullName, oneMentor.jobTitle, 4, oneMentor.jobDescription, 
              oneMentor.languages, oneMentor.interestedTopics);
              this.mentorSrv.getUserFile(oneMentor.profileImage).subscribe(response => {

                let data = response.blob.data;
                if (response.blob.data != null)
                {
                    mentorObj.avatarImg = this.mentorSrv.convertProfilePic(response.blob.data);
                }
              }, (err: HttpErrorResponse) => 
              {
                console.log(err.message);
              }
              );

              this.mentorList.push(mentorObj);


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

    }
    console.debug("Records in mentorList");
    console.debug("Records in mentorList" + this.mentorList.length);


  }

  listViewClick()
  {
    this.isListView = true;
  }

  tileViewClick()
  {
    this.isListView = false;

  }

  filtersClick()
  {
    let myView = this.filtersModalTmpl.createEmbeddedView(null);
    this.vc.insert(myView);

    this.filtersModalTmpl.elementRef.nativeElement.previousElementSibling.classList.remove('fade');
    this.filtersModalTmpl.elementRef.nativeElement.previousElementSibling.classList.add('modal-open'); 
    this.filtersModalTmpl.elementRef.nativeElement.previousElementSibling.style.display = 'block';
    this.backdrop = document.createElement('DIV')
    this.backdrop.className = 'modal-backdrop';
    document.body.appendChild(this.backdrop);

  }

  closeFiltersDialog()
  {
    this.vc.clear();
    document.body.removeChild(this.backdrop);
  }

  OnClickFiltersSubmit(data)
  {

    this.closeFiltersDialog();
  }

}



