import { SafeUrl } from '@angular/platform-browser';

export class UserInfo {
    userName: string;
    userId: string;
    password: string;
    accountType: string;
    profileCompletionStatus: ProfileCompletionStatus;
    profileImageId : string;
    profilePic : SafeUrl;
    // fullName: string;
    isMentor: boolean;
    bearerToken: string;
    email : string;

    constructor(name: string, id:string, pwd: string,accountType: string,
         profileCompletionStatus: ProfileCompletionStatus, 
        //  profileImageId : string,
        //  profilePic : SafeUrl,
        //  fullName: string,
         token: string, 
        //  isMentor: boolean
    )
    {
        this.userName = name;
        this.userId = id;
        this.password = pwd;
        this.accountType = accountType;
        this.profileCompletionStatus = profileCompletionStatus;
        //this.profileImageId = profileImageId;
        // this.profilePic = profilePic;
        // this.fullName = fullName;
        // this.isMentor = isMentor;
        this.bearerToken = token;
    }
}

// "isPersonalDetailsCompleted": false,
//     "isProfessionalDetailsCompleted": false,
//     "isInterestedTopicsCompleted": false
export class ProfileCompletionStatus {
    isPersonalDetailsCompleted: boolean;
    isProfessionalDetailsCompleted: boolean;
    isInterestedTopicsCompleted: boolean;
    constructor(isPersonalDetailsCompleted: boolean,
          isProfessionalDetailsCompleted: boolean, 
          isInterestedTopicsCompleted: boolean){
            this.isPersonalDetailsCompleted = isPersonalDetailsCompleted
            this.isProfessionalDetailsCompleted = isProfessionalDetailsCompleted
            this.isInterestedTopicsCompleted = isInterestedTopicsCompleted
          }
}

