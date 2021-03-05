import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppComponent } from '../app.component';
import { Observable } from 'rxjs';
import { UserPersonalDtls } from '../classes/user-personal-dtls';
import { UserProfDtls } from '../classes/user-prof-dtls';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';



@Injectable({
  providedIn: 'root'
})
export class MentorService {

  constructor(private myHTTP: HttpClient, private sanitizer : DomSanitizer) { }

//   SignIn
  loginUser(email: string, pwd: string) : Observable<any>
  {
    let loginService : string = AppComponent.serviceBaseURl + '/api/login';

    let data = {
      'email': email,
      'password': pwd
    };
  
    let headers = {
      'Content-Type' : 'application/json'
    };

      
    return this.myHTTP.post<any>(loginService, data, {headers} );
      
  }


  signUpUser(name: string, email: string, isMentor: boolean, password: string) : Observable<any>
  {
    let signUpService : string = AppComponent.serviceBaseURl + '/api/signup';

    let data = {
      'username': name,
      'email': email,
      'password': password,
      'fullName': name,
      'isMentor': isMentor
      // 'skillSetStr' : '',
    };
  
    let headers = {
      'Content-Type' : 'application/json'
    };

      
    return this.myHTTP.post<any>(signUpService, data, {headers} );
    
  }

  getAllMentor() : Observable<any>
  {
    let headers = {
      'Authorization' : AppComponent.appUser.bearerToken
    };
    let getAllMentService : string = AppComponent.serviceBaseURl + '/api/getAllMentor';
    return this.myHTTP.get(getAllMentService, {headers});
  }

  getMentorData(mentorId : string) : Observable<any>
  {
    let getMentorService : string = AppComponent.serviceBaseURl + '/api/Mentor/' + mentorId;
    let headers = {
      'Authorization' : AppComponent.appUser.bearerToken
    };
    return this.myHTTP.get<any>(getMentorService, {headers});
  }

  getUserData(mentorId : string) : Observable<any>
  {
    let getMentorService : string = AppComponent.serviceBaseURl + '/backend/users/' + mentorId;
    let headers = {
      'Authorization' : AppComponent.appUser.bearerToken
    };

    return this.myHTTP.get<any>(getMentorService, {headers});
  }


  updateProfile(persDtls : UserPersonalDtls, profDtls : UserProfDtls, updationType : string) : Observable<any>
  {
    let updateProfileService : string = AppComponent.serviceBaseURl + '/backend/users/' + AppComponent.appUser.userId;
    let headers = {
      'Authorization' : AppComponent.appUser.bearerToken
    };
    let bodyStr: any = {};
    // bodyStr= "{";

    //Personal Details
    if(persDtls != null && persDtls.fullname != "" && persDtls.email != "" && updationType == "PersonalDetails")
    {
      bodyStr.fullName = persDtls.fullname;
      bodyStr.email =  persDtls.email;
      bodyStr.birthDate = persDtls.dateOfBirth;
      bodyStr.personal_city = persDtls.city;
      bodyStr.personal_state = persDtls.state;
      bodyStr.personal_country = persDtls.country;
      bodyStr.mobile = persDtls.phoneNum;
      bodyStr.countryCode = persDtls.countryCode;

      if(persDtls.profileImgFileId != "" && persDtls.profileImgFileId != null)
        bodyStr.profileImage = persDtls.profileImgFileId;
      console.log("In personal details fill up");
    }

    //Professional Details
    if(profDtls != null && profDtls.jobDescription != "" && profDtls.jobTitle != "" && updationType == "ProfessionalDetails")
    {
      bodyStr.jobTitle = profDtls.jobTitle;
      bodyStr.jobDescription = profDtls.jobDescription;
      bodyStr.experience = profDtls.totalExperience;
      bodyStr.currentOrganization = profDtls.organization;
      bodyStr.skills = profDtls.skillsArr;
      bodyStr.languages = profDtls.languagesArr;
      bodyStr.industriesWorkingIn = profDtls.industryWork;
      console.log("In professional details fill up");
    }


    //Interested Topics
    // if(profDtls != null && profDtls.interestTopics.length > 0 && updationType == "InterestedTopics")
    if(profDtls != null && updationType == "InterestedTopics")
    {
      bodyStr.interestedTopics = profDtls.interestTopics;
      console.log("In interested topic details fill up");
    }

    return this.myHTTP.put(updateProfileService, bodyStr, {headers});
  }

  changePassword(newPwd : string) : Observable<any>
  {
    let updateProfileService : string = AppComponent.serviceBaseURl + '/backend/users/' + AppComponent.appUser.userId;
    let headers = {
      'Authorization' : AppComponent.appUser.bearerToken
    };

    let pwdData = {
      password : newPwd
    };

    return this.myHTTP.put(updateProfileService, pwdData, {headers});
  }

  uploadNewFile(fileSrc : File) : Observable<any>
  {
    let fileUploadService : string = AppComponent.fileUploadBaseURL + '/api/file';

    let formDataBody = new FormData();
    formDataBody.append('fileObject', fileSrc);
    let headers = {
      'Authorization' : AppComponent.appUser.bearerToken
    };
    return this.myHTTP.post(fileUploadService, formDataBody, {headers});
  }

  deleteUserFile(fileId : string): Observable<any>
  {
    let fileUploadService : string = AppComponent.fileUploadBaseURL + '/api/file/' + fileId;
    let headers = {
      'Authorization' : AppComponent.appUser.bearerToken
    };
    return this.myHTTP.delete(fileUploadService, {headers});
  }

  updateUserFile(fileId : string, fileSrc : File) : Observable<any>
  {
    let fileUploadService : string = AppComponent.fileUploadBaseURL + '/api/file/' + fileId;

    let formDataBody = new FormData();
    formDataBody.append('fileObject', fileSrc);
    let headers = {
      'Authorization' : AppComponent.appUser.bearerToken
    };
    return this.myHTTP.put(fileUploadService, formDataBody, {headers});

  }

  getUserFile(fileId : string) : Observable<any>
  {
    let fileUploadService : string = AppComponent.fileUploadBaseURL + '/api/file/' + fileId;
    let headers = {
      'Authorization' : AppComponent.appUser.bearerToken
    };
    return this.myHTTP.get(fileUploadService, {headers});
  }

  convertProfilePic(bufferData : any) : SafeUrl
  {
    let objectURL = 'data:image/png;base64,' + this.arrayBufferToBase64(bufferData);
    return this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }

  private   arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
       binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }



}
