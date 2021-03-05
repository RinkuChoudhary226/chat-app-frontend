import { SafeUrl } from '@angular/platform-browser';


export class MentorChat {
    mentorId : string;
    avatarImg : SafeUrl;
    mentorName : string;
    jobTitle : string;
    starRating: number;
    jobDesc : string;
    langKnown: string[];
    topics: string[];
    chatTime: Date;
    unReadMessages : number;
    userOnline: boolean = false;
    

    get formatChatTime(): string
    {
        if(this.chatTime === undefined) return "";

        let tempTime : Date = new Date(this.chatTime);
        tempTime.setHours(0,0,0,0);
        let _today : Date = new Date();
        _today.setHours(0,0,0,0);
        if(tempTime < _today)
        {
            return this.chatTime.getDate() + '/' + (this.chatTime.getMonth() + 1);
        }
        else
        {
            return this.chatTime.getHours() + ':' + this.chatTime.getMinutes();
        }
    }

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
