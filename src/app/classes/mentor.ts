import { SafeUrl } from '@angular/platform-browser';

export class Mentor {
    mentorId : string;
    avatarImg : SafeUrl;
    mentorName : string;
    jobTitle : string;
    starRating: number;
    jobDesc : string;
    langKnown: string[];
    topics: string[];

    constructor(id:string, avtr: SafeUrl, name: string, title:string, rating:number,desc:string, lang: string[], topics: string[])
    {
        this.mentorId = id;
        this.avatarImg = avtr;
        this.mentorName =  name;
        this.jobTitle = title;
        this.starRating = rating;
        this.jobDesc = desc;
        this.langKnown = lang;
        this.topics = topics;
    }



}
