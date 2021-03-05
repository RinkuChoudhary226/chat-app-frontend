import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { UserProjectDtls } from '../classes/user-project-dtls';



@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private myHTTP: HttpClient, private sanitizer : DomSanitizer) { }
  createProject( userProject : UserProjectDtls) : Observable<any>
  {
    let projectservice : string = AppComponent.serviceBaseURl + '/api/project';
    let data = {
        'name' : userProject.name,
        'description' : userProject.description,
        'type' : userProject.type,
        'skills' : userProject.skills,
        'category' : userProject.category,
        'start_date' : userProject.start_date,
        'end_date' : userProject.end_date,
        'relatedPDF' : userProject.relatedPDF,
        'url' : userProject.url,
        'github_repo' : userProject.github_repo
    }
    let headers = {
      'Content-Type' : 'application/json'
    };
        return this.myHTTP.post(projectservice, data, {headers});
  }

  getProjectData( projectId : string)
  {
    let projectservice : string = AppComponent.serviceBaseURl + '/api/project/' + projectId;
    let headers = {
        'Content-Type' : 'application/json'
      };
      return this.myHTTP.get<UserProjectDtls>(projectservice, {headers});
  }

  updateProjectData(userProject : UserProjectDtls, projectId : string)
  {
    let projectservice : string = AppComponent.serviceBaseURl + '/api/project/' + projectId;
    let headers = {
        'Content-Type' : 'application/json'
      };
      return this.myHTTP.put<UserProjectDtls>(projectservice, {headers});
  }
  
  getAllProjects(queryParams : string){
    let projectservice : string = AppComponent.serviceBaseURl + '/api/project/' + queryParams;
    let headers = {
        'Content-Type' : 'application/json'
      };
      return this.myHTTP.get<UserProjectDtls[]>(projectservice, {headers});

  }

  createQueryParam( filter : Object){
      var queryParam : string = "?";
      

  }

}
